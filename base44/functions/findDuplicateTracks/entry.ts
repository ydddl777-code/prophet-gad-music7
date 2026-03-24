import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const action = body.action || 'find'; // 'find' | 'resolve'

  const allTracks = await base44.asServiceRole.entities.MusicTrack.list('title', 1000);
  const activeTracks = allTracks.filter(t => !t.is_dormant);

  // Group by normalized title
  const groups = {};
  for (const track of activeTracks) {
    const key = track.title?.trim().toLowerCase();
    if (!key) continue;
    if (!groups[key]) groups[key] = [];
    groups[key].push(track);
  }

  const duplicateGroups = Object.entries(groups)
    .filter(([, tracks]) => tracks.length > 1)
    .map(([title, tracks]) => ({ title, tracks }));

  if (action === 'find') {
    return Response.json({ duplicate_groups: duplicateGroups, total_groups: duplicateGroups.length });
  }

  if (action === 'resolve') {
    // For each group: tracks with same duration → keep one, mark others dormant
    // Tracks with different durations → rename V1, V2, V3...
    const changes = [];

    for (const { tracks } of duplicateGroups) {
      // Group by duration
      const byDuration = {};
      for (const t of tracks) {
        const dur = t.duration || 'unknown';
        if (!byDuration[dur]) byDuration[dur] = [];
        byDuration[dur].push(t);
      }

      const durationKeys = Object.keys(byDuration);

      if (durationKeys.length === 1) {
        // All same duration = true duplicates, keep first, mark rest dormant
        const [keep, ...dupes] = byDuration[durationKeys[0]];
        for (const dupe of dupes) {
          await base44.asServiceRole.entities.MusicTrack.update(dupe.id, { is_dormant: true });
          changes.push({ action: 'marked_dormant', id: dupe.id, title: dupe.title });
        }
      } else {
        // Different durations = different versions, rename them V1, V2...
        let vNum = 1;
        for (const dur of durationKeys) {
          const group = byDuration[dur];
          const [keep, ...extras] = group;
          const newTitle = `${keep.title} V${vNum}`;
          await base44.asServiceRole.entities.MusicTrack.update(keep.id, { title: newTitle });
          changes.push({ action: 'renamed', id: keep.id, old_title: keep.title, new_title: newTitle });
          // Mark true dupes within same duration
          for (const extra of extras) {
            await base44.asServiceRole.entities.MusicTrack.update(extra.id, { is_dormant: true });
            changes.push({ action: 'marked_dormant', id: extra.id, title: extra.title });
          }
          vNum++;
        }
      }
    }

    return Response.json({ resolved: true, changes, total_changes: changes.length });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});