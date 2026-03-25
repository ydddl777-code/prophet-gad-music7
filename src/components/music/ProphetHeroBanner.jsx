import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import ExtendedPlayStrip from './ExtendedPlayStrip';

const AVATARS = [
  {
    url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/1e2633946_smallGadup1.jpg",
    caption: "The Seer — Breastplate of Judgment",
    type: "image"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/82e316e3e_ProphetGadinuniformupscale.jpg",
    caption: "The Seer in Full Armor",
    type: "image"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/9cab1d068_Superheropoisedinelegantdiningroom.png",
    caption: "Hebrew Israelite Prophetess Hualdh",
    type: "image"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/dde2b0bc7_Prophet_gad_trains_young_prophets_90390a5f07.jpg",
    caption: "Training the Remnant",
    type: "image"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ec0f6728a_ProphetGadinblacksuitUpscale.jpg",
    caption: "The Prophet in Modern Times",
    type: "image"
  },
];

// Fetch video clips from database and add dynamically
let videoClips = [];

// Function to load videos from database
const loadVideos = async () => {
  try {
    const tracks = await base44.entities.MusicTrack.filter(
      { tags: { $elemMatch: { $eq: "H2" } } },
      'title',
      10
    ).catch(() => []);
    
    // Also search by title pattern
    const allTracks = await base44.entities.MusicTrack.list('title', 1000).catch(() => []);
    const videoTracks = allTracks.filter(t => {
      const title = t.title?.toUpperCase() || '';
      const url = t.file_url?.toLowerCase() || '';
      return (title.match(/^H[2-5]$/i) || title.includes('H2') || title.includes('H3') || title.includes('H4') || title.includes('H5')) &&
             (url.endsWith('.mp4') || url.endsWith('.webm'));
    });
    
    videoClips = videoTracks.map((t, idx) => ({
      url: t.file_url,
      caption: t.title || `Prophecy Video ${idx + 1}`,
      type: 'video'
    }));
  } catch (err) {
    console.log('Video loading skipped');
  }
};

// Call this once during component mount
loadVideos();

export default function ProphetHeroBanner() {
  const [muted, setMuted] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [allMedia, setAllMedia] = useState(AVATARS);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load video clips and combine with images
    const loadMedia = async () => {
      try {
        const allTracks = await base44.entities.MusicTrack.list('title', 1000).catch(() => []);
        const videoTracks = allTracks.filter(t => {
          const title = t.title?.toUpperCase() || '';
          const url = t.file_url?.toLowerCase() || '';
          return (title.match(/^H[2-5]$/i) || title.includes('H2') || title.includes('H3') || title.includes('H4') || title.includes('H5')) &&
                 (url.endsWith('.mp4') || url.endsWith('.webm'));
        });
        
        const newMedia = [
          ...AVATARS,
          ...videoTracks.map(t => ({
            url: t.file_url,
            caption: t.title || 'Prophecy Video',
            type: 'video'
          }))
        ];
        
        setAllMedia(newMedia);
      } catch (err) {
        setAllMedia(AVATARS);
      }
    };
    
    loadMedia();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex(i => (i + 1) % allMedia.length);
    }, 13000);
    return () => clearInterval(interval);
  }, [allMedia.length]);

  // Audio disabled — sorting out audio experience
  // useEffect(() => { ... }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    setMuted(newMuted);
    if (!newMuted && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="mb-10">
      {/* TICKER */}
      <div className="bg-red-900 text-white py-4 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl font-black tracking-wide uppercase text-white leading-tight mb-1">Earth's Last Day Final Warning Message</p>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-red-300/80 font-semibold">The Hour of His Judgment Is Come</p>
        </div>
        <span className="absolute bottom-2 right-4 text-[0.55rem] text-red-400/60 tracking-widest uppercase">— Revelation 14:7</span>
      </div>

      {/* HERO */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #dc2626 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10 flex flex-col items-center gap-8">

          {/* CAROUSEL PORTRAIT */}
          <div className="flex flex-col items-center gap-2">
          <div className="relative w-56 h-72 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-2xl shadow-amber-900/40 shrink-0">
            {allMedia.map((avatar, i) => (
            avatar.type === 'video' ? (
              <video
                key={i}
                src={avatar.url}
                autoPlay
                muted={videoMuted}
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${i === avatarIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ) : (
              <img
                key={i}
                src={avatar.url}
                alt={avatar.caption}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${i === avatarIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            )
          ))}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-center">
              <p className="text-amber-400 text-[0.55rem] tracking-widest uppercase">{allMedia[avatarIndex]?.caption || 'Prophet Gad'}</p>
            </div>
          </div>

          {/* Mute controls right under carousel */}
          <div className="flex gap-2 flex-wrap justify-center mt-1">
            <button
              onClick={toggleMute}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors border border-slate-700 hover:border-amber-500/50 rounded-full px-3 py-1"
            >
              <span>{muted ? '🔇' : '🔊'}</span>
              <span>{muted ? 'Unmute music' : 'Mute music'}</span>
            </button>
            {allMedia[avatarIndex]?.type === 'video' && (
              <button
                onClick={() => setVideoMuted(v => !v)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors border border-slate-700 hover:border-amber-500/50 rounded-full px-3 py-1"
              >
                <span>{videoMuted ? '🔇' : '🔊'}</span>
                <span>{videoMuted ? 'Unmute video' : 'Mute video'}</span>
              </button>
            )}
          </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-white text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-700/50 rounded-full px-4 py-1.5 text-xs font-semibold text-red-300/90 mb-4">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Prophet Gad comes in the same spirit of the ancient Hebrew Israelite prophets
            </div>



            <div className="text-slate-300 text-base leading-relaxed mb-5 text-justify">
              <p>
                In the spirit of ancient Hebrew seers, Prophet Gad has emerged as a prophetic voice for this generation. Born in a Caribbean nation rooted in biblical tradition, he was consecrated at age four and sent to the U.S. in secret for protection, where he was raised and educated in New York. Bearing the mantle of the biblical Prophet Gad, his life has mirrored the trials of the prophets of old, marked by exile and miraculous returns. Now, he delivers an urgent and uncompromising message: <strong className="text-red-500">repent or die.</strong>
              </p>
            </div>

            {/* Auto-play mute button */}
            {/* mute controls moved above */}
          </div>
        </div>
      </div>

      {/* AUTHOR STRIP */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-500/20 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/60 shrink-0 shadow-lg">
            <img
              src={AVATARS[4].url}
              alt="Prophet Gad"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <p className="text-[0.55rem] tracking-[0.3em] uppercase text-amber-500/60 mb-0.5">Author</p>
            <p className="text-white font-bold text-sm">Prophet Gad</p>
          </div>
        </div>
      </div>

      {/* EXTENDED PLAY STRIP */}
      <ExtendedPlayStrip />
    </div>
  );
}