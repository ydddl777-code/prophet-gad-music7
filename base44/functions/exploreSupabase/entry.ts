import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PROJECT_REF = "swsmoebtnnyuqtnidmvn";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const conn = await base44.asServiceRole.connectors.getConnection("supabase");
    const accessToken = conn?.accessToken;

    const keysRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const keys = await keysRes.json();
    const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
    const restHeaders = { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Accept": "application/json" };

    // Try different possible naming patterns for lyrics files
    const testNumbers = [1, 2, 3, 23, 100];
    const patterns = [];
    for (const n of testNumbers) {
      for (const ext of ['.txt', '.pdf', '.TXT']) {
        for (const prefix of ['lyrics_', 'track_', '']) {
          const filename = `${prefix}${n}${ext}`;
          const url = `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/song-lyrics/${filename}`;
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            patterns.push({ filename, status: res.status });
          }
        }
      }
    }

    // If we found a pattern, fetch the content of one
    let sampleContent = null;
    if (patterns.length > 0) {
      const url = `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/song-lyrics/${patterns[0].filename}`;
      const txtRes = await fetch(url);
      if (txtRes.ok) sampleContent = await txtRes.text();
    }

    return Response.json({
      found_patterns: patterns,
      sample_content: sampleContent ? sampleContent.slice(0, 300) : null,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});