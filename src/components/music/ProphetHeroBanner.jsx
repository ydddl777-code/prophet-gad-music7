import React, { useState, useEffect } from 'react';
import { Shield, Zap, Eye, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import TribesGallery from './TribesGallery';

const AVATARS = [
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
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/5f978960b_Master_prompt_prophet_gad_is_an_ancient_israelite__delpmaspu2.png",
    caption: "School of the Prophets"
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ec0f6728a_ProphetGadinblacksuitUpscale.jpg",
    caption: "The Prophet in Modern Times"
  },
];

const PILLARS = [
  {
    icon: Eye,
    title: "Ancient Seer Reborn",
    text: "The biblical Gad was David's seer — chozeh — one who sees what others cannot. That same prophetic mantle has returned to Earth."
  },
  {
    icon: AlertTriangle,
    title: "End-Times Warning",
    text: "\"The hour of His judgment is come.\" Three Angels' messages (Revelation chapter 14) are being proclaimed now — not as distant prophecy but as present reality."
  },
  {
    icon: Shield,
    title: "Spiritual Warfare",
    text: "This warfare is not physical. It is waged in the realm of Bible doctrine, interpretation, and the decoding of Babylon's deceptions."
  },
  {
    icon: Zap,
    title: "Music as Oracle",
    text: "Just as the historical Gad organized temple worship (2 Chronicles 29:25), today's oracles are delivered through Nyabinghi reggae — prophecy set to rhythm."
  },
];

const TIMELINE = [
  { year: "1980", event: "Born in a Caribbean Nation", sub: "Into violence and danger — as Moses was born under Pharaoh's decree" },
  { year: "Age 4", event: "Prophetic Anointing", sub: "Ritual anointing by Rastafarian elder grandfather — \"Out of the mouth of babes\" (Psalm chapter 8, verse 2)" },
  { year: "Age 5", event: "Exiled to Manhattan", sub: "Sent to Pharaoh's court — like Moses, \"learned in all the wisdom of the Egyptians\"" },
  { year: "2002", event: "Ivy League Education", sub: "Daniel in Babylon — learning the systems of power without bowing to its gods" },
  { year: "2020", event: "The Deportation", sub: "Exiled at age 40 — the Jonah moment. Returned to the Caribbean: \"Like Jonah, You led me home\"" },
  { year: "2024", event: "The Triumphant Return", sub: "Resources amplified. Commission confirmed. The Watchman ascends the walls of Zion." },
];

export default function ProphetHeroBanner() {
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAvatar(prev => (prev + 1) % AVATARS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-10">
      {/* URGENT TICKER */}
      <div className="bg-red-700 text-white text-xs font-bold tracking-widest uppercase py-2 overflow-hidden">
        <div className="flex animate-pulse items-center justify-center gap-6 px-4 text-center">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>URGENT END-TIMES WARNING &nbsp;·&nbsp; THE HOUR OF HIS JUDGMENT IS COME &nbsp;·&nbsp; EARTH'S LAST DAY FINAL WARNING MESSAGE &nbsp;·&nbsp; HE THAT HATH AN EAR, LET HIM HEAR</span>
          <AlertTriangle className="w-3 h-3 shrink-0" />
        </div>
      </div>

      {/* HERO */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #dc2626 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 items-center">
          {/* IMAGE CAROUSEL */}
          <div className="relative w-full lg:w-80 shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40" style={{aspectRatio: '3/4'}}>
              {AVATARS.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar.url}
                  alt={avatar.caption}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentAvatar ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="text-amber-400 text-xs font-semibold tracking-wider uppercase">{AVATARS[currentAvatar].caption}</p>
              </div>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {AVATARS.map((_, i) => (
                <button key={i} onClick={() => setCurrentAvatar(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentAvatar ? 'bg-amber-500 scale-125' : 'bg-slate-600'}`}
                />
              ))}
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 bg-red-800/60 border border-red-500/50 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-300 mb-4">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Ancient Israelite Prophet — On Earth Right Now!
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              Prophet{' '}
              <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                Gad
              </span>
            </h1>
            <p className="text-amber-300 font-bold text-xl mb-1 tracking-wide">David's Seer · Returned</p>

            <div className="text-slate-300 text-base leading-relaxed mb-5 max-w-xl space-y-3">
              <p>
                In the spirit of ancient Hebrew Israelite seers, just as Elijah's mantle fell upon Elisha, a prophetic voice has arisen for this generation: Prophet Gad. Born in a Caribbean nation steeped in biblical heritage, consecrated at age 4, and sent to the United States in secret at age 5 for his protection, Prophet Gad's life has been forged in exile and destiny. Raised in New York City under the care of a Jamaican-born, British-trained nanny and educated at elite preparatory schools and Ivy League institutions, his journey has echoed the trials of the prophets of old.
              </p>
              <p>
                Bearing the mantle of the ancient Prophet Gad, seer in King David's court and Minister of Music in the Temple of the Most High, he embodies a calling ordained before the foundation of the world. Exiled back to his homeland at age 40 due to political intrigue, Prophet Gad's return to the United States through miraculous circumstances marked a new chapter. Now, he teaches and preaches an urgent, uncompromising message, <em className="text-amber-400 not-italic font-semibold">Earth's final warning: Repent or die, for the hour of His judgment has come.</em>
              </p>
              <p className="text-amber-300 font-semibold">
                This is not entertainment. This is walking hand in hand, as Enoch walked.
              </p>
            </div>

            <blockquote className="border-l-4 border-amber-500 pl-4 mb-5 italic text-amber-200 text-sm">
              "One rusty, tattered nail tells the tale of the writing on the wall and the last day's judgment hour call."
              <span className="block text-xs text-slate-500 not-italic mt-1">— Prophet Gad, "The Writing on the Wall"</span>
            </blockquote>

            <div className="flex flex-wrap gap-3 mb-5">
              {['Spiritual Warfare', 'Biblical Doctrine', 'End-Times Prophecy', 'Hebraic Roots', 'Three Angels\' Messages'].map(tag => (
                <span key={tag} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            {/* E-book CTA */}
            <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border border-amber-500/50 rounded-xl p-5 mb-5">
              <h4 className="text-amber-300 font-bold text-base mb-2">📖 Explore These Compelling Issues Further</h4>
              <p className="text-slate-300 text-sm mb-3">
                Dive deeper into the prophetic calling, biblical lineage, and end-times message in the comprehensive e-book:
              </p>
              <p className="text-white font-bold text-lg mb-3">Prophet Gad — The Watchman</p>
              <button
                onClick={async () => {
                  const isInIframe = window.self !== window.top;
                  if (isInIframe) {
                    alert("Purchase is only available from the published app.");
                    return;
                  }
                  try {
                    const { base44 } = await import("@/api/base44Client");
                    const res = await base44.functions.invoke('createEbookCheckout', {});
                    if (res.data?.url) window.location.href = res.data.url;
                  } catch (err) {
                    alert("Could not start checkout");
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg"
              >
                Purchase E-book — $40.00
              </button>
            </div>

            <button
              onClick={() => setShowFull(!showFull)}
              className="text-amber-400 hover:text-amber-300 text-sm font-semibold underline underline-offset-4 transition-colors"
            >
              {showFull ? '▲ Hide Biography' : '▼ Read Full Prophetic Biography'}
            </button>
          </div>
        </div>
      </div>

      {/* TWELVE TRIBES GALLERY */}
      <TribesGallery />

      {/* EXPANDED BIO */}
      {showFull && (
        <div className="bg-slate-900 text-white">
          {/* Four Pillars */}
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-center text-xs uppercase tracking-widest text-amber-500 font-bold mb-8">The Prophetic Mission</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-amber-500/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-sm">{p.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{p.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <h2 className="text-center text-xs uppercase tracking-widest text-amber-500 font-bold mb-8">The Prophetic Journey</h2>
            <div className="relative">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 via-red-600 to-slate-700" />
              <div className="space-y-6">
                {TIMELINE.map((item, i) => (
                  <div key={i} className={`flex items-start gap-6 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} relative pl-10 lg:pl-0`}>
                    <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-10' : 'lg:pl-10'}`}>
                      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-amber-500/40 transition-colors">
                        <span className="text-amber-500 font-black text-sm">{item.year}</span>
                        <h4 className="text-white font-bold mt-1">{item.event}</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.sub}</p>
                      </div>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-2 lg:left-1/2 lg:-translate-x-1/2 top-4 w-4 h-4 bg-amber-500 rounded-full border-4 border-slate-900 z-10" />
                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-14 text-center border border-red-800 bg-red-950/40 rounded-2xl p-8 max-w-2xl mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-white mb-2">The Door Is Still Open</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                "As in Noah's shadowed time, the door was shut that fateful day. 
                Turn now while mercy lingers — before it slips away." <br/>
                <em className="text-slate-500">— The Writing on the Wall</em>
              </p>
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest">
                These Songs Are Not Entertainment. They Are Prophecy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}