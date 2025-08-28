import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  Calendar,
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { supabase } from "@/integrations/supabase/client"
import { useDashboardStore } from "@/stores/dashboardStore"

// Mock data for the dashboard
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
]

const bookingData = [
  { name: 'Mon', bookings: 45 },
  { name: 'Tue', bookings: 52 },
  { name: 'Wed', bookings: 48 },
  { name: 'Thu', bookings: 61 },
  { name: 'Fri', bookings: 78 },
  { name: 'Sat', bookings: 85 },
  { name: 'Sun', bookings: 72 },
]

const tenantStatusData = [
  { name: 'Active', value: 340, color: '#10b981' },
  { name: 'Trial', value: 85, color: '#f59e0b' },
  { name: 'Suspended', value: 12, color: '#ef4444' },
]

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalBookings: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { refreshInterval } = useDashboardStore()

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch tenant count
      const { count: tenantCount } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true })
      
      // Fetch active tenants
      const { count: activeCount } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
      
      // Fetch booking count
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      
      setStats({
        totalTenants: tenantCount || 0,
        activeTenants: activeCount || 0,
        totalBookings: bookingCount || 0,
        totalRevenue: 147500 // Mock data for now
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Set up auto-refresh
    const interval = setInterval(fetchDashboardData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Administration</h1>
            <p className="text-muted-foreground">
              Internal staff dashboard for platform management
            </p>
          </div>
          <Button onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Tenants</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTenants}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Platform Revenue Overview</CardTitle>
                  <CardDescription>Monthly platform revenue for the past 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Restaurant Status</CardTitle>
                  <CardDescription>Distribution of restaurant statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={tenantStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tenantStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {tenantStatusData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Booking Trends</CardTitle>
                <CardDescription>Platform-wide bookings by day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Overall platform health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Restaurants</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">72.8%</span>
                    </div>
                    <Progress value={72.8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Satisfaction</span>
                      <span className="text-sm font-medium">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Bella Vista Restaurant</p>
                        <p className="text-xs text-muted-foreground">Signed up 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        <Activity className="h-3 w-3 mr-1" />
                        Updated
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ocean Breeze Bistro</p>
                        <p className="text-xs text-muted-foreground">Updated settings 5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Issue
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mountain View Cafe</p>
                        <p className="text-xs text-muted-foreground">Payment failed 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Response Time</span>
                      <span className="text-sm font-medium">145ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="text-sm font-medium">99.97%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium">0.02%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Connection Pool</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Query Performance</span>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm font-medium">45GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Failed Login Attempts</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Blocked IPs</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <span className="text-sm font-medium">Valid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default Dashboard