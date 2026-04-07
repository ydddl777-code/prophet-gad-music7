import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Admin only' }, { status: 403 });
  }

  // Fetch all tracks (up to 2000)
  const allTracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 2000);

  const isImageRecord = (t) => {
    const url = (t.file_url || '').toLowerCase();
    const title = (t.title || '').toLowerCase();
    // Has no audio file (url is image or empty, or title has image extension)
    const urlIsImage = url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.webp');
    const titleIsImage = title.endsWith('.jpg') || title.endsWith('.jpeg') || title.endsWith('.png') || title.endsWith('.gif') || title.endsWith('.webp');
    const hasNoAudio = !url.endsWith('.mp3') && !url.endsWith('.wav') && !url.endsWith('.m4a') && !url.endsWith('.ogg') && !url.endsWith('.flac') && !url.endsWith('.mp4');
    return urlIsImage || titleIsImage || (hasNoAudio && url !== '');
  };

  const toMark = allTracks.filter(t => isImageRecord(t) && !t.is_dormant);

  await Promise.all(toMark.map(t =>
    base44.asServiceRole.entities.MusicTrack.update(t.id, { is_dormant: true })
  ));

  return Response.json({
    marked_dormant: toMark.length,
    titles: toMark.map(t => t.title),
    message: `${toMark.length} placeholder records marked as dormant and hidden from the library.`
  });
});