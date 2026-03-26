const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
const SQUARE_LOCATION_ID = Deno.env.get("SQUARE_LOCATION_ID");
const SQUARE_API_BASE = "https://connect.squareup.com/v2";

Deno.serve(async (req) => {
  try {
    const { track_id, track_title, track_artist, price_cents, cover_art_url } = await req.json();

    const origin = req.headers.get("origin") || "https://app.base44.com";
    const successUrl = `${origin}/PurchaseSuccess?track_id=${track_id}&source=square`;

    const body = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: [
          {
            name: track_title,
            quantity: "1",
            base_price_money: {
              amount: price_cents,
              currency: "USD"
            },
            note: `Artist: ${track_artist}`
          }
        ],
        metadata: {
          track_id: track_id
        }
      },
      checkout_options: {
        redirect_url: successUrl,
        ask_for_shipping_address: false
      }
    };

    const response = await fetch(`${SQUARE_API_BASE}/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-18"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Square error:", JSON.stringify(data));
      return Response.json({ error: data.errors?.[0]?.detail || "Square checkout failed" }, { status: 500 });
    }

    const checkoutUrl = data.payment_link?.url;
    return Response.json({ url: checkoutUrl });

  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});