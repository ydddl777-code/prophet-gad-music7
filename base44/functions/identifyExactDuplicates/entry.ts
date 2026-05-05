import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action = 'count' } = await req.json().catch(() => ({}));

    // Get all tracks
    const allTracks = await base44.asServiceRole.entities.MusicTrack.list('created_date', 1000);

    // Find exact duplicates: same title + duration
    const seen = {};
    const duplicates = [];

    for (const track of allTracks) {
      const key = `${track.title}|${track.duration}`;
      if (seen[key]) {
        duplicates.push({
          id: track.id,
          title: track.title,
          duration: track.duration,
          createdDate: track.created_date
        });
      } else {
        seen[key] = track.id;
      }
    }

    // If action is 'delete', delete them
    if (action === 'delete') {
      let deleted = 0;
      for (const dup of duplicates) {
        try {
          await base44.asServiceRole.entities.MusicTrack.delete(dup.id);
          deleted++;
        } catch (e) {
          // Already deleted, skip
        }
      }
      return Response.json({
        action: 'deleted',
        deleted_count: deleted,
        total_before: allTracks.length,
        total_after: allTracks.length - deleted
      });
    }

    // Otherwise just count
    return Response.json({
      action: 'count',
      duplicates_found: duplicates.length,
      total_tracks: allTracks.length,
      total_after_delete: allTracks.length - duplicates.length,
      examples: duplicates.slice(0, 5)
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});