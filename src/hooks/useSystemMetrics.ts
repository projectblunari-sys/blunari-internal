import { useState, useEffect, useCallback } from 'react';

interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  service_name: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  recorded_at: string;
}

interface DatabaseMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  active_connections: number;
  waiting_connections: number;
  connection_pool_size: number;
  recorded_at: string;
}

interface PerformanceTrend {
  id: string;
  metric_category: string;
  metric_name: string;
  period_start: string;
  period_end: string;
  avg_value: number;
  percentile_50: number;
  percentile_95: number;
  percentile_99: number;
}

export const useSystemMetrics = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetric[]>([]);
  const [performanceTrends, setPerformanceTrends] = useState<PerformanceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data generation
  const generateMockData = useCallback(() => {
    const mockSystemMetrics: SystemMetric[] = [
      {
        id: '1',
        metric_name: 'api_response_time',
        metric_value: 145,
        metric_unit: 'ms',
        service_name: 'api-gateway',
        severity: 'info',
        recorded_at: new Date().toISOString()
      },
      {
        id: '2',
        metric_name: 'db_query_time',
        metric_value: 2.3,
        metric_unit: 'ms',
        service_name: 'database',
        severity: 'info',
        recorded_at: new Date().toISOString()
      },
      {
        id: '3',
        metric_name: 'active_users',
        metric_value: 2847,
        metric_unit: 'count',
        service_name: 'platform',
        severity: 'info',
        recorded_at: new Date().toISOString()
      },
      {
        id: '4',
        metric_name: 'system_uptime',
        metric_value: 99.98,
        metric_unit: '%',
        service_name: 'infrastructure',
        severity: 'info',
        recorded_at: new Date().toISOString()
      }
    ];

    const mockDatabaseMetrics: DatabaseMetric[] = [
      {
        id: '1',
        metric_name: 'connection_utilization',
        metric_value: 67,
        active_connections: 15,
        waiting_connections: 2,
        connection_pool_size: 25,
        recorded_at: new Date().toISOString()
      },
      {
        id: '2',
        metric_name: 'query_performance',
        metric_value: 2.1,
        active_connections: 12,
        waiting_connections: 0,
        connection_pool_size: 25,
        recorded_at: new Date().toISOString()
      }
    ];

    const mockPerformanceTrends: PerformanceTrend[] = Array.from({ length: 24 }, (_, i) => ({
      id: `trend-${i}`,
      metric_category: 'application',
      metric_name: 'response_time',
      period_start: new Date(Date.now() - (24 - i) * 60 * 60 * 1000).toISOString(),
      period_end: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      avg_value: 120 + Math.random() * 50,
      percentile_50: 110 + Math.random() * 40,
      percentile_95: 180 + Math.random() * 80,
      percentile_99: 250 + Math.random() * 100
    }));

    setSystemMetrics(mockSystemMetrics);
    setDatabaseMetrics(mockDatabaseMetrics);
    setPerformanceTrends(mockPerformanceTrends);
    setLoading(false);
  }, []);

  useEffect(() => {
    generateMockData();
  }, [generateMockData]);

  const calculateHealthScore = useCallback(() => {
    if (systemMetrics.length === 0) return 100;

    let score = 100;
    
    systemMetrics.forEach(metric => {
      switch (metric.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'error':
          score -= 15;
          break;
        case 'warning':
          score -= 5;
          break;
        default:
          break;
      }
    });

    return Math.max(0, score);
  }, [systemMetrics]);

  const getMetricsByCategory = useCallback((category: string) => {
    return systemMetrics.filter(metric => 
      metric.service_name.includes(category) || metric.metric_name.includes(category)
    );
  }, [systemMetrics]);

  const getLatestMetricValue = useCallback((metricName: string) => {
    const metric = systemMetrics.find(m => m.metric_name === metricName);
    return metric ? metric.metric_value : null;
  }, [systemMetrics]);

  return {
    systemMetrics,
    databaseMetrics,
    performanceTrends,
    loading,
    error,
    calculateHealthScore,
    getMetricsByCategory,
    getLatestMetricValue
  };
};