import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TenantInfo {
  id: string
  name: string
  slug: string
  status: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Subdomain router called:', req.url)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const host = req.headers.get('host') || url.hostname
    console.log('Host header:', host)

    // Extract subdomain from host
    const hostParts = host.split('.')
    let subdomain = null
    
    // Handle different domain patterns
    if (hostParts.length > 2) {
      // For domains like: tenant.myapp.com or tenant.localhost:3000
      subdomain = hostParts[0]
    } else if (hostParts.length === 2 && host.includes('localhost')) {
      // Handle localhost with port: tenant.localhost:3000
      const portIndex = host.indexOf(':')
      if (portIndex > 0) {
        const domainPart = host.substring(0, portIndex)
        const parts = domainPart.split('.')
        if (parts.length > 1) {
          subdomain = parts[0]
        }
      }
    }

    console.log('Extracted subdomain:', subdomain)

    // If no subdomain or subdomain is 'www', return main app routing
    if (!subdomain || subdomain === 'www' || subdomain === 'app') {
      return new Response(
        JSON.stringify({
          type: 'main_app',
          subdomain: null,
          tenant: null,
          redirectTo: '/dashboard'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Look up tenant by subdomain/slug
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('id, name, slug, status')
      .eq('slug', subdomain)
      .eq('status', 'active')
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({
          type: 'error',
          error: 'Database error',
          message: error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    if (!tenant) {
      console.log('Tenant not found for subdomain:', subdomain)
      return new Response(
        JSON.stringify({
          type: 'tenant_not_found',
          subdomain,
          tenant: null,
          redirectTo: '/not-found'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    console.log('Tenant found:', tenant)

    // Check if this is a valid domain for the tenant
    const { data: domainData } = await supabase
      .from('domains')
      .select('domain, status')
      .eq('tenant_id', tenant.id)
      .eq('status', 'active')

    const isValidDomain = domainData?.some(d => 
      host.includes(d.domain) || 
      host.startsWith(`${tenant.slug}.`)
    ) || host.includes('localhost')

    if (!isValidDomain) {
      console.log('Invalid domain for tenant')
      return new Response(
        JSON.stringify({
          type: 'invalid_domain',
          subdomain,
          tenant,
          redirectTo: '/not-found'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    // Return tenant information for routing
    return new Response(
      JSON.stringify({
        type: 'tenant_app',
        subdomain,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          status: tenant.status
        },
        redirectTo: '/client'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Subdomain router error:', error)
    return new Response(
      JSON.stringify({
        type: 'error',
        error: 'Internal server error',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})