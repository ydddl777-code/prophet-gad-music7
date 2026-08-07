import React, { useState, useEffect, useRef } from 'react';
import VideoStrip from './VideoStrip';
import WhoIsGadPanel from './WhoIsGadPanel';
import { Users } from 'lucide-react';

const FEATURED_TRACKS = [
  { title: "Thunder Road Gospel", url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/764554286_ThunderRoadGospel7.mp3" },
  { title: "Nail on the Wall", url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/ffafd67b3_NailontheWall.mp3" },
  { title: "Warning in the Dark", url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/80718d646_WarningintheDark.mp3" },
  { title: "Watchman on Zion's Gate", url: "https://media.base44.com/files/public/698ae99a8f13115b248081e9/749a77171_WatchmanonZionsGate1.mp3" },
];


const AVATARS = [
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/480b2a7d0_finalgad1ULR.PNG" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4b9e78f19_Gadforulr.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/c6f7e7186_gadlookupULR.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/4befcf44e_Gemini_Generated_Image_kk8rs8kk8rs8kk8r.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/d0c3b4373_SuperstarAAE2.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/5ff6c6017_AAEinatuxedo.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/8cd8c38a4_Gadonanoutreachmissiontotherich1.png" },
  { url: "https://media.base44.com/images/public/698ae99a8f13115b248081e9/f55557252_Screenshot2026-05-05025837.png" },
];



export default function ProphetHeroBanner() {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showWhoIsGad, setShowWhoIsGad] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex(i => (i + 1) % AVATARS.length);
    }, 13000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="mb-10">
      {/* TICKER */}
      <div className="bg-white border-y border-[#7a1f30]/30 py-4 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl font-black tracking-wide uppercase leading-tight mb-1" style={{color: '#a01828'}}>Earth's Last Day Final Warning Message</p>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold" style={{color: '#7a1f30'}}>The Hour of His Judgment Is Come</p>
        </div>
        <span className="absolute bottom-2 right-4 text-[0.55rem] tracking-widest uppercase" style={{color: '#a01828', opacity: 0.7}}>— Revelation 14:7</span>
      </div>

      {/* HERO */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #7a1f30 0%, transparent 50%), radial-gradient(circle at 80% 50%, #a01828 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10 flex flex-col items-center gap-8">

          {/* CAROUSEL PORTRAIT */}
          <div className="relative w-56 h-72 rounded-xl overflow-hidden border-2 border-[#7a1f30]/40 shadow-lg shadow-[#7a1f30]/15 shrink-0">
            {AVATARS.map((avatar, i) => (
              <img
                key={i}
                src={avatar.url}
                alt={avatar.caption}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${i === avatarIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-slate-800 text-center max-w-2xl">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 bg-[#7a1f30]/5 border border-[#7a1f30]/40 rounded-full px-4 py-1.5 text-xs font-semibold mb-4" style={{color: '#7a1f30'}}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#a01828'}} />
              Prophet Gad comes in the same spirit of the ancient Hebrew Israelite prophets
            </div>

            {/* Bio */}
            <div className="text-slate-700 text-base leading-relaxed mb-6 text-justify">
              <p>
                In the spirit of ancient Hebrew seers, Prophet Gad has emerged as a prophetic voice for this generation. Born in a Caribbean nation rooted in biblical tradition, he was consecrated at age four and sent to the U.S. in secret for protection, where he was raised and educated in New York. Bearing the mantle of the biblical Prophet Gad, his life has mirrored the trials of the prophets of old, marked by exile and miraculous returns. Now, he delivers an urgent and uncompromising message: <strong style={{color: '#a01828'}}>repent or die.</strong>
              </p>
            </div>

            {/* Who Is Prophet Gad */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setShowWhoIsGad(true)}
                className="flex items-center gap-2 bg-white hover:bg-[#7a1f30]/10 border border-[#7a1f30] text-[#7a1f30] px-4 py-3 rounded-xl transition-colors text-sm font-semibold"
              >
                <Users className="w-4 h-4 flex-shrink-0" style={{color: '#7a1f30'}} />
                Who Is Prophet Gad
              </button>
            </div>

            {/* The Ecosystem — 5 boxes in one row */}
            <div className="w-full">
              <p className="text-xs tracking-[0.2em] uppercase text-slate-600 text-center mb-3 font-semibold">The Ecosystem</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {[
                  { href: 'https://prophetgad.com', emoji: '👤', label: 'Prophet Gad', sub: 'The Man & Mission', color: 'amber', desc: 'Learn who Prophet Gad is — his calling, his mission, and the message he carries for this generation.' },
                  { href: '/EbookStore', emoji: '📖', label: 'E-Books', sub: 'Written Word', color: 'yellow', desc: 'Prophetic writings, doctrinal studies, and spirit-filled books from Prophet Gad.' },
                  { href: 'https://ferventcounsel.com', emoji: '🙏', label: 'Fervent', sub: 'Biblical Counsel', color: 'purple', desc: 'Bring your troubles and receive biblical guidance and prayer. Worldwide. Anyone. Anytime.' },
                  { href: 'https://pgplaysignal.ai', emoji: '🔍', label: 'PG Play Signal', sub: 'Music Discernment', color: 'blue', desc: 'Analyze any song for spiritual content. Know what you\'re feeding your spirit.' },
                  { href: 'https://pgdd.ai', emoji: '🛡️', label: 'Defense', sub: 'Doctrinal Defense', color: 'red', desc: 'Bible doctrinal defense. Prophet Gad takes on all challengers from the Word of the God of Israel — chapter and verse.' },
                ].map(app => (
                  <div key={app.label} className="relative group/eco">
                    <a
                      href={app.href}
                      target={app.href.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-0.5 bg-white hover:bg-[#7a1f30]/10 border border-[#7a1f30]/40 rounded-lg px-2.5 py-2 transition-colors text-center w-[72px] shadow-sm"
                    >
                      <span className="text-lg">{app.emoji}</span>
                      <span className="font-bold text-[0.55rem] uppercase tracking-wide leading-tight" style={{color: '#7a1f30'}}>{app.label}</span>
                      <span className="text-slate-600 text-[0.5rem] leading-tight">{app.sub}</span>
                    </a>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-white border border-[#7a1f30]/30 rounded-lg p-2.5 text-xs text-slate-700 leading-relaxed shadow-xl opacity-0 group-hover/eco:opacity-100 pointer-events-none transition-opacity z-50 text-left">
                      <p className="font-bold mb-1" style={{color: '#7a1f30'}}>{app.label}</p>
                      <p>{app.desc}</p>
                      <p className="mt-1.5 text-[0.6rem] font-semibold" style={{color: '#7a1f30'}}>Click to visit →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO STRIP */}
      <VideoStrip />

      {/* MODALS */}
      {showWhoIsGad && <WhoIsGadPanel onClose={() => setShowWhoIsGad(false)} />}
    </div>
  );
}