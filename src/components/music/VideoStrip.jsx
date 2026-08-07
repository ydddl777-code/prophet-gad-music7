import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Global registry so any playing video can stop the others
const playingVideos = new Set();

function VideoPlayer({ track }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const stopSelf = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) { v.pause(); }
    setPlaying(false);
  }, []);

  useEffect(() => {
    playingVideos.add(stopSelf);
    return () => playingVideos.delete(stopSelf);
  }, [stopSelf]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      // Stop all other videos first
      playingVideos.forEach(stop => stop !== stopSelf && stop());
      v.play();
      setPlaying(true);
    }
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
        className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-lg cursor-pointer bg-black"
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
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          playing ? 'opacity-0 group-hover:opacity-70' : 'opacity-40 group-hover:opacity-90'
        } bg-black/20`}>
          <div className="w-12 h-12 rounded-full bg-black/40 border border-white/30 flex items-center justify-center shadow-lg">
            {playing
              ? <Pause className="w-6 h-6 text-white" />
              : <Play className="w-6 h-6 text-white ml-0.5" />}
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
        <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-1">{track.title}</p>
        <p className="text-[0.6rem] text-slate-600 mt-0.5">Prophet Gad · Full Video</p>
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
    <div className="bg-white border-y border-slate-200 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="h-px w-16 bg-[#7a1f30]/40" />
            <span className="text-[0.6rem] tracking-[0.35em] uppercase font-semibold" style={{color: '#7a1f30'}}>Exclusive</span>
            <div className="h-px w-16 bg-[#7a1f30]/40" />
          </div>
          <h2 className="text-2xl font-black tracking-wider" style={{color: '#7a1f30'}}>Extended Play — Full Screen Music Videos</h2>
          <p className="text-xs text-slate-600 tracking-widest uppercase mt-1">With Lyrics &mdash; Prophetic Messages in Full Cinematic View</p>
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