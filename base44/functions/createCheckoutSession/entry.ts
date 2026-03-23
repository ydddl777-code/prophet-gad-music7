import Stripe from 'npm:stripe@14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { track_id, track_title, track_artist, price_cents, cover_art_url } = await req.json();

    const origin = req.headers.get('origin') || 'https://app.base44.com';

    const productData = {
      name: track_title || 'Music Track',
      description: `By ${track_artist || 'Prophet Gad'} · Thread Bear Music · Remnant Seed LLC`,
    };
    if (cover_art_url) {
      productData.images = [cover_art_url];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: price_cents || 199,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/PurchaseSuccess?session_id={CHECKOUT_SESSION_ID}&track_id=${encodeURIComponent(track_id)}&title=${encodeURIComponent(track_title || 'Track')}`,
      cancel_url: `${origin}/MusicLibrary`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        track_id,
      }
    });

    console.log(`Checkout session created for track "${track_title}" (id: ${track_id}), session: ${session.id}`);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});