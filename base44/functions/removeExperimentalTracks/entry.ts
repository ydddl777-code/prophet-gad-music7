import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all tracks sorted by creation date
    const allTracks = await base44.asServiceRole.entities.MusicTrack.list('created_date', 1000);

    // Identify short/experimental tracks (before the main import batch)
    // Main import started around 2026-05-05 15:12, so remove anything before 15:00
    const cutoffTime = new Date('2026-05-05T15:00:00Z');
    const toDelete = allTracks.filter(t => {
      const createdDate = new Date(t.created_date);
      return createdDate < cutoffTime;
    });

    // Delete them
    let deleted = 0;
    for (const track of toDelete) {
      try {
        await base44.asServiceRole.entities.MusicTrack.delete(track.id);
        deleted++;
      } catch (e) {
        // Track already deleted or doesn't exist, skip
      }
    }

    return Response.json({
      deleted_count: deleted,
      removed_titles: toDelete.map(t => t.title)
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});