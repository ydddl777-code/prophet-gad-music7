import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TRACK_DESCRIPTIONS = {
  "Cyber Siege at Midnight": "A prophetic alarm over the digital age — the war for the mind is fought in silence, in screens, in the small hours. Midnight is not the end. It is the warning.",
  "The Nail's Tale": "One nail. One wall. One word. The writing was there before anyone stopped to read it. This is the tale of what was written and who refused to see it.",
  "Steady Like a Song": "When the world shifts and doctrine drifts, one thing holds — the word that was established before the foundation. Steady is not slow. Steady is sovereign.",
  "Shelter of the Sea": "The sea does not argue with the storm. It receives it, swallows it, and remains. A meditation on the peace that passes understanding — deep, vast, unmoved.",
  "Serena": "Stillness is not silence. It is the place where the Most High speaks clearest. A prophetic invitation to come away from the noise and hear.",
  "República de Mi Corazón": "The heart has its own nation — its own borders, its own law, its own king. A declaration of where true allegiance lies, beyond geography and politics.",
  "Quiet Shore": "After the fire, after the wind — a still small voice. The quiet shore is not retreat. It is where the prophet goes to receive the next word.",
  "Papye Sa M Pa Sot Enviye": "A Haitian Creole declaration: the papers of this world hold no authority over the called. Identity is not granted by governments. It is sealed before birth.",
  "November Breeze": "The season turns and something lifts. A song of transition — the moment when the weight of summer passes and the air carries the first hint of what is coming.",
  "Moiti Mwen nan Lonbraj Ou": "Half of me lives in your shadow — not in fear, but in refuge. A Creole love song that speaks the language of covenant: to dwell in the shadow of the Almighty.",
  "Love Beyond Borders": "Love that crosses every line drawn by men — nations, tongues, histories. A prophetic declaration that the remnant is gathered from every corner of the earth.",
  "Leve Ayiti": "Rise, Haiti. A prophetic call over a nation that carries an ancient burden and an ancient promise. The rising is not political. It is spiritual.",
  "Island of My Heart": "Every exile carries an island inside — the place of origin, the place of formation, the place the soul returns to in the night. This is that island.",
  "Isla Que Me Acogió": "The island that received me. A song of exile, welcome, and the sovereign hand that directs every footstep — even the ones that feel like wandering.",
  "Hymn of the Wall": "The writing was on the wall in Babylon. It is on the wall again. This hymn is for those with eyes to read it before the kingdom is divided and weighed.",
  "Hymn of the Wall V6": "The sixth rendering of the wall's message — each version a deeper cut, a clearer word. The prophet does not stop until the oracle is complete.",
  "Half My Heart in Your Shadow": "A song of longing that lives in two worlds at once — the human and the holy. To love completely while remaining surrendered is the prophet's most personal warfare.",
  "Fuego en la Noche": "Fire in the night. The pillar that led Israel did not go out when darkness came — it burned brighter. A declaration that the light of truth is most visible in the darkest hour.",
  "Fire in the Year": "Every year carries its fire — its trial, its refining, its burning away of what does not belong. This is a prophetic marker over the year of visitation.",
  "Watchman on Zion's Gate": "The watchman does not sleep. He does not negotiate with the darkness approaching the gate. His one assignment is to see it coming and sound the alarm.",
  "Unchanging God": "In a generation that reshapes truth to fit comfort, one anchor holds — the God who does not change, whose word does not bend, whose covenant does not expire.",
  "Thunder Road Gospel": "The gospel does not travel quietly. It comes like thunder — preceding the rain, announcing what is behind it. This is not a gentle invitation. It is a weather warning.",
  "The Prophet's Call": "Before the prophet speaks publicly, he is called privately. This is that moment — the still, searching call that changes everything and from which there is no return.",
  "The Nail on the Wall": "Not the writing — the nail. The instrument of fastening. What has been nailed to the wall of this generation will not come down until the word is fulfilled.",
  "The Prophet Gad": "A declaration of identity and office. Not a title claimed in ambition — a name received in assignment. David's seer. The recorder of chronicles. Present again.",
  "Roots of Faith": "Faith is not a feeling. It is a root system — invisible, deep, drawing from sources the eye cannot see. The storm proves the root. The root outlasts the storm.",
  "Eternal Father": "There is no beginning to His years and no end to His reign. A prophetic hymn to the Father who was before creation and will remain when all else is dissolved.",
  "Eternal Father Dub": "The dub version carries the same eternal word stripped to its foundation — bass, rhythm, and the name that needs no ornamentation.",
  "Eternal Father Call": "The call back to the Father — not as religion, not as ritual, but as a son returning. The prodigal arc set to Remnant Roots rhythm.",
  "Prophet's Warning": "The prophet does not warn because he enjoys it. He warns because the alternative is silence — and silence in the face of judgment is its own kind of betrayal.",
  "Prophet's Call": "The call goes out again. Every generation receives it. Few answer. This song is for those who hear something in it they cannot explain and cannot ignore.",
  "Prophet's Fire Call": "Fire is the language of purification. The fire call is not destruction — it is the summons to come through the flame and emerge as something the enemy cannot touch.",
  "Prophet's Soil": "The prophet is planted, not performing. Rooted in the ancient paths, drawing from the word, bearing fruit in its season — whether the season is celebrated or not.",
  "No Shadow of Turning": "James 1:17 — no variableness, no shadow of turning. A prophetic declaration over the faithfulness of the Most High in a world that turns with every wind of doctrine.",
  "No Shadow Turning": "The shadow does not follow this God. He is the source of light — unchanging, unwavering, the same in the valley as on the mountain.",
  "Fire Call Dub": "The dub version of the fire call — the word reduced to its elemental pulse. Bass and drum carrying the oracle when words are no longer sufficient.",
  "Fire Call Again": "The call goes out a second time. And a third. The prophet does not tire of calling. The question is not whether he will call — it is whether anyone will answer.",
  "Dancing Without Seasons": "To rejoice without a reason the world can recognize — this is the dance of the remnant. Not tied to circumstance. Not waiting for conditions. Dancing in the face of it.",
  "Dust and Holy Light": "We are dust. We carry holy light. The tension between the earthen vessel and the treasure within — this is the prophetic life, fully seen and fully surrendered.",
  "Dancing in My Arms": "A song of covenant joy — the beloved held, the wanderer returned, the prodigal received. To be held in the arms of the Father is the end of every exile.",
  "Corazón Firme": "Firm heart. A Spanish declaration of resolve — the heart that has decided, that will not be moved by fear, by pressure, or by the shifting of the times.",
  "Dub of Clarity": "When the noise clears and the reverb settles, what remains is clarity. The dub version of the truth — slower, deeper, more deliberate than the original.",
  "Calling the Father": "The oldest prayer. The most honest cry. Before doctrine, before liturgy — a voice calling upward from the dust, certain only that Someone is listening.",
  "We Dance Where Once I Waited": "The place of waiting becomes the place of dancing. What was a threshold becomes a floor. The promise fulfilled is always better than the promise imagined.",
  "Whisper from the Dust": "Isaiah 29:4 — the voice that speaks from the ground, low and close to the earth. The prophetic word that comes not in thunder but in the still, unignorable whisper.",
  "Watchman's Call": "The call of the watchman is not optional. He calls because lives depend on it — because the wall is real, the enemy is real, and the night is not over.",
  "Seven Calls to Fire": "Seven is the number of completion. Seven calls — each one deeper, each one more urgent, each one for a different ear in a different condition of readiness.",
  "Alina": "A name carried like a prayer. A song about the face that stays with you — the one that arrives in a season of exile and changes the coordinates of everything.",
  "Leve 02": "The second rising. The first call was not enough — or it was, and this is the confirmation. Rise again, Haiti. The second call is always louder than the first.",
  "Leve": "Rise. One word. The entire prophetic assignment over a people compressed into a single command. Not a suggestion. Not an encouragement. A decree.",
  "Warmth": "Before the fire, there is warmth. Before the oracle, there is the quiet presence. A song about the gentle approach of the Most High before He speaks.",
  "Swasanndis": "A Creole word for the evening breeze — the hour when the heat breaks and the spirit breathes. A prophetic song for the cooling that comes after the long day of trial.",
  "Etenel": "Eternal — in Creole. The word that requires no translation because every tongue has a version of it. The God who was before the languages is the God who outlasts them all.",
  "Across the Line": "There is a line. Most do not see it until they have already crossed it. This song is the warning placed just before the threshold — while there is still time to turn.",
  "Gad": "The name alone. Before the title, before the office, before the catalog — just the name. A single word that carries the weight of an ancient assignment.",
  "Bright Courage": "Courage that does not hide in the shadows — courage that is visible, that costs something, that others can follow toward the light.",
  "My Peace": "Not the peace the world gives. The peace that stands in the middle of the storm and does not explain itself. Given freely. Received completely.",
  "Father": "Calling the Father - The oldest prayer. The most honest cry. Before doctrine, before liturgy — a voice calling upward from the dust, certain only that Someone is listening.",
  "The Prophet": "The Prophet Gad - A declaration of identity and office. Not a title claimed in ambition — a name received in assignment. David's seer. The recorder of chronicles. Present again."
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin check
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all tracks
    const tracks = await base44.asServiceRole.entities.MusicTrack.list('-created_date', 1000);
    console.log(`Found ${tracks.length} tracks`);

    let updated = 0;
    let skipped = 0;

    // Update each track with matching description
    for (const track of tracks) {
      const description = TRACK_DESCRIPTIONS[track.title];
      
      if (description) {
        await base44.asServiceRole.entities.MusicTrack.update(track.id, { description });
        console.log(`Updated: ${track.title}`);
        updated++;
      } else {
        console.log(`Skipped (no description): ${track.title}`);
        skipped++;
      }
    }

    return Response.json({
      success: true,
      updated,
      skipped,
      total: tracks.length
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});