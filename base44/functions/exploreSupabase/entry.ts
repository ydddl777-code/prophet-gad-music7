import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PROJECT_REF = "swsmoebtnnyuqtnidmvn";
const BASE_URL = `https://${PROJECT_REF}.supabase.co/storage/v1`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const conn = await base44.asServiceRole.connectors.getConnection("supabase");
    const accessToken = conn?.accessToken;

    const keysRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const keys = await keysRes.json();
    const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
    const storageHeaders = { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" };
    const restHeaders = { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Accept": "application/json" };

    // Count total files in songs bucket by paginating
    let allSongs = [];
    let offset = 0;
    const pageSize = 100;
    while (true) {
      const res = await fetch(`${BASE_URL}/object/list/songs`, {
        method: "POST", headers: storageHeaders,
        body: JSON.stringify({ limit: pageSize, offset, prefix: "", sortBy: { column: "name", order: "asc" } })
      });
      const page = await res.json();
      if (!Array.isArray(page) || page.length === 0) break;
      allSongs = allSongs.concat(page.map(f => f.name));
      if (page.length < pageSize) break;
      offset += pageSize;
    }

    // Check if there are any DB tables with song metadata
    const tablesRes = await fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/`, {
      headers: restHeaders
    });
    const tablesText = await tablesRes.text();

    // Try to query a 'songs' or 'tracks' table
    const tracksRes = await fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/songs?limit=3`, {
      headers: restHeaders
    });
    const tracksData = await tracksRes.json();

    return Response.json({
      total_songs: allSongs.length,
      first_10: allSongs.slice(0, 10),
      last_10: allSongs.slice(-10),
      db_tables_hint: tablesText.slice(0, 500),
      tracks_table_sample: tracksData
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});