import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 200);
  const audioExts = ['.mp3', '.wav', '.mp4', '.aac', '.flac', '.ogg', '.m4a', '.wma'];
  const junk = tracks.filter(t => {
    const url = (t.file_url || '').toLowerCase().split('?')[0];
    return !audioExts.some(ext => url.endsWith(ext));
  });

  for (const t of junk) {
    await base44.asServiceRole.entities.MusicTrack.delete(t.id);
  }

  return Response.json({ deleted_count: junk.length, titles: junk.map(t => t.title) });
});