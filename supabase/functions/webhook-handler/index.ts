import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  source: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get webhook path to determine source
    const url = new URL(req.url);
    const source = url.pathname.split('/').pop() || 'unknown';
    
    console.log(`Processing webhook from ${source}`);

    // Verify webhook signature if available
    const signature = req.headers.get('x-signature');
    const body = await req.text();
    
    if (signature && !verifyWebhookSignature(body, signature, source)) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse payload
    let payload: WebhookPayload;
    try {
      const data = JSON.parse(body);
      payload = {
        event: data.type || data.event || 'unknown',
        data: data.data || data,
        timestamp: new Date().toISOString(),
        source
      };
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return new Response('Invalid JSON', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    console.log(`Processing event: ${payload.event} from ${payload.source}`);

    // Route webhook based on source
    switch (source) {
      case 'stripe':
        await handleStripeWebhook(supabase, payload);
        break;
      case 'twilio':
        await handleTwilioWebhook(supabase, payload);
        break;
      case 'toast':
        await handleToastWebhook(supabase, payload);
        break;
      case 'square':
        await handleSquareWebhook(supabase, payload);
        break;
      case 'cloudflare':
        await handleCloudflareWebhook(supabase, payload);
        break;
      default:
        await handleGenericWebhook(supabase, payload);
    }

    // Log webhook delivery
    await supabase.from('webhook_deliveries').insert({
      source: payload.source,
      event: payload.event,
      payload: payload.data,
      status: 'success',
      processed_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log failed delivery
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('webhook_deliveries').insert({
        source: 'unknown',
        event: 'error',
        payload: { error: error.message },
        status: 'failed',
        processed_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function verifyWebhookSignature(body: string, signature: string, source: string): boolean {
  // Implement signature verification logic based on source
  // This is a simplified version - implement proper verification for each service
  
  const secrets: Record<string, string> = {
    stripe: Deno.env.get('STRIPE_WEBHOOK_SECRET') || '',
    twilio: Deno.env.get('TWILIO_WEBHOOK_SECRET') || '',
    toast: Deno.env.get('TOAST_WEBHOOK_SECRET') || '',
    square: Deno.env.get('SQUARE_WEBHOOK_SECRET') || '',
    cloudflare: Deno.env.get('CLOUDFLARE_WEBHOOK_SECRET') || ''
  };

  const secret = secrets[source];
  if (!secret) {
    console.warn(`No webhook secret configured for ${source}`);
    return true; // Allow if no secret is configured
  }

  // Implement proper signature verification here
  // Each service has its own signature format
  return true; // Simplified for demo
}

async function handleStripeWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Stripe webhook:', payload.event);
  
  switch (payload.event) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(supabase, payload.data);
      break;
    case 'subscription.created':
      await handleSubscriptionCreated(supabase, payload.data);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(supabase, payload.data);
      break;
    default:
      console.log(`Unhandled Stripe event: ${payload.event}`);
  }
}

async function handleTwilioWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Twilio webhook:', payload.event);
  
  // Handle SMS delivery status, incoming messages, etc.
  await supabase.from('sms_logs').insert({
    event_type: payload.event,
    message_sid: payload.data.MessageSid,
    status: payload.data.MessageStatus,
    to_number: payload.data.To,
    from_number: payload.data.From,
    body: payload.data.Body,
    received_at: new Date().toISOString()
  });
}

async function handleToastWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Toast POS webhook:', payload.event);
  
  switch (payload.event) {
    case 'order.created':
      await handlePOSOrderCreated(supabase, payload.data, 'toast');
      break;
    case 'menu.updated':
      await handleMenuUpdated(supabase, payload.data, 'toast');
      break;
    default:
      console.log(`Unhandled Toast event: ${payload.event}`);
  }
}

async function handleSquareWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Square webhook:', payload.event);
  
  switch (payload.event) {
    case 'payment.created':
      await handleSquarePayment(supabase, payload.data);
      break;
    case 'inventory.updated':
      await handleInventoryUpdate(supabase, payload.data);
      break;
    default:
      console.log(`Unhandled Square event: ${payload.event}`);
  }
}

async function handleCloudflareWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Cloudflare webhook:', payload.event);
  
  // Handle DNS changes, SSL certificate updates, etc.
  await supabase.from('domain_events').insert({
    event_type: payload.event,
    domain: payload.data.zone_name,
    event_data: payload.data,
    triggered_at: new Date().toISOString()
  });
}

async function handleGenericWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing generic webhook:', payload.event);
  
  // Store in generic webhook logs table
  await supabase.from('webhook_logs').insert({
    source: payload.source,
    event: payload.event,
    payload: payload.data,
    received_at: new Date().toISOString()
  });
}

async function handlePaymentSucceeded(supabase: any, data: any) {
  // Update payment status in database
  await supabase.from('payments').upsert({
    stripe_payment_intent_id: data.id,
    amount: data.amount,
    currency: data.currency,
    status: 'succeeded',
    customer_id: data.customer,
    updated_at: new Date().toISOString()
  });
}

async function handleSubscriptionCreated(supabase: any, data: any) {
  // Update subscriber record
  await supabase.from('subscribers').upsert({
    stripe_customer_id: data.customer,
    subscription_id: data.id,
    status: data.status,
    current_period_start: new Date(data.current_period_start * 1000).toISOString(),
    current_period_end: new Date(data.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString()
  });
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
  // Update subscriber status
  await supabase.from('subscribers').update({
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).eq('subscription_id', data.id);
}

async function handlePOSOrderCreated(supabase: any, data: any, provider: string) {
  // Sync POS order to bookings if applicable
  await supabase.from('pos_events').insert({
    provider,
    event_type: 'order.created',
    external_id: data.id,
    event_data: data,
    processed_at: new Date().toISOString()
  });
}

async function handleMenuUpdated(supabase: any, data: any, provider: string) {
  // Update menu items from POS system
  for (const item of data.items || []) {
    await supabase.from('pos_menu_items').upsert({
      provider,
      external_id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      available: item.available,
      category: item.category,
      last_synced_at: new Date().toISOString()
    });
  }
}

async function handleSquarePayment(supabase: any, data: any) {
  // Handle Square payment events
  await supabase.from('payments').upsert({
    square_payment_id: data.id,
    amount: data.amount_money?.amount,
    currency: data.amount_money?.currency,
    status: data.status,
    updated_at: new Date().toISOString()
  });
}

async function handleInventoryUpdate(supabase: any, data: any) {
  // Update inventory from Square
  await supabase.from('inventory_updates').insert({
    provider: 'square',
    item_id: data.item_id,
    quantity: data.quantity,
    updated_at: new Date().toISOString()
  });
}