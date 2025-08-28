import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
  user_session?: string;
  user_agent?: string;
  ip_address?: string;
}

interface BusinessMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  period_start: Date;
  period_end: Date;
  metadata?: Record<string, any>;
}

export const useAnalyticsTracking = () => {
  const { toast } = useToast();

  // Track user events
  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'user_session' | 'user_agent' | 'tenant_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get current tenant ID for the user
      const { data: tenantData } = await supabase
        .from('auto_provisioning')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .single();

      if (!tenantData?.tenant_id) return;

      const { error } = await supabase.from('analytics_events').insert({
        ...event,
        tenant_id: tenantData.tenant_id,
        user_session: user.id,
        user_agent: navigator.userAgent
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to track analytics event:', err);
    }
  }, []);

  // Record business metrics
  const recordMetric = useCallback(async (metric: BusinessMetric) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase.from('business_metrics').insert({
        ...metric,
        period_start: metric.period_start.toISOString(),
        period_end: metric.period_end.toISOString(),
        metadata: metric.metadata || {}
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to record business metric:', err);
      toast({
        title: "Metrics Error",
        description: "Failed to record business metric",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Track page views
  const trackPageView = useCallback((page: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'page_view',
      event_data: {
        page,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }, [trackEvent]);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, action: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'feature_usage',
      event_data: {
        feature,
        action,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }, [trackEvent]);

  // Track user engagement
  const trackEngagement = useCallback((type: string, duration?: number, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'user_engagement',
      event_data: {
        engagement_type: type,
        duration_seconds: duration,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }, [trackEvent]);

  // Automatic page view tracking
  useEffect(() => {
    const currentPath = window.location.pathname;
    trackPageView(currentPath, {
      referrer: document.referrer,
      user_agent: navigator.userAgent
    });
  }, [trackPageView]);

  return {
    trackEvent,
    recordMetric,
    trackPageView,
    trackFeatureUsage,
    trackEngagement
  };
};