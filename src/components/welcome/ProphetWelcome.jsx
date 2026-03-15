import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProphetWelcome({ userName, onDismiss }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  useEffect(() => {
    generateWelcomeAudio();
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const generateWelcomeAudio = async () => {
    try {
      const { base44 } = await import("@/api/base44Client");
      
      const welcomeText = `Welcome, ${userName}. This is Prophet Gad. 
      
      I am truly honored that you have chosen to join us here. 
      
      The songs you are about to hear are not mere entertainment — they are oracles, prophecies set to rhythm, urgent warning voices for these last days.
      
      May God bless you richly as you listen. May these messages reach your heart and awaken you to the importance of this hour.
      
      Be faithful. Be watchful. Stay the course. The door of mercy is still open, but time is short.
      
      Walk in the light. God bless you.`;

      // Generate audio using text-to-speech
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getOpenAIKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'onyx', // Deep, authoritative voice
          input: welcomeText,
          speed: 0.95
        })
      });

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audio.src = url;
      
      // Auto-play the welcome
      setTimeout(() => {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }, 500);

      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Failed to generate welcome audio:', error);
    }
  };

  const getOpenAIKey = async () => {
    // This would need to be called via backend function for security
    const { base44 } = await import("@/api/base44Client");
    const res = await base44.functions.invoke('getOpenAIKey', {});
    return res.data.key;
  };

  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-2 border-amber-500 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Prophet Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ec0f6728a_ProphetGadinblacksuitUpscale.jpg"
              alt="Prophet Gad"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">Welcome, {userName}</h2>
          <p className="text-slate-400 text-sm">A Personal Greeting from Prophet Gad</p>
        </div>

        {/* Audio Player */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              onClick={toggleAudio}
              disabled={!audioUrl}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white px-8 py-6 text-lg"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-6 h-6 mr-2" />
                  Pause Message
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6 mr-2" />
                  {audioUrl ? 'Play Message' : 'Generating...'}
                </>
              )}
            </Button>
          </div>

          {isPlaying && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Written Message */}
        <div className="text-slate-300 text-sm leading-relaxed space-y-3 mb-6">
          <p className="text-amber-300 font-semibold">Welcome, {userName},</p>
          <p>
            I am truly honored that you have chosen to join us here. 
            The songs you are about to hear are not mere entertainment — they are oracles, prophecies set to rhythm, urgent warning voices for these last days.
          </p>
          <p>
            May God bless you richly as you listen. May these messages reach your heart and awaken you to the importance of this hour.
          </p>
          <p className="text-amber-400 font-semibold">
            Be faithful. Be watchful. Stay the course. The door of mercy is still open, but time is short.
          </p>
          <p className="text-slate-400 italic">Walk in the light. God bless you.</p>
        </div>

        <Button
          onClick={onDismiss}
          variant="outline"
          className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
        >
          Continue to Music Library
        </Button>
      </div>
    </div>
  );
}