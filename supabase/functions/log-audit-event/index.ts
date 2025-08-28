import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditEventRequest {
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const {
      action,
      resourceType,
      resourceId,
      metadata = {},
      ipAddress,
      userAgent
    }: AuditEventRequest = await req.json();

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get employee ID for the user
    const { data: employee, error: employeeError } = await supabaseClient
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .single();

    if (employeeError || !employee) {
      return new Response(
        JSON.stringify({ error: 'Employee not found or inactive' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract IP address from headers if not provided
    const clientIP = ipAddress || 
      req.headers.get('x-forwarded-for') || 
      req.headers.get('x-real-ip') || 
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    // Extract user agent if not provided
    const clientUserAgent = userAgent || req.headers.get('user-agent') || 'unknown';

    // Enhanced metadata with request context
    const enhancedMetadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
      request_id: crypto.randomUUID(),
      session_id: req.headers.get('x-session-id'),
      source: 'web_app',
      ...(!ipAddress && { detected_ip: clientIP }),
      ...(!userAgent && { detected_user_agent: clientUserAgent }),
    };

    // Insert audit log record
    const { data: auditLog, error: insertError } = await supabaseClient
      .from('activity_logs')
      .insert({
        employee_id: employee.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: enhancedMetadata,
        ip_address: clientIP,
        user_agent: clientUserAgent,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting audit log:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log audit event' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for sensitive actions that require additional logging
    const sensitiveActions = [
      'employee_created',
      'employee_deleted',
      'role_changed',
      'impersonation_started',
      'impersonation_ended',
      'api_key_created',
      'api_key_revoked',
      'password_changed',
      'two_factor_enabled',
      'two_factor_disabled',
      'system_settings_changed',
      'bulk_delete',
      'data_export',
    ];

    if (sensitiveActions.includes(action)) {
      // Send notification to admins about sensitive action
      await supabaseClient.functions.invoke('send-security-notification', {
        body: {
          type: 'sensitive_action',
          action,
          employee_id: employee.id,
          user_email: user.email,
          resource_type: resourceType,
          resource_id: resourceId,
          ip_address: clientIP,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Rate limiting check for suspicious activity
    const suspiciousActions = ['login_failed', 'unauthorized_access', 'permission_denied'];
    if (suspiciousActions.includes(action)) {
      // Check for rapid repeated failures
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { data: recentFailures, error: countError } = await supabaseClient
        .from('activity_logs')
        .select('id')
        .eq('employee_id', employee.id)
        .in('action', suspiciousActions)
        .gte('created_at', oneHourAgo.toISOString());

      if (!countError && recentFailures && recentFailures.length >= 10) {
        // Notify about potential security incident
        await supabaseClient.functions.invoke('send-security-notification', {
          body: {
            type: 'security_incident',
            action: 'repeated_failures',
            employee_id: employee.id,
            user_email: user.email,
            failure_count: recentFailures.length,
            ip_address: clientIP,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        audit_log_id: auditLog.id,
        message: 'Audit event logged successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Audit logging error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});