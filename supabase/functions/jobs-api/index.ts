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

    // Parse request body for action and parameters
    const requestData = await req.json()
    const action = requestData.action || 'list'
    
    const backgroundOpsUrl = Deno.env.get('BACKGROUND_OPS_URL') ?? 'https://background-ops.fly.dev'
    const backgroundOpsApiKey = Deno.env.get('BACKGROUND_OPS_API_KEY') ?? ''

    let endpoint = '/api/v1/jobs'
    let method = 'GET'
    let body = null

    switch (action) {
      case 'list':
        endpoint = '/api/v1/jobs'
        method = 'GET'
        break
      case 'get':
        endpoint = `/api/v1/jobs/${requestData.id}`
        method = 'GET'
        break
      case 'create':
        endpoint = '/api/v1/jobs'
        method = 'POST'
        body = JSON.stringify({
          type: requestData.type,
          payload: requestData.payload || {},
          priority: requestData.priority || 1
        })
        break
      case 'cancel':
        endpoint = `/api/v1/jobs/${requestData.id}/cancel`
        method = 'POST'
        break
      case 'retry':
        endpoint = `/api/v1/jobs/${requestData.id}/retry`
        method = 'POST'
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    console.log(`Jobs API: ${method} ${endpoint}`)
    console.log(`Background Ops URL: ${backgroundOpsUrl}`)
    console.log(`API Key present: ${backgroundOpsApiKey ? 'Yes' : 'No'}`)

    const response = await fetch(`${backgroundOpsUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': backgroundOpsApiKey,
      },
      body,
    })

    console.log(`Response status: ${response.status}`)
    console.log(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Background service error: ${response.status} - ${errorText}`)
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

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Jobs API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})