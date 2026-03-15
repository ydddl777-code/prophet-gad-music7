import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { userName } = await req.json();

    const welcomeText = `Welcome, ${userName || 'beloved'}. This is Prophet Gad.

I am truly honored that you have chosen to join us here.

The songs you are about to hear are not mere entertainment — they are oracles, prophecies set to rhythm, urgent warning voices for these last days.

May the Most High bless you richly as you listen. May these messages reach your heart and awaken you to the importance of this hour.

Be faithful. Be watchful. Stay the course. The door of mercy is still open, but time is short.

Walk in the light. God bless you.`;

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: welcomeText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return Response.json({ error: 'TTS generation failed', details: err }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      }
    });

  } catch (error) {
    console.error('generateWelcomeAudio error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});