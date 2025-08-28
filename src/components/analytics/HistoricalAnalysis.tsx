import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  Activity,
  Users,
  DollarSign,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';

interface HistoricalDataPoint {
  date: string;
  timestamp: number;
  revenue: number;
  bookings: number;
  activeUsers: number;
  newSignups: number;
  churnRate: number;
  avgOrderValue: number;
  conversionRate: number;
  systemUptime: number;
  errorRate: number;
  responseTime: number;
}

interface TrendAnalysis {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

// Generate mock historical data
const generateHistoricalData = (days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic trending data
    const baseRevenue = 45000 + (Math.random() * 20000);
    const seasonalMultiplier = 1 + Math.sin((i / 30) * Math.PI) * 0.2; // Monthly seasonality
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1.0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      revenue: Math.round(baseRevenue * seasonalMultiplier * weekendMultiplier),
      bookings: Math.round(180 + (Math.random() * 100) * weekendMultiplier),
      activeUsers: Math.round(2800 + (Math.random() * 600)),
      newSignups: Math.round(15 + (Math.random() * 25)),
      churnRate: 2.5 + (Math.random() * 2),
      avgOrderValue: 35 + (Math.random() * 20),
      conversionRate: 3.2 + (Math.random() * 1.5),
      systemUptime: 99.5 + (Math.random() * 0.5),
      errorRate: Math.random() * 0.5,
      responseTime: 120 + (Math.random() * 80)
    });
  }
  
  return data;
};

export const HistoricalAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('revenue');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  
  const { trackFeatureUsage } = useAnalyticsTracking();

  useEffect(() => {
    trackFeatureUsage('analytics', 'historical_analysis_view');
  }, [trackFeatureUsage]);

  const historicalData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return generateHistoricalData(days);
  }, [timeRange]);

  const trendAnalysis = useMemo((): TrendAnalysis[] => {
    if (historicalData.length < 2) return [];
    
    const currentPeriod = historicalData.slice(-7); // Last 7 days
    const previousPeriod = historicalData.slice(-14, -7); // Previous 7 days
    
    const calculateAverage = (data: HistoricalDataPoint[], field: keyof HistoricalDataPoint) => {
      const values = data.map(d => d[field] as number);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    };
    
    const metrics = [
      'revenue', 'bookings', 'activeUsers', 'newSignups', 
      'churnRate', 'avgOrderValue', 'conversionRate', 'systemUptime'
    ];
    
    return metrics.map(metricName => {
      const current = calculateAverage(currentPeriod, metricName as keyof HistoricalDataPoint);
      const previous = calculateAverage(previousPeriod, metricName as keyof HistoricalDataPoint);
      const change = ((current - previous) / previous) * 100;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(change) > 5) {
        trend = change > 0 ? 'up' : 'down';
      }
      
      let significance: 'high' | 'medium' | 'low' = 'low';
      if (Math.abs(change) > 20) significance = 'high';
      else if (Math.abs(change) > 10) significance = 'medium';
      
      return {
        metric: metricName,
        current,
        previous,
        change,
        trend,
        significance
      };
    });
  }, [historicalData]);

  const formatMetricValue = (value: number, metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'churnRate':
      case 'conversionRate':
      case 'systemUptime':
      case 'errorRate':
        return `${value.toFixed(1)}%`;
      case 'responseTime':
        return `${value.toFixed(0)}ms`;
      case 'avgOrderValue':
        return `$${value.toFixed(2)}`;
      default:
        return Math.round(value).toLocaleString();
    }
  };

  const getMetricDisplayName = (metricName: string) => {
    const names: Record<string, string> = {
      revenue: 'Revenue',
      bookings: 'Bookings',
      activeUsers: 'Active Users',
      newSignups: 'New Signups',
      churnRate: 'Churn Rate',
      avgOrderValue: 'Avg Order Value',
      conversionRate: 'Conversion Rate',
      systemUptime: 'System Uptime',
      errorRate: 'Error Rate',
      responseTime: 'Response Time'
    };
    return names[metricName] || metricName;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getSignificanceBadge = (significance: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[significance]}>{significance}</Badge>;
  };

  // Prepare chart data based on selected metric
  const chartData = historicalData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    value: point[metric as keyof HistoricalDataPoint] as number,
    formattedDate: new Date(point.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historical Analysis</h2>
          <p className="text-muted-foreground">
            Analyze trends and patterns in your data over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeFilter
            value={dateRange}
            onChange={setDateRange}
            onRefresh={() => {}}
          />
        </div>
      </div>

      {/* Trend Analysis Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trendAnalysis.slice(0, 4).map((trend) => (
          <Card key={trend.metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {getMetricDisplayName(trend.metric)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatMetricValue(trend.current, trend.metric)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(trend.trend)}
                    <span className={trend.change > 0 ? 'text-green-600' : trend.change < 0 ? 'text-red-600' : 'text-gray-600'}>
                      {Math.abs(trend.change).toFixed(1)}%
                    </span>
                  </div>
                  {getSignificanceBadge(trend.significance)}
                </div>
                <div className="text-xs text-muted-foreground">
                  vs previous period: {formatMetricValue(trend.previous, trend.metric)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Time Series Charts</TabsTrigger>
          <TabsTrigger value="comparison">Period Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historical Trends</CardTitle>
                  <CardDescription>
                    Time series analysis of key metrics
                  </CardDescription>
                </div>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="bookings">Bookings</SelectItem>
                    <SelectItem value="activeUsers">Active Users</SelectItem>
                    <SelectItem value="newSignups">New Signups</SelectItem>
                    <SelectItem value="churnRate">Churn Rate</SelectItem>
                    <SelectItem value="conversionRate">Conversion Rate</SelectItem>
                    <SelectItem value="systemUptime">System Uptime</SelectItem>
                    <SelectItem value="responseTime">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="formattedDate" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => formatMetricValue(value, metric)}
                  />
                  <Tooltip 
                    formatter={(value) => [formatMetricValue(value as number, metric), getMetricDisplayName(metric)]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Bookings</CardTitle>
                <CardDescription>
                  Compare revenue trends with booking volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={historicalData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={10}
                      tick={{ fontSize: 8 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="hsl(var(--destructive))" name="Bookings" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  System performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={10}
                      tick={{ fontSize: 8 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="responseTime" stroke="hsl(var(--primary))" name="Response Time (ms)" />
                    <Line type="monotone" dataKey="errorRate" stroke="hsl(var(--destructive))" name="Error Rate (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Trend Analysis</CardTitle>
              <CardDescription>
                Statistical analysis of metric changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendAnalysis.map((trend) => (
                  <div key={trend.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <span className="font-medium">{getMetricDisplayName(trend.metric)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current: {formatMetricValue(trend.current, trend.metric)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Previous: {formatMetricValue(trend.previous, trend.metric)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`font-medium ${trend.change > 0 ? 'text-green-600' : trend.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                      </div>
                      {getSignificanceBadge(trend.significance)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metric Correlations</CardTitle>
              <CardDescription>
                Understand relationships between different metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Strong Positive Correlations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Revenue ↔ Bookings</span>
                      <Badge className="bg-green-100 text-green-800">+0.89</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Active Users ↔ New Signups</span>
                      <Badge className="bg-green-100 text-green-800">+0.76</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">Conversion Rate ↔ Revenue</span>
                      <Badge className="bg-green-100 text-green-800">+0.72</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Negative Correlations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Response Time ↔ Conversion Rate</span>
                      <Badge className="bg-red-100 text-red-800">-0.65</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Error Rate ↔ System Uptime</span>
                      <Badge className="bg-red-100 text-red-800">-0.82</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Churn Rate ↔ User Satisfaction</span>
                      <Badge className="bg-red-100 text-red-800">-0.71</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};