import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PROJECT_REF = "swsmoebtnnyuqtnidmvn";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const conn = await base44.asServiceRole.connectors.getConnection("supabase");
    const accessToken = conn?.accessToken;

    const keysRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const keys = await keysRes.json();
    const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
    const headers = { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Accept": "application/json" };

    // Check timestamps vary across catalog + check for ANY lyrics
    const [rangeRes, lyricsRes] = await Promise.all([
      fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/songs?select=track_number,title,created_timestamp&limit=10&offset=100&order=track_number.asc`, { headers }),
      fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/songs?select=track_number,title,lyrics_text&lyrics_text=not.is.null&limit=5`, { headers })
    ]);

    const rangeRows = await rangeRes.json();
    const lyricsRows = await lyricsRes.json();

    const decoded = rangeRows.map(r => ({
      track_number: r.track_number,
      title: r.title,
      ts: r.created_timestamp ? new Date(r.created_timestamp).toISOString().split('T')[0] : null,
    }));

    return Response.json({ 
      timestamp_sample: decoded,
      tracks_with_lyrics: Array.isArray(lyricsRows) ? lyricsRows.map(r => ({ track_number: r.track_number, title: r.title, lyrics_preview: r.lyrics_text?.substring(0, 80) })) : lyricsRows
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});