import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action || 'assign'; // 'assign' or 'delete'
  const batchSize = 20;
  const skip = body.skip || 0;

  const allTracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 500);

  const isImageRecord = (t) => {
    const url = t.file_url || '';
    const size = t.file_size || 0;
    return (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) && size < 50000;
  };

  const imageRecords = allTracks.filter(isImageRecord);
  const realTracks = allTracks.filter(t => !isImageRecord(t));
  const imageUrls = imageRecords.map(r => r.file_url).filter(Boolean);

  if (action === 'assign') {
    const tracksNeedingCover = realTracks.filter(t => !t.cover_art_url).slice(skip, skip + batchSize);
    await Promise.all(tracksNeedingCover.map((track, i) => {
      const imageUrl = imageUrls[(skip + i) % imageUrls.length];
      return base44.asServiceRole.entities.MusicTrack.update(track.id, { cover_art_url: imageUrl });
    }));
    const remaining = realTracks.filter(t => !t.cover_art_url).length - tracksNeedingCover.length;
    return Response.json({ action: 'assign', processed: tracksNeedingCover.length, remaining_after: Math.max(0, remaining - tracksNeedingCover.length), total_needing: realTracks.filter(t => !t.cover_art_url).length });
  }

  if (action === 'delete') {
    const batch = imageRecords.slice(skip, skip + batchSize);
    await Promise.all(batch.map(r => base44.asServiceRole.entities.MusicTrack.delete(r.id)));
    return Response.json({ action: 'delete', processed: batch.length, remaining: imageRecords.length - skip - batch.length });
  }

  return Response.json({ imageRecords: imageRecords.length, realTracks: realTracks.length, imageUrls: imageUrls.length });
});