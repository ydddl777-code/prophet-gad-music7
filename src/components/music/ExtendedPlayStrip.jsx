import React, { useEffect, useState } from 'react';
import { Play, Pause, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { usePlayer } from './PlayerContext';

export default function ExtendedPlayStrip() {
  const [tracks, setTracks] = useState([]);
  const player = usePlayer();

  useEffect(() => {
    base44.entities.MusicTrack.filter({ is_free_listen: true }, 'sort_order', 20)
      .then(data => {
        const sorted = [...data].sort((a, b) => {
          const aOrder = a.sort_order ?? 999;
          const bOrder = b.sort_order ?? 999;
          return aOrder - bOrder;
        });
        setTracks(sorted);
      })
      .catch(() => {});
  }, []);

  if (tracks.length === 0) return null;

  const handlePlay = (track) => {
    if (player.currentTrack?.id === track.id) {
      player.togglePlayPause();
    } else {
      player.play(track, tracks);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 to-[#0a0a0a] border-y border-amber-500/20 py-8 px-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 mb-1">
          <div className="h-px w-12 bg-amber-500/40" />
          <span className="text-[0.6rem] tracking-[0.35em] uppercase text-amber-500/70 font-semibold">New Releases</span>
          <div className="h-px w-12 bg-amber-500/40" />
        </div>
        <h2 className="text-xl font-black tracking-wider text-white">Extended Play</h2>
      </div>

      {/* Horizontal Scrollable Track Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-7xl mx-auto">
        {tracks.map((track) => {
          const isActive = player.currentTrack?.id === track.id;
          const isPlaying = isActive && player.isPlaying;
          const isVideo = track.file_url?.endsWith('.mp4');

          return (
            <div key={track.id} className="flex-shrink-0 w-20 flex flex-col items-center gap-2 group">
              {/* Cover Art / Video */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-amber-500/20 shadow-lg">
                {isVideo ? (
                  <video
                    src={track.file_url}
                    className="w-full h-full object-cover"
                    autoPlay={isActive}
                    muted
                    loop
                    playsInline
                  />
                ) : track.cover_art_url ? (
                  <img src={track.cover_art_url} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-950 to-amber-950 flex items-center justify-center">
                    <span className="text-4xl">🎵</span>
                  </div>
                )}

                {/* Play Button Overlay — subtle always, clear on hover/active */}
                <button
                  onClick={() => handlePlay(track)}
                  className={`absolute inset-0 flex items-center justify-center transition-all ${
                    isActive ? 'bg-black/30' : 'bg-black/0 hover:bg-black/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive && isPlaying
                      ? 'bg-amber-500/50 opacity-80 hover:opacity-100 hover:bg-amber-500/80'
                      : isActive
                      ? 'bg-white/20 opacity-70 hover:opacity-100 hover:bg-white/40'
                      : 'bg-white/15 opacity-30 hover:opacity-90 hover:bg-black/50'
                  }`}>
                    {isPlaying
                      ? <Pause className="w-4 h-4 text-white" />
                      : <Play className="w-4 h-4 text-white ml-0.5" />}
                  </div>
                </button>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-0.5 bg-amber-400 rounded-full ${isPlaying ? 'animate-bounce' : ''}`}
                        style={{ height: '8px', animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="text-center w-full px-1">
                <p className={`text-xs font-semibold leading-tight line-clamp-2 ${isActive ? 'text-amber-400' : 'text-white'}`}>
                  {track.title}
                </p>
                <p className="text-[0.6rem] text-slate-500 mt-0.5 truncate">Prophet Gad</p>
              </div>

              {/* Buy Button */}
              <button
                onClick={async () => {
                  if (window.self !== window.top) { alert('Purchase is only available from the published app.'); return; }
                  try {
                    const { base44: b } = await import('@/api/base44Client');
                    const res = await b.functions.invoke('createSquareCheckout', {
                      track_id: track.id,
                      track_title: track.title,
                      track_artist: track.artist,
                      price_cents: Math.round((track.price || 1.99) * 100),
                      cover_art_url: track.cover_art_url || null,
                    });
                    if (res.data?.url) window.location.href = res.data.url;
                  } catch (e) { alert('Purchase failed'); }
                }}
                className="flex items-center gap-1 text-[0.5rem] tracking-[0.15em] uppercase bg-red-900/70 hover:bg-red-800 border border-red-700/50 text-red-300 px-2 py-0.5 rounded-full transition-colors"
              >
                <ShoppingCart className="w-2.5 h-2.5" />
                Buy Full Song
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}