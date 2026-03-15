import React, { useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProphetWelcome({ userName, onDismiss }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  // Audio will be enabled once a TTS API key is configured
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