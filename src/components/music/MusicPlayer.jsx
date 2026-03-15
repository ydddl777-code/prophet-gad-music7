import React, { useState } from 'react';
import { usePlayer } from './PlayerContext';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Music, Loader2, SlidersHorizontal, X } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

function formatTime(secs) {
  if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const EQ_BANDS = [
  { key: 'bass', label: 'Bass', color: '#f59e0b' },
  { key: 'mid', label: 'Mid', color: '#ef4444' },
  { key: 'treble', label: 'Treble', color: '#a78bfa' },
];

export default function MusicPlayer() {
  const player = usePlayer();
  const [showVolume, setShowVolume] = useState(false);
  const [showEQ, setShowEQ] = useState(false);

  if (!player?.currentTrack) return null;

  const {
    currentTrack, isPlaying, isLoading, currentTime, duration,
    volume, currentIndex, queueLength, eqBands, previewEnded,
    togglePlayPause, next, previous, seek, setVolume, setEqBand,
    dismissPreview, analyserRef,
  } = player;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <>
      {/* Preview Ended Popup */}
      {previewEnded && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/60 rounded-2xl p-5 shadow-2xl w-80 text-center">
          <p className="text-amber-400 font-bold text-sm mb-1">🎵 60-Second Preview Complete</p>
          <p className="text-white font-semibold mb-0.5">{currentTrack.title}</p>
          <p className="text-slate-400 text-xs mb-4">Purchase the full oracle to hear the complete prophecy.</p>
          <div className="flex gap-2">
            <button
              onClick={dismissPreview}
              className="flex-1 text-xs text-slate-400 border border-slate-700 rounded-lg py-2 hover:border-slate-500 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                const isInIframe = window.self !== window.top;
                if (isInIframe) { alert("Purchase is only available from the published app."); return; }
                dismissPreview();
              }}
              className="flex-1 text-xs bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-lg py-2 font-semibold hover:from-amber-400 hover:to-red-500 transition-colors"
            >
              ${(currentTrack.price || 1.99).toFixed(2)} — Buy Full Track
            </button>
          </div>
        </div>
      )}

      {/* EQ Panel */}
      {showEQ && (
        <div className="fixed bottom-20 right-4 z-50 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl w-72">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              Equalizer
            </h3>
            <button onClick={() => setShowEQ(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-around gap-3 h-36 mb-4">
            {EQ_BANDS.map(({ key, label, color }) => {
              const val = eqBands[key]; // -15 to +15
              const pct = ((val + 15) / 30) * 100;
              return (
                <div key={key} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-mono" style={{ color }}>{val > 0 ? '+' : ''}{val} dB</span>
                  <div className="relative h-24 flex items-center justify-center w-full">
                    <input
                      type="range"
                      min={-15}
                      max={15}
                      step={1}
                      value={val}
                      onChange={(e) => setEqBand(key, Number(e.target.value))}
                      className="appearance-none w-24 h-2 rounded-full cursor-pointer"
                      style={{
                        writingMode: 'vertical-lr',
                        direction: 'rtl',
                        WebkitAppearance: 'slider-vertical',
                        width: '28px',
                        height: '90px',
                        accentColor: color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Reset */}
          <button
            onClick={() => EQ_BANDS.forEach(b => setEqBand(b.key, 0))}
            className="w-full text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg py-1.5 transition-colors"
          >
            Reset EQ
          </button>
        </div>
      )}

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 shadow-2xl">
        {/* Progress Bar */}
        <div
          className="h-1 bg-slate-800 cursor-pointer group hover:h-1.5 transition-all duration-150"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-red-600 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-amber-400 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="px-4 py-2.5 pb-4 flex items-center gap-3">
          {/* Cover / Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentTrack.cover_art_url ? (
              <img src={currentTrack.cover_art_url} alt="cover" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow ring-1 ring-amber-500/40" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow">
                <Music className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0 hidden sm:block">
              <p className="font-semibold text-sm truncate text-white">{currentTrack.title}</p>
              <p className="text-xs text-slate-400 truncate">{(!currentTrack.artist || currentTrack.artist.toLowerCase().includes('unknown')) ? 'Prophet Gad' : currentTrack.artist}</p>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="hidden md:block">
            <WaveformVisualizer analyserRef={analyserRef} isPlaying={isPlaying} />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <div className="relative flex flex-col items-center">
              <Button variant="ghost" size="icon" onClick={previous} disabled={currentIndex <= 0} className="h-9 w-9 disabled:opacity-30 text-slate-300 hover:text-white hover:bg-slate-800">
                <SkipBack className="w-5 h-5" />
              </Button>
              {!currentTrack.is_free_listen && (
                <span className="absolute -bottom-4 whitespace-nowrap text-[9px] text-amber-400/70 leading-none">
                  replay sample
                </span>
              )}
            </div>

            <Button
              onClick={togglePlayPause}
              size="icon"
              className="h-11 w-11 bg-gradient-to-br from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white rounded-full shadow-md"
            >
              {isLoading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : isPlaying
                  ? <Pause className="w-5 h-5" />
                  : <Play className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={next} disabled={currentIndex >= queueLength - 1} className="h-9 w-9 disabled:opacity-30 text-slate-300 hover:text-white hover:bg-slate-800">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>


          {/* Time */}
          <span className="text-xs text-slate-400 font-mono hidden lg:block whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* EQ Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 hidden sm:flex ${showEQ ? 'text-amber-400' : 'text-slate-400 hover:text-white'} hover:bg-slate-800`}
            onClick={() => { setShowEQ(!showEQ); setShowVolume(false); }}
            title="Equalizer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>

          {/* Volume */}
          <div className="relative hidden sm:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => { setShowVolume(!showVolume); setShowEQ(false); }}
            >
              <VolumeIcon className="w-4 h-4" />
            </Button>
            {showVolume && (
              <div className="absolute bottom-14 right-0 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl w-36 z-10">
                <p className="text-xs text-slate-400 mb-2 text-center">{Math.round(volume * 100)}%</p>
                <Slider
                  value={[volume * 100]}
                  onValueChange={([v]) => setVolume(v / 100)}
                  max={100}
                  step={1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}