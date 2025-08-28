import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Cron } from "https://deno.land/x/croner@8.0.2/dist/croner.js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action } = await req.json()
    
    let result
    
    switch (action) {
      case 'monitor_all_domains':
        result = await monitorAllDomains(supabase)
        break
      case 'check_ssl_expiration':
        result = await checkSSLExpiration(supabase)
        break
      case 'collect_analytics':
        result = await collectDomainAnalytics(supabase)
        break
      case 'start_monitoring':
        result = await startMonitoring(supabase)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Domain monitoring error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function monitorAllDomains(supabase: any) {
  console.log('Starting domain monitoring check...')
  
  // Get all active domains
  const { data: domains, error } = await supabase
    .from('domains')
    .select('*')
    .eq('status', 'active')

  if (error) {
    throw new Error(`Failed to fetch domains: ${error.message}`)
  }

  const results = []
  
  for (const domain of domains) {
    try {
      const healthCheck = await performHealthCheck(domain)
      
      // Save health check result
      await supabase
        .from('domain_health_checks')
        .insert({
          domain_id: domain.id,
          tenant_id: domain.tenant_id,
          check_type: 'scheduled',
          status: healthCheck.status,
          response_time_ms: healthCheck.response_time_ms,
          ssl_days_remaining: healthCheck.ssl_days_remaining,
          check_data: healthCheck.check_data,
          error_message: healthCheck.error_message
        })

      results.push({
        domain: domain.domain,
        status: healthCheck.status,
        response_time: healthCheck.response_time_ms
      })

      // Trigger alerts if issues detected
      if (healthCheck.status !== 'healthy') {
        await triggerDomainAlert(supabase, domain, healthCheck)
      }

    } catch (error) {
      console.error(`Error checking domain ${domain.domain}:`, error)
      results.push({
        domain: domain.domain,
        status: 'error',
        error: error.message
      })
    }
  }

  console.log(`Completed monitoring check for ${results.length} domains`)
  return { checked_domains: results.length, results }
}

async function performHealthCheck(domain: any) {
  const startTime = Date.now()
  let healthData: any = {
    status: 'unknown',
    response_time_ms: 0,
    ssl_days_remaining: null,
    check_data: {},
    error_message: null
  }

  try {
    // Test HTTPS connectivity
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    const response = await fetch(`https://${domain.domain}`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Blunari-Domain-Monitor/1.0'
      }
    })
    
    clearTimeout(timeoutId)
    
    healthData.response_time_ms = Date.now() - startTime
    healthData.check_data.http_status = response.status
    healthData.check_data.headers = Object.fromEntries(response.headers.entries())
    
    // Determine health status based on response
    if (response.ok) {
      healthData.status = 'healthy'
    } else if (response.status >= 500) {
      healthData.status = 'unhealthy'
      healthData.error_message = `Server error: ${response.status}`
    } else {
      healthData.status = 'degraded'
      healthData.error_message = `Client error: ${response.status}`
    }
    
    // Check SSL certificate expiration
    if (domain.ssl_expires_at) {
      const expiresAt = new Date(domain.ssl_expires_at)
      const daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      healthData.ssl_days_remaining = daysRemaining
      
      if (daysRemaining < 30) {
        healthData.status = daysRemaining < 7 ? 'unhealthy' : 'degraded'
        healthData.error_message = `SSL certificate expires in ${daysRemaining} days`
      }
    }

    // Check response time thresholds
    if (healthData.response_time_ms > 10000) {
      healthData.status = 'unhealthy'
      healthData.error_message = 'Response time exceeded 10 seconds'
    } else if (healthData.response_time_ms > 5000 && healthData.status === 'healthy') {
      healthData.status = 'degraded'
      healthData.error_message = 'Slow response time'
    }

  } catch (error) {
    healthData.status = 'unhealthy'
    healthData.response_time_ms = Date.now() - startTime
    healthData.error_message = error.message
    healthData.check_data.error = error.name
  }

  return healthData
}

async function checkSSLExpiration(supabase: any) {
  console.log('Checking SSL certificate expiration...')
  
  // Use the existing database function
  const { data: expiringDomains, error } = await supabase
    .rpc('check_ssl_expiration')

  if (error) {
    throw new Error(`Failed to check SSL expiration: ${error.message}`)
  }

  const alerts = []
  
  for (const domain of expiringDomains) {
    const daysRemaining = domain.days_remaining
    let severity = 'warning'
    
    if (daysRemaining <= 7) {
      severity = 'critical'
    } else if (daysRemaining <= 14) {
      severity = 'high'
    }

    // Create alert
    await supabase
      .from('alert_instances')
      .insert({
        rule_id: null, // System generated alert
        metric_value: daysRemaining,
        threshold_value: 30,
        severity: severity,
        message: `SSL certificate for ${domain.domain_name} expires in ${daysRemaining} days`,
        metadata: {
          domain_id: domain.domain_id,
          domain_name: domain.domain_name,
          alert_type: 'ssl_expiration'
        }
      })

    alerts.push({
      domain: domain.domain_name,
      days_remaining: daysRemaining,
      severity: severity
    })
  }

  console.log(`Found ${alerts.length} domains with expiring SSL certificates`)
  return { expiring_domains: alerts }
}

async function collectDomainAnalytics(supabase: any) {
  console.log('Collecting domain analytics...')
  
  const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
  if (!cloudflareToken) {
    throw new Error('Cloudflare API token not configured')
  }

  const cloudflareHeaders = {
    'Authorization': `Bearer ${cloudflareToken}`,
    'Content-Type': 'application/json',
  }

  // Get all active domains with Cloudflare integration
  const { data: domains, error } = await supabase
    .from('domains')
    .select('*')
    .eq('status', 'active')
    .not('cloudflare_zone_id', 'is', null)

  if (error) {
    throw new Error(`Failed to fetch domains: ${error.message}`)
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  const analyticsResults = []

  for (const domain of domains) {
    try {
      // Fetch analytics from Cloudflare
      const analyticsResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${domain.cloudflare_zone_id}/analytics/dashboard?since=${dateStr}&until=${dateStr}`,
        { headers: cloudflareHeaders }
      )

      const analyticsData = await analyticsResponse.json()
      
      if (analyticsData.success && analyticsData.result) {
        const result = analyticsData.result
        const totals = result.totals || {}
        
        // Save analytics to database
        await supabase
          .from('domain_analytics')
          .upsert({
            domain_id: domain.id,
            tenant_id: domain.tenant_id,
            date: dateStr,
            requests_count: totals.requests?.all || 0,
            unique_visitors: totals.uniques?.all || 0,
            bandwidth_bytes: totals.bandwidth?.all || 0,
            cache_hit_rate: totals.requests?.cached ? 
              (totals.requests.cached / totals.requests.all * 100) : 0,
            avg_response_time_ms: null, // Would need separate API call
            error_rate: totals.requests?.http_status && totals.requests.all ? 
              ((totals.requests.http_status[4] || 0) + (totals.requests.http_status[5] || 0)) / totals.requests.all * 100 : 0,
            top_pages: result.timeseries?.[0]?.requests?.content_type || {},
            countries: result.timeseries?.[0]?.requests?.country || {}
          }, {
            onConflict: 'domain_id,date'
          })

        analyticsResults.push({
          domain: domain.domain,
          requests: totals.requests?.all || 0,
          visitors: totals.uniques?.all || 0
        })
      }
    } catch (error) {
      console.error(`Error collecting analytics for ${domain.domain}:`, error)
      analyticsResults.push({
        domain: domain.domain,
        error: error.message
      })
    }
  }

  console.log(`Collected analytics for ${analyticsResults.length} domains`)
  return { analytics_collected: analyticsResults }
}

async function triggerDomainAlert(supabase: any, domain: any, healthCheck: any) {
  const severity = healthCheck.status === 'unhealthy' ? 'high' : 'medium'
  
  await supabase
    .from('alert_instances')
    .insert({
      rule_id: null, // System generated alert
      metric_value: healthCheck.response_time_ms,
      threshold_value: 5000,
      severity: severity,
      message: `Domain ${domain.domain} is ${healthCheck.status}: ${healthCheck.error_message || 'No additional details'}`,
      metadata: {
        domain_id: domain.id,
        domain_name: domain.domain,
        alert_type: 'domain_health',
        health_check: healthCheck
      }
    })
}

async function startMonitoring(supabase: any) {
  console.log('Starting domain monitoring schedule...')
  
  // Health checks every 5 minutes
  const healthCron = new Cron('*/5 * * * *', async () => {
    await monitorAllDomains(supabase)
  })

  // SSL expiration checks daily at 9 AM
  const sslCron = new Cron('0 9 * * *', async () => {
    await checkSSLExpiration(supabase)
  })

  // Analytics collection daily at 2 AM
  const analyticsCron = new Cron('0 2 * * *', async () => {
    await collectDomainAnalytics(supabase)
  })

  return {
    message: 'Domain monitoring started',
    schedules: {
      health_checks: '*/5 * * * *',
      ssl_checks: '0 9 * * *',
      analytics: '0 2 * * *'
    }
  }
}