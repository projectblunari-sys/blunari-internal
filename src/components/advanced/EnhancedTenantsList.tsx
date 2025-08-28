import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Download
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  owner: string;
  email: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  created_at: string;
  last_activity: string;
  monthly_bookings: number;
  monthly_revenue: number;
  conversion_rate: number;
  growth_rate: number;
  domain: string;
  features: string[];
  billing_status: 'current' | 'overdue' | 'cancelled';
}

export const EnhancedTenantsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  // Mock data - in real app this would come from API
  const tenants: Tenant[] = [
    {
      id: "1",
      name: "Ocean Breeze Bistro",
      slug: "ocean-breeze",
      owner: "Marcus Rodriguez",
      email: "marcus@oceanbreeze.com",
      plan: "professional",
      status: "active",
      created_at: "2024-01-15",
      last_activity: "2 hours ago",
      monthly_bookings: 543,
      monthly_revenue: 28900,
      conversion_rate: 89.2,
      growth_rate: 45.2,
      domain: "ocean-breeze.blunari.com",
      features: ["AI Pacing", "Analytics", "SMS Notifications"],
      billing_status: "current"
    },
    {
      id: "2", 
      name: "Bella Vista Restaurant",
      slug: "bella-vista",
      owner: "Sarah Chen",
      email: "sarah@bellavista.com",
      plan: "enterprise",
      status: "active",
      created_at: "2024-02-03",
      last_activity: "1 hour ago",
      monthly_bookings: 247,
      monthly_revenue: 12400,
      conversion_rate: 92.1,
      growth_rate: 32.1,
      domain: "bellavista.com",
      features: ["AI Pacing", "Analytics", "Custom Domain", "White Label"],
      billing_status: "current"
    },
    {
      id: "3",
      name: "Mountain View Cafe",
      slug: "mountain-view",
      owner: "Elena Dubois", 
      email: "elena@mountainview.com",
      plan: "starter",
      status: "trial",
      created_at: "2024-02-20",
      last_activity: "5 minutes ago",
      monthly_bookings: 89,
      monthly_revenue: 4500,
      conversion_rate: 84.7,
      growth_rate: 28.7,
      domain: "mountain-view.blunari.com",
      features: ["Basic Analytics"],
      billing_status: "current"
    },
    {
      id: "4",
      name: "Urban Kitchen",
      slug: "urban-kitchen",
      owner: "David Wilson",
      email: "david@urbankitchen.com", 
      plan: "professional",
      status: "inactive",
      created_at: "2024-01-08",
      last_activity: "3 days ago",
      monthly_bookings: 156,
      monthly_revenue: 7800,
      conversion_rate: 76.3,
      growth_rate: 15.3,
      domain: "urban-kitchen.blunari.com",
      features: ["AI Pacing", "Analytics"],
      billing_status: "overdue"
    }
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter':
        return 'bg-secondary/10 text-secondary';
      case 'professional':
        return 'bg-primary/10 text-primary';
      case 'enterprise':
        return 'bg-gradient-primary text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'trial':
        return 'text-warning';
      case 'inactive':
        return 'text-muted-foreground';
      case 'suspended':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'trial':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'text-success';
      case 'overdue':
        return 'text-destructive';
      case 'cancelled':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tenant Management</h2>
          <p className="text-muted-foreground">
            Manage all restaurant tenants and their configurations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants by name, owner, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="monthly_revenue">Revenue</SelectItem>
                  <SelectItem value="monthly_bookings">Bookings</SelectItem>
                  <SelectItem value="growth_rate">Growth Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/tenant-${tenant.id}.jpg`} />
                    <AvatarFallback>{tenant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(tenant.status)}
                      <span className={`text-sm capitalize ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Tenant
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Features
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <Badge className={getPlanColor(tenant.plan)}>
                  {tenant.plan}
                </Badge>
                <span className={`text-sm ${getBillingStatusColor(tenant.billing_status)}`}>
                  Billing: {tenant.billing_status}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Owner & Contact */}
              <div>
                <p className="text-sm font-medium">{tenant.owner}</p>
                <p className="text-sm text-muted-foreground">{tenant.email}</p>
                <p className="text-xs text-muted-foreground">{tenant.domain}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Bookings</span>
                  </div>
                  <div className="text-lg font-bold">{tenant.monthly_bookings}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-success" />
                    <span className="text-xs text-muted-foreground">Revenue</span>
                  </div>
                  <div className="text-lg font-bold">${tenant.monthly_revenue.toLocaleString()}</div>
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-medium">{tenant.conversion_rate}%</span>
                </div>
                <Progress value={tenant.conversion_rate} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1">
                  {tenant.growth_rate > 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-xs ${
                    tenant.growth_rate > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {tenant.growth_rate > 0 ? '+' : ''}{tenant.growth_rate}% growth
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Active {tenant.last_activity}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Summary */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {filteredTenants.length} of {tenants.length} tenants
            </span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>{tenants.filter(t => t.status === 'active').length} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span>{tenants.filter(t => t.status === 'trial').length} Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                <span>{tenants.filter(t => t.status === 'inactive').length} Inactive</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};