import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CredentialUpdateRequest {
  tenantId: string;
  action: 'update_email' | 'update_password' | 'generate_password' | 'reset_password';
  newEmail?: string;
  newPassword?: string;
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const generateSecurePassword = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, action, newEmail, newPassword }: CredentialUpdateRequest = await req.json();

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has admin privileges
    const { data: employee } = await supabaseAdmin
      .from('employees')
      .select('role')
      .eq('user_id', user.id)
      .eq('status', 'ACTIVE')
      .single();

    if (!employee || !['SUPER_ADMIN', 'ADMIN', 'SUPPORT'].includes(employee.role)) {
      throw new Error('Insufficient privileges');
    }

    // Get tenant owner user ID
    const { data: provisioning } = await supabaseAdmin
      .from('auto_provisioning')
      .select('user_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .single();

    if (!provisioning) {
      throw new Error('Tenant not found');
    }

    const tenantOwnerId = provisioning.user_id;
    let result: any = {};

    switch (action) {
      case 'update_email':
        if (!newEmail) throw new Error('New email required');
        
        // Update user email in Supabase Auth
        const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
          tenantOwnerId,
          { email: newEmail }
        );

        if (emailError) throw emailError;

        // Update profiles table
        await supabaseAdmin
          .from('profiles')
          .update({ email: newEmail })
          .eq('id', tenantOwnerId);

        result = { message: 'Email updated successfully', newEmail };
        break;

      case 'update_password':
        if (!newPassword) throw new Error('New password required');
        
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          tenantOwnerId,
          { password: newPassword }
        );

        if (passwordError) throw passwordError;

        result = { message: 'Password updated successfully' };
        break;

      case 'generate_password':
        const generatedPassword = generateSecurePassword();
        
        const { error: genError } = await supabaseAdmin.auth.admin.updateUserById(
          tenantOwnerId,
          { password: generatedPassword }
        );

        if (genError) throw genError;

        result = { 
          message: 'New password generated successfully', 
          newPassword: generatedPassword 
        };
        break;

      case 'reset_password':
        // Get user email first
        const { data: userProfile } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .eq('id', tenantOwnerId)
          .single();

        if (!userProfile?.email) throw new Error('User email not found');

        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: userProfile.email,
        });

        if (resetError) throw resetError;

        result = { message: 'Password reset email sent successfully' };
        break;

      default:
        throw new Error('Invalid action');
    }

    // Log the action for audit purposes
    await supabaseAdmin.from('security_events').insert({
      event_type: 'credential_change',
      severity: 'high',
      user_id: tenantOwnerId,
      event_data: {
        action,
        tenant_id: tenantId,
        changed_by: user.id,
        changed_by_email: user.email,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`Credential action completed: ${action} for tenant ${tenantId} by ${user.email}`);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in manage-tenant-credentials:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);