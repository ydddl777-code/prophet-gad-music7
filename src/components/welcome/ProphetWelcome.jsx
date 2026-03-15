import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Singleton — ensures only one audio fetch ever happens regardless of React strict mode re-mounts
let _audioInstance = null;
let _audioLoaded = false;

function cleanup() {
  if (_audioInstance) {
    _audioInstance.pause();
    _audioInstance.src = '';
    _audioInstance = null;
  }
  _audioLoaded = false;
}

export default function ProphetWelcome({ userName, onDismiss }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioError, setAudioError] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (_audioLoaded) {
      // Already fetched — just sync state
      setIsLoading(false);
      if (_audioInstance && !_audioInstance.paused) setIsPlaying(true);
      return;
    }
    _audioLoaded = true;

    const audio = new Audio();
    _audioInstance = audio;
    audio.onended = () => setIsPlaying(false);

    fetch('/api/apps/698ae99a8f13115b248081e9/functions/generateWelcomeAudio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Id': '698ae99a8f13115b248081e9' },
      body: JSON.stringify({ userName }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Audio fetch failed');
        return res.blob();
      })
      .then(blob => {
        audio.src = URL.createObjectURL(blob);
        setIsLoading(false);
        return audio.play();
      })
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error('Welcome audio error:', err);
        setAudioError(true);
        setIsLoading(false);
        // Auto-dismiss after 8 seconds if audio fails
        setTimeout(() => { cleanup(); onDismiss(); }, 8000);
      });

    return () => {}; // don't cleanup on strict-mode remount
  }, []);

  const toggleAudio = () => {
    if (!_audioInstance) return;
    if (isPlaying) {
      _audioInstance.pause();
      setIsPlaying(false);
    } else {
      _audioInstance.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleDismiss = () => {
    cleanup();
    onDismiss();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-2 border-amber-500 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
        <button onClick={handleDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-white">
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

        {/* Audio Control */}
        {!audioError && (
          <div className="flex items-center justify-center gap-3 mb-5">
            {isLoading ? (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing voice message...
              </div>
            ) : (
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 rounded-full px-5 py-2 text-sm font-semibold transition-all"
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isPlaying ? 'Pause Voice Message' : 'Play Voice Message'}
              </button>
            )}
            {isPlaying && (
              <div className="flex gap-1 items-end h-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{ height: `${10 + i * 3}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
          </div>
        )}

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

        <Button onClick={handleDismiss} variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
          Continue to Music Library
        </Button>
      </div>
    </div>
  );
}