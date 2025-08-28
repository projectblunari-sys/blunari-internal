import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign, 
  Target,
  Clock,
  Star,
  Phone,
  Mail,
  BarChart3,
  Download
} from "lucide-react";

export const RestaurantAnalytics = () => {
  const metrics = [
    {
      title: "Today's Revenue",
      value: "$2,340",
      change: "+15.3%",
      changeType: "increase",
      period: "vs yesterday",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Bookings Today",
      value: "23",
      change: "+4",
      changeType: "increase",
      period: "vs yesterday",
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Table Utilization",
      value: "78%",
      change: "+5%",
      changeType: "increase",
      period: "vs yesterday",
      icon: Target,
      color: "text-accent"
    },
    {
      title: "Avg. Party Size",
      value: "3.2",
      change: "+0.3",
      changeType: "increase",
      period: "guests",
      icon: Users,
      color: "text-warning"
    }
  ];

  const weeklyStats = [
    { day: "Mon", bookings: 18, revenue: 1850 },
    { day: "Tue", bookings: 22, revenue: 2240 },
    { day: "Wed", bookings: 25, revenue: 2580 },
    { day: "Thu", bookings: 28, revenue: 2940 },
    { day: "Fri", bookings: 35, revenue: 3650 },
    { day: "Sat", bookings: 42, revenue: 4380 },
    { day: "Sun", bookings: 30, revenue: 3120 }
  ];

  const popularTimes = [
    { time: "5:00 PM", bookings: 8, percentage: 80 },
    { time: "6:00 PM", bookings: 12, percentage: 100 },
    { time: "7:00 PM", bookings: 15, percentage: 90 },
    { time: "8:00 PM", bookings: 18, percentage: 85 },
    { time: "9:00 PM", bookings: 10, percentage: 60 }
  ];

  const customerInsights = [
    {
      metric: "New Customers",
      value: "32%",
      description: "First-time diners this month"
    },
    {
      metric: "Repeat Customers", 
      value: "68%",
      description: "Return visitors this month"
    },
    {
      metric: "Avg. Customer Rating",
      value: "4.8/5",
      description: "Based on recent reviews"
    },
    {
      metric: "No-Show Rate",
      value: "3.2%",
      description: "Down 1.5% from last month"
    }
  ];

  const topDishes = [
    { name: "Grilled Salmon", orders: 45, trend: "up" },
    { name: "Beef Tenderloin", orders: 38, trend: "up" },
    { name: "Pasta Carbonara", orders: 34, trend: "down" },
    { name: "Caesar Salad", orders: 29, trend: "up" },
    { name: "Chocolate Cake", orders: 25, trend: "up" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Insights</h2>
          <p className="text-muted-foreground">
            Track performance and gain insights into your restaurant operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="default" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
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
        {/* Weekly Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>
              Bookings and revenue over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{day.bookings} bookings</span>
                        <span className="font-medium">${day.revenue}</span>
                      </div>
                      <Progress value={(day.bookings / 42) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Times */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Popular Booking Times</CardTitle>
            <CardDescription>
              Peak hours and booking distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularTimes.map((time, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{time.time}</span>
                    <span>{time.bookings} bookings</span>
                  </div>
                  <Progress value={time.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Understanding your customer base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{insight.metric}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {insight.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Dishes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Popular Menu Items</CardTitle>
            <CardDescription>
              Most ordered dishes this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDishes.map((dish, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{dish.name}</p>
                      <p className="text-sm text-muted-foreground">{dish.orders} orders</p>
                    </div>
                  </div>
                  {dish.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Targets */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monthly Goals & Targets</CardTitle>
          <CardDescription>
            Track progress towards your monthly objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground mb-2">Revenue Target</div>
              <Progress value={85} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">
                $68,000 / $80,000
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-3xl font-bold text-success mb-2">92%</div>
              <div className="text-sm text-muted-foreground mb-2">Booking Target</div>
              <Progress value={92} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">
                736 / 800 bookings
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-3xl font-bold text-accent mb-2">78%</div>
              <div className="text-sm text-muted-foreground mb-2">Customer Satisfaction</div>
              <Progress value={78} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">
                4.8/5 average rating
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};