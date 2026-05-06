import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Title -> date map extracted from the static HTML catalog
const CATALOG_DATES = {
  "Haitian Queen Night": "2026-04-20",
  "Bedroom Heat": "2026-04-20",
  "Deep Desire": "2026-04-20",
  "Late Night Queen": "2026-04-20",
  "Queen's Rhythm": "2026-04-05",
  "Voodoo Pulse": "2026-04-05",
  "Velvet Command": "2026-04-05",
  "Midnight Spell": "2026-04-05",
  "Voodoo Heat": "2026-04-05",
  "Queen's Command": "2026-04-05",
  "Kompa Bachata Rise": "2026-04-03",
  "Chappadora Groove": "2026-04-03",
  "Two Are Better Than One": "2026-04-03",
  "The Storyteller's Bachata": "2026-04-03",
  "Chappadora's Karma": "2026-04-03",
  "Karma in Bachata": "2026-04-03",
  "Chappadora Mambo": "2026-04-03",
  "Requinto Karma": "2026-04-03",
  "Bachata Kompa Rise": "2026-04-03",
  "Chappadora Victory": "2026-04-03",
  "Requinto & Gouyad": "2026-04-03",
  "Chappadora Beat": "2026-04-03",
  "Three-Stranded Cord": "2026-04-03",
  "Three-Stranded Cord V5": "2026-04-03",
  "Three-Stranded Cord V4": "2026-04-03",
  "Bachata by the Sea": "2026-03-31",
  "Karma en la calle lateral": "2026-03-31",
  "Chappadora, el final feliz": "2026-03-31",
  "Calle Lateral": "2026-03-31",
  "Chappadora y el Karma": "2026-03-31",
  "Bachata de la Calle Lateral": "2026-03-31",
  "Chappadora Karma": "2026-03-31",
  "Bachata Goodbye": "2026-03-31",
  "Break the Vessel": "2026-03-25",
  "The Water I Carried": "2026-03-25",
  "The Poison Tree's Shadow": "2026-03-22",
  "Mercy Stone Anthem": "2026-03-22",
  "Eden to Calvary": "2026-03-22",
  "Truth at Dawn": "2026-03-22",
  "Mercy Stone Rising": "2026-03-22",
  "Mercy Stone and Lies": "2026-03-22",
  "Fruit and Fire": "2026-03-21",
  "Poison Tree Kompa": "2026-03-21",
  "Bitter Fruit Serenade": "2026-03-21",
  "Poison Tree Bachata": "2026-03-21",
  "Haiti Hear This": "2026-03-21",
  "Redeem the Root": "2026-03-21",
  "Poison Tree Mercy": "2026-03-21",
  "Mercy at Dawn": "2026-03-21",
  "Fruit of the Poison Tree": "2026-03-21",
  "Prophet's Stillness": "2026-03-20",
  "Modern Prophetic Groove": "2026-03-20",
  "Mercy's Stone Reverence": "2026-03-20",
  "Mercy's Stone": "2026-03-20",
  "Rising Trust": "2026-03-20",
  "Flesh Fails, Mercy Holds": "2026-03-02",
  "Tanbou Calling": "2026-03-02",
  "Faith in the Storm": "2026-03-02",
  "Drum Call to Faith": "2026-03-02",
  "Bra Lachas Rising": "2026-03-02",
  "Sacred Silence and Drum": "2026-03-02",
  "Prophet's Voice Courtyard": "2026-03-02",
  "Faith in the Drum": "2026-03-02",
  "Steady Reverence": "2026-03-02",
  "Mercy's Steadfast Stone": "2026-03-02",
  "Flesh Fails, Grace Holds": "2026-03-02",
  "Steady Mercy Pulse": "2026-03-02",
  "Flesh Will Fail": "2026-03-02",
  "Steady Kompa, Steady Faith": "2026-03-02",
  "Flesh Fails, Rhythm Holds": "2026-03-02",
  "Steady Drum, Steady Faith": "2026-03-02",
  "Horn and Mercy": "2026-03-02",
  "Trust Not in Flesh": "2026-03-02",
  "The Arm of Flesh Will Fail You": "2026-03-02",
  "Confianza en la Piedra": "2026-03-02",
  "Brazo de Carne, Ritmo Profundo": "2026-03-02",
  "Ritmo de la Carne y la Fe": "2026-03-02",
  "Requinto and Mercy": "2026-03-02",
  "Flesh Fails, Grace Stays": "2026-03-02",
  "Faith in the Trembling Air": "2026-03-02",
  "Prophet's Sacred Silence": "2026-03-02",
  "Prophet's Steady Cry": "2026-03-02",
  "Prophet Gad's Call": "2026-03-02",
  "Steady Faith Groove": "2026-03-02",
  "El Brazo Que Falla": "2026-03-02",
  "Tambora y Fe": "2026-03-02",
  "Broken Heart, Steadfast Sound": "2026-03-02",
  "Prophet Gad's Warm Truth": "2026-03-02",
  "Three-Drum Truth": "2026-03-02",
  "Ceremonial Rise": "2026-03-02",
  "Trust in the Hush": "2026-02-16",
  "Trust in the Stone": "2026-02-16",
  "Heartbeat and Mercy": "2026-02-16",
  "Hushed Faithful Promise": "2026-02-01",
  "Prophet Gad Speaks": "2026-02-01",
  "Mi Confianza Está Solo en Dios": "2026-03-02",
  "El Brazo de Carne Fallará": "2026-03-02",
  "No Confío en Carne": "2026-03-02",
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body.dry_run !== false; // default dry_run = true for safety

    // Fetch all tracks
    const tracks = await base44.asServiceRole.entities.MusicTrack.list('title', 1000);

    let matched = 0;
    let updated = 0;
    let unmatched = [];
    const updates = [];

    for (const track of tracks) {
      const catalogDate = CATALOG_DATES[track.title];
      if (catalogDate) {
        matched++;
        const year = parseInt(catalogDate.split('-')[0]);
        if (!dryRun) {
          await base44.asServiceRole.entities.MusicTrack.update(track.id, {
            composition_date: catalogDate,
            year: year,
            // version_group = composition_date so all songs from the same genesis date form one family
            // Only set if not already manually assigned to a more specific group
            version_group: track.version_group || catalogDate,
          });
          updated++;
        }
        updates.push({ title: track.title, date: catalogDate, year, version_group: track.version_group || catalogDate });
      } else {
        unmatched.push(track.title);
      }
    }

    return Response.json({
      dry_run: dryRun,
      total_tracks: tracks.length,
      matched,
      updated: dryRun ? 0 : updated,
      unmatched_count: unmatched.length,
      unmatched_sample: unmatched.slice(0, 20),
      matched_sample: updates.slice(0, 20),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});