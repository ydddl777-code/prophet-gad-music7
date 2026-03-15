import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userName } = await req.json();

    const welcomeText = `Welcome, ${userName}. This is Prophet Gad. 
    
    I am truly honored that you have chosen to join us here. 
    
    The songs you are about to hear are not mere entertainment — they are oracles, prophecies set to rhythm, urgent warning voices for these last days.
    
    May God bless you richly as you listen. May these messages reach your heart and awaken you to the importance of this hour.
    
    Be faithful. Be watchful. Stay the course. The door of mercy is still open, but time is short.
    
    Walk in the light. God bless you.`;

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