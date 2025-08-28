import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  Settings, 
  Bell, 
  ChevronDown,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { BookingsList } from "@/components/BookingsList";
import { TableManagement } from "@/components/TableManagement";
import { AnalyticsOverview } from "@/components/AnalyticsOverview";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock restaurant data - in real app this would come from API based on auth
  const restaurant = {
    name: "Bella Vista Restaurant",
    slug: "bella-vista", 
    plan: "Professional",
    owner: "Sarah Chen",
    email: "sarah@bellavista.com",
    timezone: "America/New_York",
    currency: "USD"
  };

  const todayStats = [
    {
      title: "Today's Bookings",
      value: "23",
      change: "+3 from yesterday",
      icon: Calendar,
      trend: "up",
      color: "text-primary"
    },
    {
      title: "Seated Guests",
      value: "18",
      change: "Currently dining",
      icon: Users,
      trend: "neutral",
      color: "text-success"
    },
    {
      title: "Avg Wait Time",
      value: "12 min",
      change: "-5 min from average",
      icon: Clock,
      trend: "down",
      color: "text-warning"
    },
    {
      title: "Table Utilization",
      value: "78%",
      change: "+5% from yesterday",
      icon: TrendingUp,
      trend: "up",
      color: "text-accent"
    }
  ];

  const upcomingBookings = [
    {
      id: "1",
      guest: "John Smith",
      party_size: 4,
      time: "7:00 PM",
      table: "Table 12",
      status: "confirmed",
      phone: "+1 (555) 123-4567"
    },
    {
      id: "2", 
      guest: "Maria Garcia",
      party_size: 2,
      time: "7:30 PM",
      table: "Table 8",
      status: "confirmed",
      phone: "+1 (555) 234-5678"
    },
    {
      id: "3",
      guest: "David Wilson",
      party_size: 6,
      time: "8:00 PM", 
      table: "Table 15",
      status: "pending",
      phone: "+1 (555) 345-6789"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                  alt="Blunari Logo"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Blunari
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{restaurant.name}</span>
                  <Badge variant="secondary" className="ml-2">{restaurant.plan}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{restaurant.owner}</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Good evening, {restaurant.owner.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at {restaurant.name} today.
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="tables" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tables
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Bookings */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Today's Bookings</CardTitle>
                    <CardDescription>
                      Upcoming reservations for today
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="default" size="sm">
                      <Plus className="w-4 h-4" />
                      Add Booking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(booking.status)}
                          <div>
                            <p className="font-medium">{booking.guest}</p>
                            <p className="text-sm text-muted-foreground">
                              Party of {booking.party_size} • {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {booking.table}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Booking
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Eye className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Tables
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Restaurant Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Overview */}
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsList />
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <TableManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed insights into your restaurant's performance, customer behavior, and booking trends.
                  </p>
                  <Button variant="default">
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;