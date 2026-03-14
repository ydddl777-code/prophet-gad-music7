import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userName } = await req.json();

    const welcomeText = `Shalom ${userName}, this is Prophet Gad. 
    
    I am honored that you have chosen to join us in this sacred space. 
    
    The songs you will hear are not mere entertainment - they are oracles, prophecies set to rhythm, warning voices for these last days.
    
    May the Most High bless you as you listen. May these messages pierce your heart and awaken you to the urgency of this hour.
    
    Be faithful. Be watchful. The door of mercy is still open, but time is short.
    
    Walk in the light, beloved. Shalom.`;

    // Generate audio using OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        voice: 'onyx', // Deep, authoritative voice
        input: welcomeText,
        speed: 0.95
      })
    });

    if (!response.ok) {
      throw new Error('TTS generation failed');
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="welcome.mp3"'
      }
    });

  } catch (error) {
    console.error('Welcome audio generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});