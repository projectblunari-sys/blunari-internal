import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const metricType = url.searchParams.get('type') || 'system'
    
    const backgroundOpsUrl = Deno.env.get('BACKGROUND_OPS_URL') ?? 'https://services.blunari.ai'
    const backgroundOpsApiKey = Deno.env.get('BACKGROUND_OPS_API_KEY') ?? ''

    console.log(`Metrics API: fetching ${metricType} metrics`)

    const response = await fetch(`${backgroundOpsUrl}/api/metrics?type=${metricType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': backgroundOpsApiKey,
      },
    })

    const data = await response.json()

    // Store metrics in database for historical tracking
    if (data.metrics && Array.isArray(data.metrics)) {
      const metricsToInsert = data.metrics.map((metric: any) => ({
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit || 'count',
        service_name: 'background-ops',
        metadata: metric.metadata || {},
      }))

      await supabaseClient
        .from('system_health_metrics')
        .insert(metricsToInsert)
    }

    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Metrics API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})