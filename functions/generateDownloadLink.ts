import Stripe from 'npm:stripe@14.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Verify the Stripe session is actually paid
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      console.warn(`Session ${session_id} is not paid (status: ${session.payment_status})`);
      return Response.json({ error: 'Payment not completed' }, { status: 403 });
    }

    const trackId = session.metadata?.track_id;
    if (!trackId) {
      return Response.json({ error: 'No track associated with this session' }, { status: 400 });
    }

    // Fetch the track to get its file_url
    const base44 = createClientFromRequest(req);
    const tracks = await base44.asServiceRole.entities.MusicTrack.filter({ id: trackId }, '-created_date', 1);
    const track = tracks?.[0];

    if (!track?.file_url) {
      return Response.json({ error: 'Track file not found' }, { status: 404 });
    }

    // The file_url is a base44 public file URL — generate a signed version
    // by calling the CreateFileSignedUrl integration
    let downloadUrl = track.file_url;
    try {
      // Extract the file path from the URL to create a signed URL
      // base44 public file URLs have format: .../files/public/{appId}/{filename}
      // We use the Core integration to sign it
      const signedResult = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
        file_uri: track.file_url,
        expires_in: 3600, // 1 hour
      });
      if (signedResult?.signed_url) {
        downloadUrl = signedResult.signed_url;
      }
    } catch (signErr) {
      console.warn('Could not create signed URL, falling back to direct URL:', signErr.message);
      // Fall back to direct URL — still gated behind Stripe verification
    }

    console.log(`Download link generated for track "${track.title}" (${trackId}), session ${session_id}`);

    return Response.json({
      download_url: downloadUrl,
      track_title: track.title,
      track_artist: track.artist || 'Prophet Gad',
      expires_in: 3600,
    });

  } catch (error) {
    console.error('generateDownloadLink error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});