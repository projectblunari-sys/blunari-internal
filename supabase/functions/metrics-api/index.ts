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

    // Parse request body for metric type
    const requestData = await req.json()
    const metricType = requestData.type || 'system'
    
    const backgroundOpsUrl = Deno.env.get('BACKGROUND_OPS_URL') ?? 'https://background-ops.fly.dev'
    const backgroundOpsApiKey = Deno.env.get('BACKGROUND_OPS_API_KEY') ?? ''

    console.log('Metrics API: Fetching system metrics')
    console.log(`Background Ops URL: ${backgroundOpsUrl}`)
    console.log(`API Key present: ${backgroundOpsApiKey ? 'Yes' : 'No'}`)
    console.log(`Metric type: ${metricType}`)

    // Fetch metrics from background operations service
    const response = await fetch(`${backgroundOpsUrl}/api/v1/metrics?type=${metricType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': backgroundOpsApiKey,
      },
    })

    console.log(`Metrics response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Background service metrics error: ${response.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: `Background service returned ${response.status}`, 
          details: errorText 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const metricsData = await response.json()
    console.log(`Metrics data received: ${JSON.stringify(metricsData)}`)

    // Store metrics in Supabase
    const { error: insertError } = await supabaseClient
      .from('system_health_metrics')
      .insert({
        metric_name: 'background_ops_metrics',
        metric_value: metricsData.metrics?.length || 0,
        metric_unit: 'count',
        service_name: 'background-ops',
        metadata: metricsData
      })

    if (insertError) {
      console.error('Error storing metrics:', insertError)
    }

    return new Response(
      JSON.stringify(metricsData),
      { 
        status: 200,
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