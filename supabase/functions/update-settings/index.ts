import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateSettingsRequest {
  category: 'global' | 'email' | 'sms' | 'security' | 'backup' | 'features';
  settings: Record<string, any>;
  updatedBy?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
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

    const { category, settings, updatedBy }: UpdateSettingsRequest = await req.json();

    // Validate input
    if (!category || !settings) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: category and settings' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log(`Updating ${category} settings:`, settings);

    // Handle different setting categories
    let result;
    
    switch (category) {
      case 'global':
        result = await updateGlobalSettings(supabaseClient, settings, updatedBy);
        break;
      case 'email':
        result = await updateEmailSettings(supabaseClient, settings);
        break;
      case 'sms':
        result = await updateSMSSettings(supabaseClient, settings);
        break;
      case 'security':
        result = await updateSecuritySettings(supabaseClient, settings);
        break;
      case 'backup':
        result = await updateBackupSettings(supabaseClient, settings);
        break;
      case 'features':
        result = await updateFeatureFlags(supabaseClient, settings);
        break;
      default:
        throw new Error(`Unknown settings category: ${category}`);
    }

    // Log the settings update
    await logSettingsUpdate(supabaseClient, category, settings, updatedBy);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${category} settings updated successfully`,
        data: result 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error updating settings:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.details || null
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function updateGlobalSettings(supabaseClient: any, settings: any, updatedBy?: string) {
  // In a real implementation, you would update the global settings table
  // For now, we'll simulate the update
  
  const updatedSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || 'system'
  };

  console.log('Global settings updated:', updatedSettings);
  return updatedSettings;
}

async function updateEmailSettings(supabaseClient: any, settings: any) {
  // Update email configuration
  // This would typically update an email_configurations table
  
  console.log('Email settings updated:', settings);
  return { configurationId: 'email-1', ...settings };
}

async function updateSMSSettings(supabaseClient: any, settings: any) {
  // Update SMS configuration
  // This would typically update an sms_configurations table
  
  console.log('SMS settings updated:', settings);
  return { configurationId: 'sms-1', ...settings };
}

async function updateSecuritySettings(supabaseClient: any, settings: any) {
  // Update security settings
  // This would typically update a security_settings table
  
  console.log('Security settings updated:', settings);
  return { configurationId: 'security-1', ...settings };
}

async function updateBackupSettings(supabaseClient: any, settings: any) {
  // Update backup configuration
  // This would typically update a backup_configurations table
  
  console.log('Backup settings updated:', settings);
  return { configurationId: 'backup-1', ...settings };
}

async function updateFeatureFlags(supabaseClient: any, settings: any) {
  // Update feature flags
  // This would typically update individual feature flags in a feature_flags table
  
  const { flagId, enabled, rolloutPercentage, targetTenants } = settings;
  
  console.log(`Feature flag ${flagId} updated:`, { enabled, rolloutPercentage, targetTenants });
  
  return { 
    flagId, 
    enabled, 
    rolloutPercentage, 
    targetTenants,
    updatedAt: new Date().toISOString()
  };
}

async function logSettingsUpdate(supabaseClient: any, category: string, settings: any, updatedBy?: string) {
  // Log the settings update for audit purposes
  const logEntry = {
    category,
    action: 'update',
    changes: settings,
    updatedBy: updatedBy || 'system',
    timestamp: new Date().toISOString()
  };
  
  console.log('Settings update logged:', logEntry);
  
  // In a real implementation, you would insert this into an audit log table
  // const { error } = await supabaseClient
  //   .from('settings_audit_log')
  //   .insert(logEntry);
  
  return logEntry;
}

serve(handler);