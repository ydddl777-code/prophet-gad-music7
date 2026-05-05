import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all tracks
    const allTracks = await base44.asServiceRole.entities.MusicTrack.list('created_date', 1000);

    // Find duplicates: same title + artist + duration
    const seen = {};
    const duplicates = [];

    for (const track of allTracks) {
      const key = `${track.title}|${track.artist}|${track.duration}`;
      if (seen[key]) {
        // Keep the first, mark others as duplicates
        duplicates.push(track.id);
      } else {
        seen[key] = track.id;
      }
    }

    // Delete duplicates
    let deleted = 0;
    for (const id of duplicates) {
      try {
        await base44.asServiceRole.entities.MusicTrack.delete(id);
        deleted++;
      } catch (e) {
        // Already deleted, skip
      }
    }

    return Response.json({
      deleted_count: deleted,
      duplicates_found: duplicates.length
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});