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

    const backgroundOpsUrl = Deno.env.get('BACKGROUND_OPS_URL') ?? 'https://your-app.fly.dev'
    const backgroundOpsApiKey = Deno.env.get('BACKGROUND_OPS_API_KEY') ?? ''

    console.log('Health check request to background-ops')

    const response = await fetch(`${backgroundOpsUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': backgroundOpsApiKey,
      },
    })

    const data = await response.json()

    // Store health check result in database
    await supabaseClient
      .from('system_health_metrics')
      .insert({
        metric_name: 'background_ops_health',
        metric_value: response.status === 200 ? 1 : 0,
        metric_unit: 'status',
        service_name: 'background-ops',
        status_code: response.status,
        metadata: data,
      })

    return new Response(
      JSON.stringify({
        success: true,
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        ...data
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Health check API error:', error)
    
    // Store failed health check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    await supabaseClient
      .from('system_health_metrics')
      .insert({
        metric_name: 'background_ops_health',
        metric_value: 0,
        metric_unit: 'status',
        service_name: 'background-ops',
        status_code: 0,
        metadata: { error: error.message },
      })

    return new Response(
      JSON.stringify({ 
        success: false,
        status: 'unhealthy',
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})