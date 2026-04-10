import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function VideoPlayer({ track }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = (e) => {
    e.stopPropagation();
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden border border-amber-500/30 shadow-lg cursor-pointer bg-black"
        onClick={toggle}
      >
        <video
          ref={videoRef}
          src={track.file_url}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setPlaying(false)}
        />

        {/* Play/Pause overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} bg-black/30`}>
          <div className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg">
            {playing
              ? <Pause className="w-7 h-7 text-black" />
              : <Play className="w-7 h-7 text-black ml-0.5" />
            }
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <button onClick={toggleMute} className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
            {muted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
          </button>
          <button onClick={fullscreen} className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      <div className="text-center px-1">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{track.title}</p>
        <p className="text-[0.6rem] text-slate-500 mt-0.5">Prophet Gad · Full Video</p>
      </div>
    </div>
  );
}

export default function VideoStrip() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    base44.entities.MusicTrack.list('-created_date', 200)
      .then(tracks => {
        const mp4s = tracks.filter(t => t.file_url?.toLowerCase().endsWith('.mp4') && !t.is_dormant && (t.file_size || 0) > 50000000);
        setVideos(mp4s);
      })
      .catch(() => {});
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-slate-950 border-y border-amber-500/20 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="h-px w-16 bg-amber-500/40" />
            <span className="text-[0.6rem] tracking-[0.35em] uppercase text-amber-500/70 font-semibold">Exclusive</span>
            <div className="h-px w-16 bg-amber-500/40" />
          </div>
          <h2 className="text-2xl font-black tracking-wider" style={{color: '#D4AF37'}}>Full Screen Music Videos</h2>
          <p className="text-xs text-white/50 tracking-widest uppercase mt-1">With Lyrics &mdash; Prophetic Messages in Full Cinematic View</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(track => (
            <VideoPlayer key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}