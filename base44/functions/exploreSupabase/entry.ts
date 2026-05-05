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

    // List song-lyrics bucket files
    const lyricsRes = await fetch(
      `https://${PROJECT_REF}.supabase.co/storage/v1/object/list/song-lyrics?limit=20&offset=0`,
      {
        method: 'POST',
        headers: { ...restHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: "", limit: 20, offset: 0, sortBy: { column: "name", order: "asc" } })
      }
    );
    const lyricsFiles = await lyricsRes.json();

    // Count total lyrics files
    const lyricsTotalRes = await fetch(
      `https://${PROJECT_REF}.supabase.co/storage/v1/object/list/song-lyrics?limit=1000&offset=0`,
      {
        method: 'POST',
        headers: { ...restHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: "", limit: 1000, offset: 0 })
      }
    );
    const lyricsAll = await lyricsTotalRes.json();

    // Fetch a sample lyrics file to see the content
    let sampleLyricsContent = null;
    if (Array.isArray(lyricsFiles) && lyricsFiles.length > 0) {
      const firstName = lyricsFiles[0]?.name;
      if (firstName) {
        const txtRes = await fetch(
          `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/song-lyrics/${firstName}`
        );
        if (txtRes.ok) {
          sampleLyricsContent = await txtRes.text();
        }
      }
    }

    // Also check a few songs table rows for lyrics_url
    const songsWithLyricsRes = await fetch(
      `https://${PROJECT_REF}.supabase.co/rest/v1/songs?select=track_number,title,lyrics_url,lyrics_text&lyrics_url=not.is.null&limit=5`,
      { headers: restHeaders }
    );
    const songsWithLyrics = await songsWithLyricsRes.json();

    return Response.json({
      song_lyrics_bucket_total: Array.isArray(lyricsAll) ? lyricsAll.length : lyricsAll,
      first_20_lyrics_files: Array.isArray(lyricsFiles) ? lyricsFiles.map(f => f.name) : lyricsFiles,
      sample_lyrics_content: sampleLyricsContent ? sampleLyricsContent.slice(0, 500) : null,
      songs_with_lyrics_url: songsWithLyrics,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});