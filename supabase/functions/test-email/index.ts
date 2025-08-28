import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  templateId?: string;
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  testData?: Record<string, string>;
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
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const { 
      templateId, 
      recipientEmail, 
      subject, 
      htmlContent, 
      textContent,
      testData 
    }: TestEmailRequest = await req.json();

    // Validate input
    if (!recipientEmail || !subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: recipientEmail, subject, htmlContent' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log(`Sending test email for template ${templateId} to ${recipientEmail}`);

    // Replace template variables with test data
    let processedSubject = subject;
    let processedHtmlContent = htmlContent;
    let processedTextContent = textContent || '';

    if (testData) {
      Object.entries(testData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
        processedHtmlContent = processedHtmlContent.replace(new RegExp(placeholder, 'g'), value);
        processedTextContent = processedTextContent.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Add test email banner
    const testBanner = `
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px; margin-bottom: 20px; border-radius: 6px;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">
          ⚠️ TEST EMAIL - This is a test email from Blunari Settings Management
        </p>
        <p style="margin: 4px 0 0 0; color: #92400e; font-size: 14px;">
          Template ID: ${templateId || 'custom'} | Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `;

    const finalHtmlContent = testBanner + processedHtmlContent;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'Blunari Test <test@blunari.com>',
      to: [recipientEmail],
      subject: `[TEST] ${processedSubject}`,
      html: finalHtmlContent,
      text: processedTextContent ? `[TEST EMAIL]\n\n${processedTextContent}` : undefined,
    });

    console.log('Test email sent successfully:', emailResponse);

    // Log the test email activity
    await logTestEmailActivity(templateId, recipientEmail, emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        emailId: emailResponse.data?.id,
        recipient: recipientEmail
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send test email',
        details: error.details || null
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function logTestEmailActivity(templateId?: string, recipient?: string, emailId?: string) {
  const logEntry = {
    templateId: templateId || 'custom',
    recipient,
    emailId,
    sentAt: new Date().toISOString(),
    type: 'test_email'
  };
  
  console.log('Test email activity logged:', logEntry);
  
  // In a real implementation, you would insert this into an email activity log table
  return logEntry;
}

serve(handler);