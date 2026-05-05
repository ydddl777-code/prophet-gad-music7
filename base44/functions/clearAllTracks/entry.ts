import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch one page and delete them — call repeatedly until empty
  const tracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 50);
  let deleted = 0;

  for (const track of tracks) {
    try {
      await base44.asServiceRole.entities.MusicTrack.delete(track.id);
      deleted++;
    } catch (e) {
      // skip already-deleted records
    }
  }

  return Response.json({ deleted, remaining: tracks.length - deleted });
});