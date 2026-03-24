import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Admin only' }, { status: 403 });
  }

  // Fetch all tracks
  const allTracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 500);

  // Image-only placeholder records: file_url is an image and file_size < 50KB
  const isImageRecord = (t) => {
    const url = t.file_url || '';
    const size = t.file_size || 0;
    return (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) && size < 50000;
  };

  const toMark = allTracks.filter(t => isImageRecord(t) && !t.is_dormant);

  await Promise.all(toMark.map(t =>
    base44.asServiceRole.entities.MusicTrack.update(t.id, { is_dormant: true })
  ));

  return Response.json({
    marked_dormant: toMark.length,
    message: `${toMark.length} placeholder records marked as dormant and hidden from the library.`
  });
});