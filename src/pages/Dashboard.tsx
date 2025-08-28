import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Zap,
  Target,
  MessageSquare,
  Database,
  Wifi,
  WifiOff
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { useRealtimeData } from "@/hooks/useRealtimeData"
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter"
import { KPICard } from "@/components/dashboard/KPICard"
import { ExportControls } from "@/components/dashboard/ExportControls"
import { useToast } from "@/hooks/use-toast"

// Enhanced mock data for comprehensive analytics
const revenueData = [
  { name: 'Jan', value: 45000, bookings: 1250, tenants: 85 },
  { name: 'Feb', value: 52000, bookings: 1380, tenants: 89 },
  { name: 'Mar', value: 48000, bookings: 1295, tenants: 87 },
  { name: 'Apr', value: 61000, bookings: 1450, tenants: 92 },
  { name: 'May', value: 55000, bookings: 1375, tenants: 94 },
  { name: 'Jun', value: 67000, bookings: 1520, tenants: 97 },
]

const bookingTrendData = [
  { name: 'Mon', bookings: 245, completed: 220, cancelled: 25 },
  { name: 'Tue', bookings: 252, completed: 235, cancelled: 17 },
  { name: 'Wed', bookings: 248, completed: 228, cancelled: 20 },
  { name: 'Thu', bookings: 261, completed: 245, cancelled: 16 },
  { name: 'Fri', bookings: 278, completed: 260, cancelled: 18 },
  { name: 'Sat', bookings: 285, completed: 268, cancelled: 17 },
  { name: 'Sun', bookings: 272, completed: 255, cancelled: 17 },
]

const restaurantStatusData = [
  { name: 'Active', value: 340, color: '#10b981', trend: '+12%' },
  { name: 'Trial', value: 85, color: '#f59e0b', trend: '+5%' },
  { name: 'Suspended', value: 12, color: '#ef4444', trend: '-2%' },
  { name: 'Inactive', value: 8, color: '#6b7280', trend: '0%' },
]

const performanceMetrics = [
  { name: 'API Response Time', value: 145, unit: 'ms', status: 'good', target: 200 },
  { name: 'Database Queries', value: 2.3, unit: 's', status: 'good', target: 3.0 },
  { name: 'SMS Delivery Rate', value: 98.7, unit: '%', status: 'excellent', target: 95.0 },
  { name: 'Email Delivery Rate', value: 99.2, unit: '%', status: 'excellent', target: 98.0 },
  { name: 'Migration Success', value: 99.5, unit: '%', status: 'excellent', target: 99.0 },
  { name: 'Uptime', value: 99.98, unit: '%', status: 'excellent', target: 99.9 },
]

const recentActivityData = [
  {
    id: 1,
    type: 'new_restaurant',
    title: 'Bella Vista Restaurant',
    description: 'New restaurant onboarded',
    timestamp: '2 hours ago',
    status: 'success',
    metadata: { revenue: 2500, bookings: 45 }
  },
  {
    id: 2,
    type: 'high_booking_volume',
    title: 'Ocean Breeze Bistro',
    description: 'Unusual booking spike detected',
    timestamp: '3 hours ago',
    status: 'warning',
    metadata: { spike: '150%', bookings: 89 }
  },
  {
    id: 3,
    type: 'payment_issue',
    title: 'Mountain View Cafe',
    description: 'Payment failure - requires attention',
    timestamp: '5 hours ago',
    status: 'error',
    metadata: { amount: 49.99 }
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Platform Milestone',
    description: '10,000th booking processed',
    timestamp: '1 day ago',
    status: 'success',
    metadata: { milestone: 10000 }
  }
]

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null)
  const { toast } = useToast()
  
  const { 
    data: realtimeData, 
    loading, 
    error, 
    lastUpdated, 
    refreshData 
  } = useRealtimeData({
    refreshInterval: 30000,
    enableCache: true,
    cacheTTL: 60000
  })

  // Connection status for real-time features
  const [isConnected, setIsConnected] = useState(true)

  const handleDateRangeChange = (range: { from: Date; to: Date } | null) => {
    setDateRange(range)
    refreshData(range || undefined)
  }

  const handleRefresh = () => {
    refreshData(dateRange || undefined)
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest information.",
    })
  }

  // Error boundary for charts
  const ChartErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    try {
      return <>{children}</>
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Unable to load chart
        </div>
      )
    }
  }

  // Memoized calculations for performance
  const kpiMetrics = useMemo(() => {
    if (!realtimeData) return []
    
    return [
      {
        title: "Platform Restaurants",
        value: realtimeData.totalTenants,
        icon: Building,
        trend: { value: 12, label: "from last month", direction: "up" as const },
        description: "Total registered restaurants",
        format: "number" as const,
        accessibilityLabel: `${realtimeData.totalTenants} restaurants registered on the platform`
      },
      {
        title: "Active Restaurants", 
        value: realtimeData.activeTenants,
        icon: CheckCircle,
        trend: { value: 8, label: "from last month", direction: "up" as const },
        description: "Currently active and operational",
        format: "number" as const
      },
      {
        title: "Platform Bookings",
        value: realtimeData.totalBookings,
        icon: Calendar,
        trend: { value: 23, label: "from last month", direction: "up" as const },
        description: "Total bookings processed",
        format: "number" as const
      },
      {
        title: "Monthly Recurring Revenue",
        value: realtimeData.mrr,
        icon: DollarSign,
        trend: { value: 15, label: "from last month", direction: "up" as const },
        description: "Current MRR",
        format: "currency" as const
      },
      {
        title: "ARPU",
        value: realtimeData.arpu,
        icon: Target,
        trend: { value: 5, label: "from last month", direction: "up" as const },
        description: "Average Revenue Per User",
        format: "currency" as const
      },
      {
        title: "Churn Rate",
        value: realtimeData.churnRate,
        icon: TrendingUp,
        trend: { value: 0.5, label: "from last month", direction: "down" as const },
        description: "Monthly customer churn",
        format: "percentage" as const
      },
      {
        title: "SMS Delivery Rate",
        value: realtimeData.smsDeliveryRate,
        icon: MessageSquare,
        trend: { value: 0.2, label: "from last month", direction: "up" as const },
        description: "SMS notification success rate",
        format: "percentage" as const
      },
      {
        title: "ETA Accuracy",
        value: realtimeData.etaAccuracy,
        icon: Clock,
        trend: { value: 2.1, label: "from last month", direction: "up" as const },
        description: "Booking time prediction accuracy",
        format: "percentage" as const
      }
    ]
  }, [realtimeData])

  if (error && !realtimeData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error} - Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6" role="main" aria-label="Platform Administration Dashboard">
      {/* Connection Status and Last Updated Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportControls dateRange={dateRange} disabled={loading} />
          <DateRangeFilter
            value={dateRange}
            onChange={handleDateRangeChange}
            onRefresh={handleRefresh}
            isLoading={loading}
          />
        </div>
      </div>

        {/* KPI Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiMetrics.map((metric, index) => (
            <KPICard
              key={metric.title}
              {...metric}
              loading={loading}
              className="transition-all hover:shadow-lg"
            />
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Platform Revenue Overview</CardTitle>
                  <CardDescription>Monthly platform revenue and growth trends</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartErrorBoundary>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartErrorBoundary>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Restaurant Status</CardTitle>
                  <CardDescription>Distribution of restaurant statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartErrorBoundary>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={restaurantStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {restaurantStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Restaurants']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartErrorBoundary>
                  <div className="flex justify-center space-x-4 mt-4">
                    {restaurantStatusData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                          aria-hidden="true"
                        />
                        <span className="text-sm">
                          {entry.name}: {entry.value} ({entry.trend})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
                <CardDescription>Latest system events and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivityData.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={activity.status === 'success' ? 'default' : 
                                  activity.status === 'warning' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {activity.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {activity.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {activity.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {activity.type.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        {activity.metadata && (
                          <div className="text-xs">
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <span key={key} className="ml-2">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth Trend</CardTitle>
                  <CardDescription>Monthly revenue progression with forecasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartErrorBoundary>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartErrorBoundary>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                  <CardDescription>Key revenue performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {realtimeData && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Recurring Revenue</span>
                        <span className="font-medium">${realtimeData.mrr.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Revenue Per User</span>
                        <span className="font-medium">${realtimeData.arpu.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Annual Run Rate</span>
                        <span className="font-medium">${(realtimeData.mrr * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Lifetime Value</span>
                        <span className="font-medium">${(realtimeData.arpu / (realtimeData.churnRate / 100) * 12).toFixed(0)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Booking Trends</CardTitle>
                <CardDescription>Daily booking patterns across all restaurants</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartErrorBoundary>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={bookingTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" stackId="a" fill="hsl(var(--primary))" name="Completed" />
                      <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Overall platform health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {realtimeData && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Active Restaurants</span>
                          <span className="text-sm font-medium">
                            {((realtimeData.activeTenants / realtimeData.totalTenants) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(realtimeData.activeTenants / realtimeData.totalTenants) * 100} className="h-2" />
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
                          <span className="text-sm">Platform Satisfaction</span>
                          <span className="text-sm font-medium">87.5%</span>
                        </div>
                        <Progress value={87.5} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Restaurants</CardTitle>
                  <CardDescription>Highest revenue generators this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Ocean Breeze Bistro', revenue: 8900, bookings: 245, growth: '+15%' },
                      { name: 'Bella Vista Restaurant', revenue: 7200, bookings: 198, growth: '+22%' },
                      { name: 'Garden Terrace', revenue: 6800, bookings: 189, growth: '+8%' },
                      { name: 'Mountain View Cafe', revenue: 5900, bookings: 167, growth: '+12%' }
                    ].map((restaurant, index) => (
                      <div key={restaurant.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <div>
                            <p className="text-sm font-medium">{restaurant.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {restaurant.bookings} bookings
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${restaurant.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{restaurant.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Core platform metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.slice(0, 3).map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {metric.value}{metric.unit}
                            </span>
                            <Badge 
                              variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={metric.unit === '%' ? metric.value : (metric.value / metric.target) * 100} 
                            className="h-1"
                          />
                          <span className="text-xs text-muted-foreground">
                            Target: {metric.target}{metric.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Systems</CardTitle>
                  <CardDescription>Delivery and notification rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.slice(3, 5).map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {metric.value}{metric.unit}
                            </span>
                            <Badge variant="default" className="text-xs">
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={metric.value} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure Health</CardTitle>
                  <CardDescription>Platform reliability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.slice(5).map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {metric.value}{metric.unit}
                            </span>
                            <Badge variant="default" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={metric.value} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}

export default Dashboard