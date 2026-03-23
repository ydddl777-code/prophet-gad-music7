import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

import EbookStore from '../../pages/EbookStore';

const AVATARS = [
  {
    url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/1e2633946_smallGadup1.jpg",
    caption: "The Seer — Breastplate of Judgment"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/82e316e3e_ProphetGadinuniformupscale.jpg",
    caption: "The Seer in Full Armor"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/9cab1d068_Superheropoisedinelegantdiningroom.png",
    caption: "A Prophet to the Remnant Seed"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/dde2b0bc7_Prophet_gad_trains_young_prophets_90390a5f07.jpg",
    caption: "Training the Remnant"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ec0f6728a_ProphetGadinblacksuitUpscale.jpg",
    caption: "The Prophet in Modern Times"
  },
];

export default function ProphetHeroBanner() {
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let audio1, audio2;
    base44.entities.MusicTrack.list('-created_date', 2)
      .then(tracks => {
        if (!tracks || tracks.length < 1) return;
        const [t1, t2] = tracks;
        if (!t1?.file_url) return;
        audio1 = new Audio(t1.file_url);
        audio1.volume = 0.12;
        audioRef.current = audio1;
        if (t2?.file_url) {
          audio2 = new Audio(t2.file_url);
          audio2.volume = 0.08;
          audio2.loop = true;
          audio1.addEventListener('ended', () => {
            audioRef.current = audio2;
            audio2.play().catch(() => {});
          });
        } else {
          audio1.loop = true;
        }
        audio1.play().catch(() => {});
      })
      .catch(() => {});
    return () => {
      if (audio1) audio1.pause();
      if (audio2) audio2.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(!muted);
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

          {/* FIXED PORTRAIT */}
          <div className="relative w-56 h-72 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-2xl shadow-amber-900/40 shrink-0">
            <img
              src={AVATARS[4].url}
              alt={AVATARS[4].caption}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-center">
              <p className="text-amber-400 text-[0.55rem] tracking-widest uppercase">{AVATARS[4].caption}</p>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-white text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-700/50 rounded-full px-4 py-1.5 text-xs font-semibold text-red-300/90 mb-4">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Prophet Gad comes in the spirit and likeness of the ancient Israelite prophets
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-3" style={{color: '#D4AF37'}}>
              Prophet Gad
            </h1>

            <div className="text-slate-300 text-base leading-relaxed mb-5 text-justify">
              <p>
                In the spirit of ancient Hebrew seers, Prophet Gad has emerged as a prophetic voice for this generation. Born in a Caribbean nation rooted in biblical tradition, he was consecrated at age four and sent to the U.S. in secret for protection, where he was raised and educated in New York. Bearing the mantle of the biblical Prophet Gad, his life has mirrored the trials of the prophets of old, marked by exile and miraculous returns. Now, he delivers an urgent and uncompromising message: <strong className="text-red-500">repent or die.</strong>
              </p>
            </div>

            {/* Auto-play mute button */}
            <button
              onClick={toggleMute}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors border border-slate-700 hover:border-amber-500/50 rounded-full px-3 py-1"
            >
              <span>{muted ? '🔇' : '🔊'}</span>
              <span>{muted ? 'Unmute background music' : 'Mute background music'}</span>
            </button>
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
            <p className="text-slate-400 text-xs">Ancient Israelite Seer · David's Prophet · Returned</p>
          </div>
        </div>
      </div>

      {/* REMNANT WARNING CATALOG */}
      <EbookStore />
    </div>
  );
}