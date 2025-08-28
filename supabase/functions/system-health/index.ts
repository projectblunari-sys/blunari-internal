import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SystemHealthResponse {
  overall: 'healthy' | 'degraded' | 'critical';
  components: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    responseTime?: number;
    uptime: number;
    lastCheck: string;
  }>;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    databaseConnections: number;
    activeUsers: number;
  };
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking system health...');

    // Check database connectivity
    const dbHealth = await checkDatabaseHealth(supabaseClient);
    
    // Check external services
    const servicesHealth = await checkExternalServices();
    
    // Get system metrics
    const systemMetrics = await getSystemMetrics();
    
    // Get active alerts
    const activeAlerts = await getActiveAlerts();
    
    // Determine overall health status
    const overallStatus = determineOverallHealth(dbHealth, servicesHealth, systemMetrics);

    const healthResponse: SystemHealthResponse = {
      overall: overallStatus,
      components: [
        {
          name: 'Database Primary',
          status: dbHealth.primary ? 'operational' : 'outage',
          responseTime: dbHealth.primaryResponseTime,
          uptime: 99.99,
          lastCheck: new Date().toISOString()
        },
        {
          name: 'Database Replica',
          status: dbHealth.replica ? 'operational' : 'degraded',
          responseTime: dbHealth.replicaResponseTime,
          uptime: 99.95,
          lastCheck: new Date().toISOString()
        },
        ...servicesHealth
      ],
      metrics: systemMetrics,
      alerts: activeAlerts
    };

    console.log('System health check completed:', healthResponse);

    return new Response(
      JSON.stringify(healthResponse),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error checking system health:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        overall: 'critical'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function checkDatabaseHealth(supabaseClient: any) {
  try {
    const startTime = Date.now();
    
    // Simple query to test database connectivity
    const { data, error } = await supabaseClient
      .from('tenants')
      .select('count')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      console.error('Database health check failed:', error);
      return { 
        primary: false, 
        replica: false,
        primaryResponseTime: responseTime,
        replicaResponseTime: responseTime
      };
    }

    return { 
      primary: true, 
      replica: true,
      primaryResponseTime: responseTime,
      replicaResponseTime: responseTime + Math.floor(Math.random() * 10) // Simulate replica delay
    };
  } catch (error) {
    console.error('Database connectivity error:', error);
    return { 
      primary: false, 
      replica: false,
      primaryResponseTime: 5000,
      replicaResponseTime: 5000
    };
  }
}

async function checkExternalServices() {
  const services = [
    { name: 'API Gateway', url: 'https://httpbin.org/status/200' },
    { name: 'Email Service', url: 'https://httpbin.org/status/200' },
    { name: 'SMS Service', url: 'https://httpbin.org/delay/1' },
    { name: 'Payment Processing', url: 'https://httpbin.org/status/200' }
  ];

  const results = [];

  for (const service of services) {
    try {
      const startTime = Date.now();
      const response = await fetch(service.url, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      const responseTime = Date.now() - startTime;

      results.push({
        name: service.name,
        status: response.ok ? 'operational' : 'degraded',
        responseTime,
        uptime: response.ok ? 99.9 + Math.random() * 0.09 : 98.0 + Math.random() * 1.0,
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Health check failed for ${service.name}:`, error);
      results.push({
        name: service.name,
        status: 'outage',
        responseTime: 5000,
        uptime: 95.0 + Math.random() * 3.0,
        lastCheck: new Date().toISOString()
      });
    }
  }

  return results;
}

async function getSystemMetrics() {
  // In a real implementation, these would come from system monitoring
  // For demo purposes, we'll generate realistic simulated values
  
  return {
    cpuUsage: Math.floor(30 + Math.random() * 40), // 30-70%
    memoryUsage: Math.floor(50 + Math.random() * 30), // 50-80%
    diskUsage: Math.floor(20 + Math.random() * 40), // 20-60%
    databaseConnections: Math.floor(100 + Math.random() * 50), // 100-150
    activeUsers: Math.floor(1500 + Math.random() * 500) // 1500-2000
  };
}

async function getActiveAlerts() {
  // In a real implementation, these would come from an alerts database
  // For demo purposes, we'll return some sample alerts
  
  const alerts = [];
  
  // Simulate some random alerts
  if (Math.random() > 0.7) {
    alerts.push({
      id: `alert-${Date.now()}`,
      severity: 'warning' as const,
      message: 'High memory usage detected on application server',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time in last hour
      resolved: false
    });
  }
  
  if (Math.random() > 0.8) {
    alerts.push({
      id: `alert-${Date.now() + 1}`,
      severity: 'info' as const,
      message: 'Scheduled backup completed successfully',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last day
      resolved: true
    });
  }

  return alerts;
}

function determineOverallHealth(dbHealth: any, servicesHealth: any[], metrics: any): 'healthy' | 'degraded' | 'critical' {
  // Critical if database is down
  if (!dbHealth.primary) return 'critical';
  
  // Critical if CPU or memory usage is very high
  if (metrics.cpuUsage > 90 || metrics.memoryUsage > 95) return 'critical';
  
  // Degraded if any services are down or replica is down
  const servicesDown = servicesHealth.filter(s => s.status === 'outage').length;
  if (servicesDown > 0 || !dbHealth.replica) return 'degraded';
  
  // Degraded if resources are stressed
  if (metrics.cpuUsage > 70 || metrics.memoryUsage > 80) return 'degraded';
  
  return 'healthy';
}

serve(handler);