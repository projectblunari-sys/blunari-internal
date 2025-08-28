import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Target } from "lucide-react";

export const AnalyticsDashboard = () => {
  const metrics = [
    {
      title: "Total Bookings",
      value: "1,247",
      change: "+18.2%",
      changeType: "increase",
      period: "vs last month",
      icon: Calendar
    },
    {
      title: "Revenue",
      value: "$52,840",
      change: "+23.1%",
      changeType: "increase",
      period: "vs last month",
      icon: DollarSign
    },
    {
      title: "Active Tenants",
      value: "24",
      change: "+3",
      changeType: "increase",
      period: "new this month",
      icon: Users
    },
    {
      title: "Avg. Conversion",
      value: "87.3%",
      change: "+2.1%",
      changeType: "increase",
      period: "improvement",
      icon: Target
    }
  ];

  const topPerformers = [
    { name: "Ocean Breeze Bistro", bookings: 543, revenue: 28900, growth: 45.2 },
    { name: "Bella Vista Restaurant", bookings: 247, revenue: 12400, growth: 32.1 },
    { name: "Mountain View Cafe", bookings: 189, revenue: 8900, growth: 28.7 },
    { name: "Urban Kitchen", bookings: 156, revenue: 7800, growth: 15.3 },
    { name: "Sunset Grill", bookings: 112, revenue: 5600, growth: 22.8 }
  ];

  const recentActivity = [
    { type: "booking", tenant: "Ocean Breeze Bistro", message: "New booking for party of 4", time: "2 minutes ago" },
    { type: "signup", tenant: "Garden Terrace", message: "New tenant signed up", time: "15 minutes ago" },
    { type: "upgrade", tenant: "Bella Vista Restaurant", message: "Upgraded to Enterprise plan", time: "1 hour ago" },
    { type: "booking", tenant: "Mountain View Cafe", message: "Booking cancelled", time: "2 hours ago" },
    { type: "feature", tenant: "Urban Kitchen", message: "Enabled AI pacing", time: "3 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {metric.changeType === "increase" ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${
                    metric.changeType === "increase" ? "text-success" : "text-destructive"
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top Performing Tenants</CardTitle>
            <CardDescription>
              Restaurants with highest growth this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tenant.bookings} bookings • ${tenant.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    +{tenant.growth}%
                  </Badge>
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
              Latest events across all tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'booking' ? 'bg-primary' :
                    activity.type === 'signup' ? 'bg-success' :
                    activity.type === 'upgrade' ? 'bg-secondary' :
                    activity.type === 'feature' ? 'bg-accent' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary">{activity.tenant}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Real-time system metrics and SLA compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">99.97%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
              <Badge variant="outline" className="mt-2 border-success text-success">
                SLA Met
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">142ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
              <Badge variant="outline" className="mt-2 border-primary text-primary">
                Under 200ms
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">2.3k</div>
              <div className="text-sm text-muted-foreground">Requests/min</div>
              <Badge variant="outline" className="mt-2 border-accent text-accent">
                Normal Load
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">0</div>
              <div className="text-sm text-muted-foreground">Active Issues</div>
              <Badge variant="outline" className="mt-2 border-success text-success">
                All Systems Go
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};