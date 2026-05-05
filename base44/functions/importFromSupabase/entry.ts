import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PROJECT_REF = "swsmoebtnnyuqtnidmvn";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { offset = 0, limit = 50 } = await req.json().catch(() => ({}));

    const conn = await base44.asServiceRole.connectors.getConnection("supabase");
    const accessToken = conn?.accessToken;

    // Get service_role key
    const keysRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const keys = await keysRes.json();
    const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
    const restHeaders = { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Accept": "application/json" };

    // Fetch a page of songs from Supabase
    const songsRes = await fetch(
      `https://${PROJECT_REF}.supabase.co/rest/v1/songs?select=*&order=track_number.asc&limit=${limit}&offset=${offset}`,
      { headers: restHeaders }
    );
    const songs = await songsRes.json();

    if (!Array.isArray(songs)) {
      return Response.json({ error: "Failed to fetch songs", raw: songs }, { status: 500 });
    }

    const created = [];
    const failed = [];
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    for (const song of songs) {
      try {
        // Determine language
        let language = song.language;
        if (!language || language === 'unknown') language = 'English';

        // Determine rhythm_style
        const validStyles = ["Bachata", "Kompa", "Reggae", "Reggaeton", "Gospel", "Salsa", "Merengue", "Pop", "R&B", "Hip-Hop", "Other"];
        let rhythm_style = song.rhythm_style;
        if (!validStyles.includes(rhythm_style)) rhythm_style = null;

        // Format duration as MM:SS
        let duration = null;
        if (song.duration && typeof song.duration === 'number') {
          const mins = Math.floor(song.duration / 60);
          const secs = song.duration % 60;
          duration = `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Use lyrics directly from DB field only (no slow file scanning)
        const lyrics = song.lyrics_text || null;

        // Use cover art directly from DB fields only (no slow file scanning)
        const n = song.track_number;
        const cover_art_url = song.cover_url || song.cover_image_url || null;

        await base44.asServiceRole.entities.MusicTrack.create({
          title: song.title || `Track ${n}`,
          artist: 'Prophet Gad',
          album: song.album || null,
          genre: song.genre || null,
          language,
          rhythm_style,
          year: song.year || 2025,
          duration,
          file_url: song.file_url,
          cover_art_url,
          lyrics,
          description: song.description || null,
          price: song.price && song.price > 0 ? song.price : 2.99,
          is_free_listen: song.is_free_listen || false,
          is_dormant: false,
          track_number: n || null,
          tags: [],
        });

        created.push(song.title || `Track ${n}`);
        await sleep(50);
      } catch (e) {
        failed.push({ title: song.title, error: e.message });
      }
    }

    return Response.json({
      imported: created.length,
      failed: failed.length,
      failures: failed,
      offset,
      next_offset: offset + songs.length,
      total_in_page: songs.length
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});