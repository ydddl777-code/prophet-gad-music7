import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    const origin = req.headers.get('origin') || 'https://prophetgad.app';
    
    console.log('Creating e-book checkout session...');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Prophet Gad — The Watchman (E-book)',
              description: 'Comprehensive e-book exploring the prophetic calling, biblical lineage, and end-times message of Prophet Gad',
            },
            unit_amount: 4000, // $40.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/ebook-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        product_type: 'ebook',
        ebook_title: 'Prophet Gad — The Watchman'
      }
    });

    console.log('Checkout session created:', session.id);

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});