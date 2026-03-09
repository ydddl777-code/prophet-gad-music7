import React, { useState } from 'react';
import { usePlayer } from './PlayerContext';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Music, Loader2 } from 'lucide-react';

function formatTime(secs) {
  if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const player = usePlayer();
  const [showVolume, setShowVolume] = useState(false);

  if (!player?.currentTrack) return null;

  const {
    currentTrack, isPlaying, isLoading, currentTime, duration,
    volume, currentIndex, queueLength,
    togglePlayPause, next, previous, seek, setVolume,
  } = player;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl">
      {/* Clickable Progress Bar */}
      <div
        className="h-1 bg-slate-200 cursor-pointer group hover:h-1.5 transition-all duration-150"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-purple-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="font-semibold text-sm truncate text-slate-900">{currentTrack.title}</p>
            <p className="text-xs text-slate-500 truncate">{currentTrack.artist || 'Unknown Artist'}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            disabled={currentIndex <= 0}
            className="h-9 w-9 disabled:opacity-30"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={togglePlayPause}
            size="icon"
            className="h-11 w-11 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-md"
          >
            {isLoading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : isPlaying
                ? <Pause className="w-5 h-5" />
                : <Play className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={currentIndex >= queueLength - 1}
            className="h-9 w-9 disabled:opacity-30"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Time Display */}
        <span className="text-xs text-slate-400 font-mono hidden md:block whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Volume Control */}
        <div className="relative hidden sm:flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowVolume(!showVolume)}
          >
            <VolumeIcon className="w-4 h-4" />
          </Button>
          {showVolume && (
            <div className="absolute bottom-14 right-0 bg-white border border-slate-200 rounded-xl p-3 shadow-xl w-36 z-10">
              <p className="text-xs text-slate-500 mb-2 text-center">{Math.round(volume * 100)}%</p>
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
  );
}