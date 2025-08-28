import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { TenantMetrics } from "@/components/advanced/TenantMetrics";
import { EnhancedTenantsList } from "@/components/advanced/EnhancedTenantsList";
import { WidgetIntegration } from "@/components/admin/WidgetIntegration";
import { TenantProvisioningWizard } from "@/components/TenantProvisioningWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, AlertTriangle, CheckCircle, Activity, Zap } from "lucide-react";

const Dashboard = () => {
  const [showProvisioningWizard, setShowProvisioningWizard] = useState(false);

  const systemAlerts = [
    {
      id: "1",
      type: "info",
      title: "Database Maintenance Scheduled",
      message: "Routine maintenance scheduled for tonight 2-4 AM EST",
      time: "2 hours ago",
      icon: Activity
    },
    {
      id: "2", 
      type: "success",
      title: "Performance Optimization Complete",
      message: "API response times improved by 15% after optimization",
      time: "4 hours ago",
      icon: Zap
    },
    {
      id: "3",
      type: "warning",
      title: "High Memory Usage",
      message: "Server memory usage is at 85% - consider scaling",
      time: "6 hours ago",
      icon: AlertTriangle
    }
  ];

  const recentActivity = [
    { type: "tenant_created", message: "New tenant 'Garden Terrace' provisioned", time: "5 min ago" },
    { type: "upgrade", message: "Ocean Breeze upgraded to Enterprise", time: "15 min ago" },
    { type: "feature_enabled", message: "AI Pacing enabled for Bella Vista", time: "1 hour ago" },
    { type: "billing", message: "Monthly billing cycle completed", time: "2 hours ago" },
    { type: "security", message: "Security scan completed - no issues", time: "3 hours ago" }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tenant_created':
        return '🏪';
      case 'upgrade':
        return '⬆️';
      case 'feature_enabled':
        return '✨';
      case 'billing':
        return '💳';
      case 'security':
        return '🛡️';
      default:
        return '📋';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your multi-tenant restaurant booking platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Platform Settings
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowProvisioningWizard(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>

        {/* Platform Metrics */}
        <TenantMetrics />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>
                    Recent platform notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <alert.icon className={`w-4 h-4 mt-0.5 ${getAlertColor(alert.type)}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform events and changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    <span>Add Tenant</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Activity className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Settings className="w-6 h-6" />
                    <span>System Settings</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Health Check</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <EnhancedTenantsList />
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <WidgetIntegration />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Advanced Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive platform analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Coming soon: Deep dive analytics with custom dashboards, predictive insights, and performance optimization recommendations.
                  </p>
                  <Badge variant="secondary">Under Development</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Real-time system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Services</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Edge Functions</span>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Running
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Usage
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="text-sm font-medium">142ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Throughput</span>
                      <span className="text-sm font-medium">2.3k req/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="text-sm font-medium">0.03%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Sessions</span>
                      <span className="text-sm font-medium">142</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Provisioning Wizard Modal */}
        {showProvisioningWizard && (
          <TenantProvisioningWizard 
            onClose={() => setShowProvisioningWizard(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;