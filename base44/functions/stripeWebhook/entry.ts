import Stripe from 'npm:stripe@14.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const trackId = session.metadata?.track_id;
    const customerEmail = session.customer_details?.email;

    if (trackId) {
      try {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.Purchase.create({
          track_id: trackId,
          stripe_session_id: session.id,
          customer_email: customerEmail || 'unknown',
          amount_paid: session.amount_total,
          status: 'completed',
        });
        console.log(`Purchase recorded: track ${trackId}, session ${session.id}, email: ${customerEmail}`);
      } catch (err) {
        console.error('Failed to record purchase:', err.message);
      }
    }
  }

  return Response.json({ received: true });
});