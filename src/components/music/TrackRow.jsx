import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, ShoppingCart, ChevronDown, ChevronUp, Pencil, Trash2, FileText, Unlock, Brain, Share2 } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import LyricsExtractor from './LyricsExtractor';
import TrackAnalysis from './TrackAnalysis';
import RelatedTracks from './RelatedTracks';

export default function TrackRow({ track, onUpdate, onDelete, onPlay, isAdmin = false, allTracks = [] }) {
  const player = usePlayer();
  const isCurrentTrack = player?.currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && player?.isPlaying;

  const [showLyricsPanel, setShowLyricsPanel] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLyricsExtractor, setShowLyricsExtractor] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const handlePlay = () => {
    if (isCurrentTrack) {
      player.togglePlayPause();
    } else if (onPlay) {
      onPlay(track);
    } else {
      player?.play(track, [track]);
    }
  };

  const handleBuy = async () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) { alert("Purchase is only available from the published app."); return; }
    setPurchasing(true);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', {
        track_id: track.id,
        track_title: track.title,
        track_artist: track.artist,
        price_cents: Math.round((track.price || 1.99) * 100),
        cover_art_url: track.cover_art_url || null,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch { toast.error("Could not start checkout"); }
    finally { setPurchasing(false); }
  };

  const handleDelete = async () => {
    if (confirm("Delete this track?")) {
      try {
        await base44.entities.MusicTrack.delete(track.id);
        onDelete(track.id);
        toast.success("Track deleted");
      } catch { toast.error("Delete failed"); }
    }
  };

  const toggleFreeListen = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, { is_free_listen: !track.is_free_listen });
      toast.success(track.is_free_listen ? "Removed free listen" : "Marked as free full listen");
      onUpdate();
    } catch { toast.error("Update failed"); }
  };

  const displayArtist = (!track.artist || track.artist.toLowerCase().includes('unknown')) ? 'Prophet Gad' : track.artist;
  const [hovering, setHovering] = useState(false);

  return (
    <>
      {editing && (
        <MetadataEditor
          track={track}
          onSave={(u) => { onUpdate(u); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
      {showLyricsExtractor && (
        <LyricsExtractor
          track={track}
          onClose={() => setShowLyricsExtractor(false)}
          onSave={onUpdate}
        />
      )}
      {showAnalysis && (
        <TrackAnalysis
          track={track}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showRelated && (
        <RelatedTracks
          track={track}
          allTracks={allTracks}
          onClose={() => setShowRelated(false)}
        />
      )}

      <div 
        className={`group border-b border-slate-900 transition-colors ${isCurrentTrack ? 'bg-amber-950/10' : 'hover:bg-slate-900'}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Main Row */}
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Large Cover Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded">
            {track.cover_art_url ? (
              <img src={track.cover_art_url} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#8b0000]" />
            )}
            <button
              onClick={handlePlay}
              className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              {isTrackPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
            </button>
          </div>

          {/* Title + Artist + Description */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg sm:text-xl leading-tight mb-1 ${isCurrentTrack ? 'text-amber-400' : 'text-white'}`}>
              {track.title}
            </h3>
            {displayArtist && (
              <p className="text-sm text-[#c9a84c] mb-1">{displayArtist}</p>
            )}
            {track.description && (
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{track.description}</p>
            )}
          </div>

          {/* Price / Action Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {track.is_free_listen ? (
              <div className="bg-amber-900/60 border border-amber-500/40 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full tracking-wider uppercase">
                Extended Play
              </div>
            ) : (
              <Button 
                onClick={handleBuy} 
                disabled={purchasing}
                className="bg-[#8b0000] hover:bg-[#a00000] text-white font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                ${(track.price || 1.99).toFixed(2)}
              </Button>
            )}

            {/* User controls - visible on hover */}
            {hovering && (
              <div className="flex items-center gap-1 ml-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowAnalysis(true)}
                  className="w-8 h-8 text-purple-400 hover:text-purple-300"
                  title="AI Analysis"
                >
                  <Brain className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowRelated(true)}
                  className="w-8 h-8 text-blue-400 hover:text-blue-300"
                  title="Related Tracks"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                {isAdmin && (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(true)} className="w-8 h-8 text-slate-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleDelete} className="w-8 h-8 text-red-600 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Lyrics Panel */}
        {showLyricsPanel && track.lyrics && (
          <div className="mx-4 mb-3 bg-slate-900/80 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Lyrics</span>
              <button onClick={() => setShowLyricsPanel(false)} className="text-slate-500 hover:text-slate-300 text-xs">
                Hide ↑
              </button>
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
              {track.lyrics}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}