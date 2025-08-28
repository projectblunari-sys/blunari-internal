import { useState } from "react";
import { RestaurantLayout } from "@/components/client/RestaurantLayout";
import { EnhancedBookingsList } from "@/components/client/EnhancedBookingsList";
import { RestaurantAnalytics } from "@/components/client/RestaurantAnalytics";
import { WidgetIntegration } from "@/components/client/WidgetIntegration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, profile, tenant } = useAuth();

  // Use actual user and tenant data
  const restaurant = {
    name: tenant?.tenant_name || "Your Restaurant",
    slug: tenant?.tenant_slug || "restaurant", 
    plan: "Professional",
    owner: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Restaurant Owner",
    email: profile?.email || user?.email || ""
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
    <RestaurantLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.first_name || "there"}! 👋
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
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Bookings */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Today's Bookings</CardTitle>
                  <CardDescription>Upcoming reservations for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(booking.status)}
                          <div>
                            <p className="font-medium">{booking.guest}</p>
                            <p className="text-sm text-muted-foreground">
                              Party of {booking.party_size} • {booking.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{booking.table}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <EnhancedBookingsList />
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <WidgetIntegration />
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Table Management</CardTitle>
                <CardDescription>Manage your restaurant's seating layout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Interactive table management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <RestaurantAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default ClientDashboard;