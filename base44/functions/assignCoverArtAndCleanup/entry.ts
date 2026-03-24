import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Admin only' }, { status: 403 });
  }

  // Get ALL tracks
  const allTracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 500);

  // Separate image records (tiny JPG files, < 50KB) from real music tracks
  const imageRecords = allTracks.filter(t => {
    const url = t.file_url || '';
    const size = t.file_size || 0;
    return (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) && size < 50000;
  });

  const realTracks = allTracks.filter(t => {
    const url = t.file_url || '';
    const size = t.file_size || 0;
    return !((url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) && size < 50000);
  });

  // Collect image URLs from image records
  const imageUrls = imageRecords.map(r => r.file_url).filter(Boolean);

  console.log(`Found ${imageRecords.length} image records, ${realTracks.length} real tracks`);
  console.log(`Available thumbnail URLs: ${imageUrls.length}`);

  if (imageUrls.length === 0) {
    return Response.json({ error: 'No image URLs found in image records' }, { status: 400 });
  }

  // Assign cover art to real tracks missing it
  const tracksNeedingCover = realTracks.filter(t => !t.cover_art_url);
  console.log(`Tracks needing cover art: ${tracksNeedingCover.length}`);

  let assignedCount = 0;
  for (let i = 0; i < tracksNeedingCover.length; i++) {
    const track = tracksNeedingCover[i];
    const imageUrl = imageUrls[i % imageUrls.length]; // rotate through images
    await base44.asServiceRole.entities.MusicTrack.update(track.id, { cover_art_url: imageUrl });
    assignedCount++;
  }

  // Delete all image records
  let deletedCount = 0;
  for (const imgRecord of imageRecords) {
    await base44.asServiceRole.entities.MusicTrack.delete(imgRecord.id);
    deletedCount++;
  }

  return Response.json({
    success: true,
    assigned: assignedCount,
    deleted: deletedCount,
    real_tracks_total: realTracks.length
  });
});