import React, { useState, useEffect, useRef } from 'react';
import VideoStrip from './VideoStrip';
import WhoIsGadPanel from './WhoIsGadPanel';
import { BookOpen, Play, Pause, ChevronLeft, ChevronRight, Users } from 'lucide-react';

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
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showWhoIsGad, setShowWhoIsGad] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex(i => (i + 1) % AVATARS.length);
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.4;
    audio.src = FEATURED_TRACKS[0].url;
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      setTrackIndex(prev => {
        const next = (prev + 1) % FEATURED_TRACKS.length;
        audio.src = FEATURED_TRACKS[next].url;
        audio.play().catch(() => {});
        return next;
      });
    });

    // Stop when main player starts
    const onMainPlay = () => { audio.pause(); setIsPlaying(false); };
    window.addEventListener('mainPlayerPlaying', onMainPlay);

    return () => {
      audio.pause();
      audio.src = '';
      window.removeEventListener('mainPlayerPlaying', onMainPlay);
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

  const goToTrack = (idx) => {
    const audio = audioRef.current;
    if (!audio) return;
    setTrackIndex(idx);
    audio.src = FEATURED_TRACKS[idx].url;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
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
            {AVATARS.map((avatar, i) => (
              <img
                key={i}
                src={avatar.url}
                alt={avatar.caption}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${i === avatarIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}

          </div>

            {/* Mini Player — right below portrait */}
            <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-800/40 rounded-full px-3 py-1.5 w-64">
              <button onClick={() => goToTrack((trackIndex - 1 + FEATURED_TRACKS.length) % FEATURED_TRACKS.length)} className="text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handlePlayPause} className="w-7 h-7 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center flex-shrink-0">
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" />}
              </button>
              <button onClick={() => goToTrack((trackIndex + 1) % FEATURED_TRACKS.length)} className="text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="flex-1 text-white text-xs truncate">{FEATURED_TRACKS[trackIndex].title}</p>
              <button
                onClick={toggleMute}
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-bold transition-colors ${isMuted ? 'bg-slate-600 text-slate-300' : 'bg-red-600 text-white'}`}
              >
                {isMuted ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex-1 text-white text-center max-w-2xl">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 bg-red-900/50 border border-red-700/50 rounded-full px-4 py-1.5 text-xs font-semibold text-red-300/90 mb-4">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Prophet Gad comes in the same spirit of the ancient Hebrew Israelite prophets
            </div>

            {/* Bio */}
            <div className="text-slate-300 text-base leading-relaxed mb-6 text-justify">
              <p>
                In the spirit of ancient Hebrew seers, Prophet Gad has emerged as a prophetic voice for this generation. Born in a Caribbean nation rooted in biblical tradition, he was consecrated at age four and sent to the U.S. in secret for protection, where he was raised and educated in New York. Bearing the mantle of the biblical Prophet Gad, his life has mirrored the trials of the prophets of old, marked by exile and miraculous returns. Now, he delivers an urgent and uncompromising message: <strong className="text-red-500">repent or die.</strong>
              </p>
            </div>

            {/* Who Is + E-Books */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setShowWhoIsGad(true)}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-white px-4 py-3 rounded-xl transition-colors text-sm font-semibold"
              >
                <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                Who Is Prophet Gad
              </button>
              <a href="/EbookStore"
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-amber-700/40 text-amber-300 px-4 py-3 rounded-xl transition-colors text-sm font-semibold"
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                E-Books
              </a>
            </div>

            {/* The 4 Apps — always visible */}
            <div className="w-full">
              <p className="text-xs tracking-[0.2em] uppercase text-slate-500 text-center mb-3 font-semibold">The Ecosystem</p>
              <div className="grid grid-cols-2 gap-3">
                <a href="https://prophetgadmusic.com" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/40 rounded-xl px-3 py-3 transition-colors text-center">
                  <span className="text-2xl">🎵</span>
                  <span className="text-amber-300 font-bold text-xs uppercase tracking-wide">Music</span>
                  <span className="text-slate-400 text-[0.6rem] leading-tight">Prophetic Catalog</span>
                </a>
                <a href="https://ferventcounsel.com" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/40 rounded-xl px-3 py-3 transition-colors text-center">
                  <span className="text-2xl">🙏</span>
                  <span className="text-purple-300 font-bold text-xs uppercase tracking-wide">Counsel</span>
                  <span className="text-slate-400 text-[0.6rem] leading-tight">Biblical Guidance</span>
                </a>
                <a href="https://clearsignalapp.ai" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/40 rounded-xl px-3 py-3 transition-colors text-center">
                  <span className="text-2xl">🔍</span>
                  <span className="text-blue-300 font-bold text-xs uppercase tracking-wide">Technology</span>
                  <span className="text-slate-400 text-[0.6rem] leading-tight">Music Discernment</span>
                </a>
                <a href="https://prophetgadspeaks.com" target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 rounded-xl px-3 py-3 transition-colors text-center">
                  <span className="text-2xl">⚔️</span>
                  <span className="text-red-300 font-bold text-xs uppercase tracking-wide">Warfare</span>
                  <span className="text-slate-400 text-[0.6rem] leading-tight">Doctrinal Debate</span>
                </a>
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