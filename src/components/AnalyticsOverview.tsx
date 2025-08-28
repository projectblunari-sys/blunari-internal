import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Target, Clock, Star } from "lucide-react";

export const AnalyticsOverview = () => {
  const weeklyMetrics = [
    {
      title: "Weekly Bookings",
      value: "156",
      change: "+12.3%",
      changeType: "increase",
      period: "vs last week",
      icon: Calendar
    },
    {
      title: "Total Covers",
      value: "542",
      change: "+8.7%",
      changeType: "increase",
      period: "vs last week",
      icon: Users
    },
    {
      title: "Avg Revenue",
      value: "$4,280",
      change: "+15.2%",
      changeType: "increase",
      period: "vs last week",
      icon: DollarSign
    },
    {
      title: "Conversion Rate",
      value: "89.2%",
      change: "+2.1%",
      changeType: "increase",
      period: "improvement",
      icon: Target
    }
  ];

  const performanceInsights = [
    {
      title: "Peak Booking Times",
      data: [
        { time: "7:00 PM", bookings: 23, percentage: 85 },
        { time: "7:30 PM", bookings: 19, percentage: 70 },
        { time: "8:00 PM", bookings: 21, percentage: 78 },
        { time: "6:30 PM", bookings: 16, percentage: 59 }
      ]
    },
    {
      title: "Table Utilization",
      data: [
        { table: "Tables 1-5", utilization: 92, type: "Standard" },
        { table: "Booths A-C", utilization: 78, type: "Booth" },
        { table: "Bar Seating", utilization: 65, type: "Bar" },
        { table: "Outdoor", utilization: 45, type: "Outdoor" }
      ]
    }
  ];

  const recentTrends = [
    { 
      metric: "Avg Party Size", 
      value: "3.2", 
      trend: "up", 
      change: "+0.2",
      description: "Larger groups trending up"
    },
    { 
      metric: "Booking Lead Time", 
      value: "2.4 days", 
      trend: "down", 
      change: "-0.3",
      description: "More last-minute bookings"
    },
    { 
      metric: "Customer Satisfaction", 
      value: "4.8/5", 
      trend: "up", 
      change: "+0.1",
      description: "Based on 47 reviews this week"
    },
    { 
      metric: "No-Show Rate", 
      value: "8.3%", 
      trend: "down", 
      change: "-1.2%",
      description: "Improvement from reminders"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weeklyMetrics.map((metric, index) => (
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
        {/* Performance Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Peak Booking Times</CardTitle>
            <CardDescription>
              Most popular reservation times this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceInsights[0].data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{item.bookings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Utilization */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Table Utilization</CardTitle>
            <CardDescription>
              Efficiency by seating area this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceInsights[1].data.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.table}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{item.utilization}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.utilization >= 80 ? 'bg-success' :
                        item.utilization >= 60 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trends */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Key metrics and insights from your restaurant data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTrends.map((trend, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{trend.metric}</span>
                  <div className="flex items-center gap-1">
                    {trend.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${
                      trend.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {trend.change}
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{trend.value}</div>
                <p className="text-sm text-muted-foreground">{trend.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Satisfaction */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
          <CardDescription>
            Recent reviews and satisfaction metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="text-3xl font-bold mb-1">4.8</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-success">94%</div>
              <p className="text-sm text-muted-foreground">Would Recommend</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-primary">47</div>
              <p className="text-sm text-muted-foreground">Reviews This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};