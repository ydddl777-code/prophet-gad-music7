import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

const FEATURED_TRACKS = [
  {
    title: "Thunder Road Gospel",
    url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/764554286_ThunderRoadGospel7.mp3",
  },
  {
    title: "Nail on the Wall",
    url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/ffafd67b3_NailontheWall.mp3",
  },
  {
    title: "Warning in the Dark",
    url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/80718d646_WarningintheDark.mp3",
  },
  {
    title: "Watchman on Zion's Gate",
    url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/749a77171_WatchmanonZionsGate1.mp3",
  },
];

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  // Init audio
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.3;
    audio.src = FEATURED_TRACKS[0].url;
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      // Auto-advance to next track
      setCurrentIndex(prev => {
        const next = (prev + 1) % FEATURED_TRACKS.length;
        audio.src = FEATURED_TRACKS[next].url;
        audio.play().catch(() => {});
        return next;
      });
    });

    // Auto-start after 3 seconds
    const timer = setTimeout(() => {
      if (!startedRef.current) {
        startedRef.current = true;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.volume = v;
    setVolume(v);
    if (v > 0 && isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const goToTrack = (idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentIndex(idx);
    audio.src = FEATURED_TRACKS[idx].url;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const prev = () => goToTrack((currentIndex - 1 + FEATURED_TRACKS.length) % FEATURED_TRACKS.length);
  const next = () => goToTrack((currentIndex + 1) % FEATURED_TRACKS.length);

  const current = FEATURED_TRACKS[currentIndex];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-b border-amber-900/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {/* Label */}
        <div className="flex-shrink-0 hidden sm:block">
          <span className="text-[0.6rem] font-bold tracking-widest uppercase text-amber-600">🎵 Now Playing</span>
        </div>

        {/* Prev */}
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="w-9 h-9 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center flex-shrink-0 transition-colors shadow-lg"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </button>

        {/* Next */}
        <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0">
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Track title */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{current.title}</p>
          <p className="text-amber-600 text-xs">Prophet Gad · Featured Track</p>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {FEATURED_TRACKS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToTrack(i)}
              className={`rounded-full transition-all ${i === currentIndex ? 'w-4 h-2 bg-amber-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'}`}
            />
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleMute} className="text-slate-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}