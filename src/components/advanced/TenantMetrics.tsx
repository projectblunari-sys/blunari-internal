import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign, 
  Target,
  Activity,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";

interface TenantMetricsProps {
  tenantId?: string;
  compact?: boolean;
}

export const TenantMetrics = ({ tenantId, compact = false }: TenantMetricsProps) => {
  const platformMetrics = [
    {
      title: "Total Revenue",
      value: "$187,420",
      change: "+23.1%",
      changeType: "increase",
      period: "vs last month",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Active Tenants",
      value: "24",
      change: "+3",
      changeType: "increase", 
      period: "new this month",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Total Bookings",
      value: "12,847",
      change: "+18.2%",
      changeType: "increase",
      period: "vs last month",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Platform Conversion",
      value: "87.3%",
      change: "+2.1%",
      changeType: "increase",
      period: "improvement",
      icon: Target,
      color: "text-warning"
    }
  ];

  const performanceMetrics = [
    {
      title: "API Response Time",
      value: "142ms",
      target: "< 200ms",
      percentage: 71,
      status: "excellent",
      icon: Zap
    },
    {
      title: "System Uptime",
      value: "99.97%",
      target: "99.9%",
      percentage: 99.97,
      status: "excellent",
      icon: Activity
    },
    {
      title: "Error Rate",
      value: "0.03%",
      target: "< 0.1%",
      percentage: 97,
      status: "good",
      icon: AlertTriangle
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      target: "> 4.5",
      percentage: 96,
      status: "excellent",
      icon: Star
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (compact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformMetrics.map((metric, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs ${
                      metric.changeType === "increase" ? "text-success" : "text-destructive"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformMetrics.map((metric, index) => (
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
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                    <CardTitle className="text-base">{metric.title}</CardTitle>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        metric.status === 'excellent' ? 'bg-success/10 text-success' :
                        metric.status === 'good' ? 'bg-primary/10 text-primary' :
                        metric.status === 'warning' ? 'bg-warning/10 text-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Target: {metric.target}</span>
                      <span className={getStatusColor(metric.status)}>{metric.percentage}%</span>
                    </div>
                    <Progress 
                      value={metric.percentage} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Real-time Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Real-time Platform Activity</CardTitle>
          <CardDescription>
            Live system metrics and tenant activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary mb-2">2.3k</div>
              <div className="text-sm text-muted-foreground">Requests/min</div>
              <Badge variant="outline" className="mt-2 border-primary text-primary">
                Normal Load
              </Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-3xl font-bold text-success mb-2">142</div>
              <div className="text-sm text-muted-foreground">Active Sessions</div>
              <Badge variant="outline" className="mt-2 border-success text-success">
                +12 this hour
              </Badge>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-3xl font-bold text-accent mb-2">94.2%</div>
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
              <Badge variant="outline" className="mt-2 border-accent text-accent">
                Optimized
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};