import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { createHmac } from 'node:crypto';

const SQUARE_WEBHOOK_SIGNATURE_KEY = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY");

// Square webhook signature verification
function isValidSquareSignature(body, signatureHeader, webhookUrl, signatureKey) {
  const hmac = createHmac('sha256', signatureKey);
  hmac.update(webhookUrl + body);
  const hash = hmac.digest('base64');
  return hash === signatureHeader;
}

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const signatureHeader = req.headers.get('x-square-hmacsha256-signature') || '';
    const webhookUrl = req.url;

    // Verify Square signature
    if (SQUARE_WEBHOOK_SIGNATURE_KEY) {
      if (!isValidSquareSignature(body, signatureHeader, webhookUrl, SQUARE_WEBHOOK_SIGNATURE_KEY)) {
        console.warn('Invalid Square webhook signature');
        return Response.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    const event = JSON.parse(body);
    console.log('Square webhook event type:', event.type);

    // Only handle completed payments
    if (event.type !== 'payment.completed') {
      return Response.json({ received: true });
    }

    const payment = event.data?.object?.payment;
    if (!payment) return Response.json({ received: true });

    const orderId = payment.order_id;
    const buyerEmail = payment.buyer_email_address;

    if (!orderId) {
      console.warn('No order_id on payment');
      return Response.json({ received: true });
    }

    // Fetch the order to get track_id from metadata
    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const orderRes = await fetch(`https://connect.squareup.com/v2/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18',
      }
    });
    const orderData = await orderRes.json();
    const order = orderData.order;

    const trackId = order?.metadata?.track_id;
    if (!trackId) {
      console.warn('No track_id in order metadata for order:', orderId);
      return Response.json({ received: true });
    }

    // Get the track from the database
    const base44 = createClientFromRequest(req);
    const tracks = await base44.asServiceRole.entities.MusicTrack.filter({ id: trackId }, '-created_date', 1);
    const track = tracks?.[0];

    if (!track?.file_url) {
      console.error('Track not found or no file_url for track_id:', trackId);
      return Response.json({ received: true });
    }

    // Send download email if we have a buyer email
    const email = buyerEmail || order?.fulfillments?.[0]?.shipment_details?.recipient?.email_address;
    if (email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: `Your download: "${track.title}" — Prophet Gad Music`,
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">Prophet Gad Music</h1>
    <p style="color: #888; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 6px 0 0;">Threadbare Music · Remnant Seed LLC</p>
  </div>

  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
    <p style="color: #aaa; font-size: 14px; margin: 0 0 8px;">Your purchase:</p>
    <h2 style="color: #fff; font-size: 20px; margin: 0 0 4px;">${track.title}</h2>
    <p style="color: #D4AF37; font-size: 14px; margin: 0;">${track.artist || 'Prophet Gad'}</p>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <a href="${track.file_url}"
       style="display: inline-block; background: linear-gradient(to right, #D4AF37, #b22222); color: #fff; font-weight: bold; font-size: 16px; padding: 14px 32px; border-radius: 50px; text-decoration: none;">
      ⬇ Download Your Track
    </a>
  </div>

  <p style="color: #555; font-size: 12px; text-align: center;">
    If the button doesn't work, copy this link:<br/>
    <span style="color: #888; word-break: break-all;">${track.file_url}</span>
  </p>

  <p style="color: #333; font-size: 11px; text-align: center; margin-top: 30px; border-top: 1px solid #1a1a1a; padding-top: 16px;">
    Thank you for supporting the ministry. Shalom.
  </p>
</div>
        `.trim()
      });
      console.log(`Download email sent to ${email} for track "${track.title}"`);
    } else {
      console.warn('No buyer email found for order:', orderId);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Square webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});