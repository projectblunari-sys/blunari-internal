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
    const action = url.searchParams.get('action') || 'list'
    
    const backgroundOpsUrl = Deno.env.get('BACKGROUND_OPS_URL') ?? 'https://your-app.fly.dev'
    const backgroundOpsApiKey = Deno.env.get('BACKGROUND_OPS_API_KEY') ?? ''

    let endpoint = '/api/jobs'
    let method = 'GET'
    let body = null

    switch (action) {
      case 'list':
        endpoint = '/api/jobs'
        method = 'GET'
        break
      case 'create':
        endpoint = '/api/jobs'
        method = 'POST'
        body = await req.json()
        break
      case 'get':
        const jobId = url.searchParams.get('id')
        endpoint = `/api/jobs/${jobId}`
        method = 'GET'
        break
      case 'cancel':
        const cancelId = url.searchParams.get('id')
        endpoint = `/api/jobs/${cancelId}/cancel`
        method = 'POST'
        break
      case 'retry':
        const retryId = url.searchParams.get('id')
        endpoint = `/api/jobs/${retryId}/retry`
        method = 'POST'
        break
    }

    console.log(`Jobs API: ${method} ${endpoint}`)

    const response = await fetch(`${backgroundOpsUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': backgroundOpsApiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

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