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
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAvatar(prev => (prev + 1) % AVATARS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    base44.entities.MusicTrack.filter({ is_free_listen: true }, '-created_date', 1)
      .then(tracks => {
        if (!tracks || tracks.length === 0) return base44.entities.MusicTrack.list('-created_date', 1);
        return tracks;
      })
      .then(tracks => {
        if (!tracks || tracks.length === 0 || !tracks[0].file_url) return;
        const audio = new Audio(tracks[0].file_url);
        audio.volume = 0.12;
        audio.loop = true;
        audioRef.current = audio;
        audio.play().catch(() => {});
      })
      .catch(() => {});
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
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
          <p className="text-2xl sm:text-3xl font-black tracking-wide uppercase text-white leading-tight mb-1">Earth's Last Day Final Warning Message</p>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-red-300/80 font-semibold">The Hour of His Judgment Is Come</p>
        </div>
        <span className="absolute bottom-2 right-4 text-[0.55rem] text-red-400/60 tracking-widest uppercase">— Revelation 14:7</span>
      </div>

      {/* HERO */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #dc2626 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10 flex flex-col items-center gap-8">

          {/* CAROUSEL */}
          <div className="relative w-56 h-72 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-2xl shadow-amber-900/40 shrink-0">
            {AVATARS.map((avatar, i) => (
              <img
                key={i}
                src={avatar.url}
                alt={avatar.caption}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${i === currentAvatar ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-center">
              <p className="text-amber-400 text-[0.55rem] tracking-widest uppercase">{AVATARS[currentAvatar].caption}</p>
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

            <div className="text-slate-300 text-base leading-relaxed mb-5 space-y-3 text-justify">
              <p>
                In the spirit of ancient Hebrew Israelite seers, just as Elijah's mantle fell upon Elisha, a prophetic voice has arisen for this generation: Prophet Gad. Born in a Caribbean nation steeped in biblical heritage, consecrated at age 4, and sent to the United States in secret at age 5 for his protection, Prophet Gad's life has been forged in exile and destiny. Raised in New York City under the care of a Jamaican-born, British-trained nanny and educated at elite preparatory schools and Ivy League institutions, his journey has echoed the trials of the prophets of old.
              </p>
              <p>
                Bearing the mantle of the ancient Prophet Gad, seer in King David's court and Minister of Music in the Temple of the Most High, he embodies a calling ordained before the foundation of the world. Exiled back to his homeland at age 40 due to political intrigue, Prophet Gad's return to the United States through miraculous circumstances marked a new chapter. Now, he teaches and preaches an urgent, uncompromising message, <em className="text-amber-400 not-italic font-semibold">Earth's final warning: Repent or die, for the hour of His judgment has come.</em>
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
              src={AVATARS[currentAvatar].url}
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