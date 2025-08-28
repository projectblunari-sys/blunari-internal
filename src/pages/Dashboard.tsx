import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Users, Calendar, TrendingUp, MapPin } from "lucide-react";
import { TenantProvisioningWizard } from "@/components/TenantProvisioningWizard";
import { TenantsList } from "@/components/TenantsList";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

const Dashboard = () => {
  const [showProvisioningWizard, setShowProvisioningWizard] = useState(false);

  const stats = [
    {
      title: "Active Tenants",
      value: "24",
      change: "+3 this month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Bookings",
      value: "1,247",
      change: "+18% from last month",
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$12,840",
      change: "+23% from last month",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Avg. Conversion",
      value: "87.3%",
      change: "+2.1% improvement",
      icon: MapPin,
      trend: "up"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Blunari Admin
            </h1>
            <p className="text-muted-foreground mt-2">
              Multi-tenant restaurant booking platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setShowProvisioningWizard(true)}
            >
              <Plus className="w-4 h-4" />
              Add Tenant
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tenants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="tenants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tenants
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tenants" className="space-y-6">
            <TenantsList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Monitor system performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary-light">
                    <div className="text-2xl font-bold text-primary">142ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary-light">
                    <div className="text-2xl font-bold text-secondary">0</div>
                    <div className="text-sm text-muted-foreground">Active Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Provisioning Wizard Modal */}
        {showProvisioningWizard && (
          <TenantProvisioningWizard 
            onClose={() => setShowProvisioningWizard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;