import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { userName } = await req.json();

    const welcomeText = `Welcome, ${userName || 'beloved'}. This is Prophet Gad. The songs you are about to hear are not entertainment — they are prophecy. The door of mercy is still open, but time is short. God bless you.`;

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
      console.error('ElevenLabs error status:', response.status, 'body:', err);
      return Response.json({ error: 'TTS generation failed', status: response.status, details: err }, { status: 500 });
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