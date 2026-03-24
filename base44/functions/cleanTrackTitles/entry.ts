import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all tracks
    const tracks = await base44.asServiceRole.entities.MusicTrack.list('', 1000);
    
    // Filter tracks with underscores in title
    const tracksToUpdate = tracks.filter(t => t.title && t.title.includes('_'));
    
    // Update each track, removing underscores
    const updated = [];
    for (const track of tracksToUpdate) {
      const cleanTitle = track.title.replace(/_/g, '');
      await base44.asServiceRole.entities.MusicTrack.update(track.id, { title: cleanTitle });
      updated.push({ id: track.id, oldTitle: track.title, newTitle: cleanTitle });
    }

    return Response.json({ 
      message: `Cleaned ${updated.length} track titles`,
      updated 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});