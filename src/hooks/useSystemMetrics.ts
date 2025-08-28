import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  service_name: string;
  severity: string;
  recorded_at: string;
  metadata: any;
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
  aggregation_period: string;
  period_start: string;
  period_end: string;
  min_value: number;
  max_value: number;
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
  const { toast } = useToast();

  // Fetch system health metrics
  const fetchSystemMetrics = useCallback(async (timeRange: string = '1h') => {
    try {
      setError(null);
      
      const timeThreshold = new Date();
      switch (timeRange) {
        case '1h':
          timeThreshold.setHours(timeThreshold.getHours() - 1);
          break;
        case '24h':
          timeThreshold.setHours(timeThreshold.getHours() - 24);
          break;
        case '7d':
          timeThreshold.setDate(timeThreshold.getDate() - 7);
          break;
        default:
          timeThreshold.setHours(timeThreshold.getHours() - 1);
      }

      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('recorded_at', timeThreshold.toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSystemMetrics(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch system metrics",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Fetch database metrics
  const fetchDatabaseMetrics = useCallback(async (timeRange: string = '1h') => {
    try {
      const timeThreshold = new Date();
      switch (timeRange) {
        case '1h':
          timeThreshold.setHours(timeThreshold.getHours() - 1);
          break;
        case '24h':
          timeThreshold.setHours(timeThreshold.getHours() - 24);
          break;
        case '7d':
          timeThreshold.setDate(timeThreshold.getDate() - 7);
          break;
      }

      const { data, error } = await supabase
        .from('database_metrics')
        .select('*')
        .gte('recorded_at', timeThreshold.toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setDatabaseMetrics(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Fetch performance trends
  const fetchPerformanceTrends = useCallback(async (period: 'hour' | 'day' | 'week' = 'hour') => {
    try {
      const { data, error } = await supabase
        .from('performance_trends')
        .select('*')
        .eq('aggregation_period', period)
        .order('period_start', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPerformanceTrends(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Record a system metric
  const recordSystemMetric = useCallback(async (metric: Omit<SystemMetric, 'id' | 'recorded_at'>) => {
    try {
      const { error } = await supabase.functions.invoke('record-system-metric', {
        body: metric
      });

      if (error) throw error;
      
      // Refresh metrics after recording
      fetchSystemMetrics();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to record system metric",
        variant: "destructive"
      });
    }
  }, [fetchSystemMetrics, toast]);

  // Calculate system health score
  const calculateHealthScore = useCallback(() => {
    if (systemMetrics.length === 0) return 100;

    const criticalIssues = systemMetrics.filter(m => m.severity === 'critical').length;
    const errorIssues = systemMetrics.filter(m => m.severity === 'error').length;
    const warningIssues = systemMetrics.filter(m => m.severity === 'warning').length;

    let score = 100;
    score -= criticalIssues * 20;
    score -= errorIssues * 10;
    score -= warningIssues * 5;

    return Math.max(0, score);
  }, [systemMetrics]);

  // Get metrics by category
  const getMetricsByCategory = useCallback((category: string) => {
    return systemMetrics.filter(m => m.service_name === category);
  }, [systemMetrics]);

  // Get latest metric value
  const getLatestMetricValue = useCallback((metricName: string) => {
    const metric = systemMetrics.find(m => m.metric_name === metricName);
    return metric?.metric_value || null;
  }, [systemMetrics]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSystemMetrics(),
        fetchDatabaseMetrics(),
        fetchPerformanceTrends()
      ]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscriptions
    const systemMetricsChannel = supabase
      .channel('system-metrics-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'system_health_metrics' },
        () => fetchSystemMetrics()
      )
      .subscribe();

    const dbMetricsChannel = supabase
      .channel('db-metrics-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'database_metrics' },
        () => fetchDatabaseMetrics()
      )
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchSystemMetrics();
      fetchDatabaseMetrics();
    }, 30000);

    return () => {
      supabase.removeChannel(systemMetricsChannel);
      supabase.removeChannel(dbMetricsChannel);
      clearInterval(interval);
    };
  }, [fetchSystemMetrics, fetchDatabaseMetrics, fetchPerformanceTrends]);

  return {
    systemMetrics,
    databaseMetrics,
    performanceTrends,
    loading,
    error,
    recordSystemMetric,
    calculateHealthScore,
    getMetricsByCategory,
    getLatestMetricValue,
    fetchSystemMetrics,
    fetchDatabaseMetrics,
    fetchPerformanceTrends
  };
};