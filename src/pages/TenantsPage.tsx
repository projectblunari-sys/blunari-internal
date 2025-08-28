import { useState } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building, 
  Users, 
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TenantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Mock tenant data
  const tenants = [
    {
      id: "1",
      name: "Bella Vista Restaurant",
      slug: "bella-vista",
      status: "active",
      plan: "Professional",
      bookings: 1250,
      revenue: 15600,
      lastActive: "2 hours ago",
      created: "2024-01-15"
    },
    {
      id: "2", 
      name: "Ocean Breeze Bistro",
      slug: "ocean-breeze",
      status: "active",
      plan: "Enterprise", 
      bookings: 2100,
      revenue: 28900,
      lastActive: "1 hour ago",
      created: "2024-02-03"
    },
    {
      id: "3",
      name: "Mountain View Cafe",
      slug: "mountain-view",
      status: "suspended",
      plan: "Starter",
      bookings: 450,
      revenue: 5200,
      lastActive: "2 days ago", 
      created: "2024-03-12"
    },
    {
      id: "4",
      name: "Garden Terrace",
      slug: "garden-terrace",
      status: "trial",
      plan: "Trial",
      bookings: 89,
      revenue: 1200,
      lastActive: "30 min ago",
      created: "2024-03-28"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>
      case 'trial':
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Trial</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Restaurant Management</h1>
            <p className="text-muted-foreground">
              Manage platform restaurants, monitor performance, and handle configurations
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Restaurant
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.length}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tenants.filter(t => t.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((tenants.filter(t => t.status === 'active').length / tenants.length) * 100)}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${tenants.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tenants.reduce((sum, t) => sum + t.bookings, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Restaurants</CardTitle>
            <CardDescription>
              Comprehensive list of all platform restaurants
            </CardDescription>
            
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tenant.slug}.blunari.com
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tenant.plan}</Badge>
                    </TableCell>
                    <TableCell>{tenant.bookings.toLocaleString()}</TableCell>
                    <TableCell>${tenant.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tenant.lastActive}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default TenantsPage