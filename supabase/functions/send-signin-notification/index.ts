import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignInNotificationRequest {
  email: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName, ipAddress, userAgent, timestamp }: SignInNotificationRequest = await req.json();

    console.log("Sending sign-in notification to:", email);

    const currentTime = timestamp || new Date().toLocaleString();
    const displayName = userName || email.split('@')[0];

    const emailResponse = await resend.emails.send({
      from: "SoilSidekick Pro <onboarding@resend.dev>",
      to: [email],
      subject: "Successful Sign-In to SoilSidekick Pro",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4a9d5f, #5eb36e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .info-box { background: #f8f9fa; border-left: 4px solid #4a9d5f; padding: 15px; margin: 20px 0; }
              .security-notice { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { display: inline-block; background: #4a9d5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
              .detail { margin: 8px 0; }
              .label { font-weight: bold; color: #555; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌱 SoilSidekick Pro</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Successful Sign-In Notification</p>
              </div>
              <div class="content">
                <h2 style="color: #4a9d5f;">Hello ${displayName}!</h2>
                <p>We wanted to let you know that your account was successfully accessed.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #4a9d5f;">Sign-In Details</h3>
                  <div class="detail"><span class="label">Time:</span> ${currentTime}</div>
                  ${ipAddress ? `<div class="detail"><span class="label">IP Address:</span> ${ipAddress}</div>` : ''}
                  ${userAgent ? `<div class="detail"><span class="label">Device:</span> ${userAgent}</div>` : ''}
                </div>

                <div class="security-notice">
                  <strong>⚠️ Security Notice</strong>
                  <p style="margin: 10px 0 0 0;">If you did not perform this sign-in, please secure your account immediately by changing your password and contacting our support team.</p>
                </div>

                <p>Thank you for using SoilSidekick Pro to optimize your agricultural practices!</p>

                <center>
                  <a href="${Deno.env.get('SUPABASE_URL') || 'https://app.soilsidekickpro.com'}/dashboard" class="button">
                    Go to Dashboard
                  </a>
                </center>
              </div>
              <div class="footer">
                <p>This is an automated security notification from SoilSidekick Pro</p>
                <p>Patent Pending/Provisional #63/861,944 & Patent Pending/Non-Provisional #19/320,727</p>
                <p>If you have questions, contact us at support@soilsidekickpro.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Sign-in notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signin-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
