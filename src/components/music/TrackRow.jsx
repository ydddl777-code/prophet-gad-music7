import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, ShoppingCart, Pencil, Trash2, EyeOff, Eye } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import { CommentButton } from './TrackComments';

export default function TrackRow({ track, onUpdate, onDelete, onPlay, isAdmin = false, allTracks = [], selectable = false, selected = false, onSelect }) {
  const player = usePlayer();
  const isCurrentTrack = player?.currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && player?.isPlaying;

  const [showLyricsPanel, setShowLyricsPanel] = useState(false);
  const [editing, setEditing] = useState(false);
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
      const res = await base44.functions.invoke('createSquareCheckout', {
        track_id: track.id,
        track_title: track.title,
        track_artist: track.artist,
        price_cents: 199,
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

  const toggleDormant = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, { is_dormant: !track.is_dormant });
      toast.success(track.is_dormant ? "Track restored to library" : "Track hidden from library");
      onUpdate();
    } catch { toast.error("Update failed"); }
  };

  const displayArtist = 'Prophet Gad';
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


      <div 
        className={`group border-b border-slate-200 transition-colors ${isCurrentTrack ? 'bg-[#7a1f30]/5' : 'hover:bg-slate-50'}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Main Row */}
        <div className="flex items-center gap-4 px-4 py-3">
          {/* Checkbox for multi-select */}
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect(track.id)}
              className="w-4 h-4 accent-red-600 flex-shrink-0 cursor-pointer"
              onClick={e => e.stopPropagation()}
            />
          )}
          {/* Catalog Number */}
          <div className="flex-shrink-0 w-10 text-center hidden sm:block">
            {track.track_number ? (
              <span className="text-xs font-mono font-bold text-slate-600 leading-none">#{track.track_number}</span>
            ) : (
              <span className="text-xs text-slate-800">—</span>
            )}
          </div>
          {/* Large Cover Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded">
            {track.cover_art_url ? (
              <img src={track.cover_art_url} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#7a1f30]" />
            )}
            {/* Always-visible subtle indicator, brighter on hover */}
            <button
              onClick={handlePlay}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200
                ${isCurrentTrack
                  ? 'bg-black/30'
                  : 'bg-black/0 hover:bg-black/40'
                }`}
            >
              <div className={`rounded-full flex items-center justify-center transition-all duration-200
                ${isCurrentTrack && isTrackPlaying
                  ? 'w-9 h-9 bg-amber-500/40 opacity-80 group-hover:opacity-100 group-hover:bg-amber-500/70'
                  : isCurrentTrack
                  ? 'w-9 h-9 bg-white/20 opacity-70 group-hover:opacity-100 group-hover:bg-white/40'
                  : 'w-9 h-9 bg-white/15 opacity-30 group-hover:opacity-90 group-hover:bg-black/50'
                }`}>
                {isTrackPlaying
                  ? <Pause className="w-5 h-5 text-white" />
                  : <Play className="w-5 h-5 text-white ml-0.5" />}
              </div>
            </button>
          </div>

          {/* Title + Artist + Description */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg sm:text-xl leading-tight mb-1 flex items-center gap-2 flex-wrap ${isCurrentTrack ? 'text-[#7a1f30]' : 'text-slate-900'}`}>
              <span>{track.title}</span>
              {track.duration && (
                <span className="text-xs font-mono font-normal bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200" style={{color: '#7a1f30'}}>{track.duration}</span>
              )}
              {track.composition_date && (
                <span className="text-xs font-mono font-normal text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{track.composition_date}</span>
              )}
            </h3>
            {displayArtist && (
              <p className="text-sm mb-1" style={{color: '#7a1f30'}}>{displayArtist}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap mt-1 mb-1">
              {track.language && (
                <span className="text-xs font-medium" style={{color: '#7a1f30'}}>{track.language}</span>
              )}
              {track.rhythm_style && (
                <span className="text-xs text-slate-500">· {track.rhythm_style}</span>
              )}
            </div>
            {track.description && (
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{track.description}</p>
            )}
          </div>

          {/* Comment Button */}
          <CommentButton trackId={track.id} />

          {/* Price / Action Button */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {/* Preview badge */}
            <button
              onClick={handlePlay}
              className="font-bold text-xs px-3 py-1.5 rounded-full tracking-wider uppercase border transition-colors bg-white border-[#7a1f30] text-[#7a1f30] hover:bg-[#7a1f30]/10"
            >
              Preview
            </button>
            {/* Buy button — always shown */}
            <Button 
              onClick={handleBuy} 
              disabled={purchasing}
              className="bg-[#7a1f30] hover:bg-[#6a1828] text-white font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              $1.99
            </Button>

            {/* User controls - visible on hover */}
            {hovering && (
              <div className="flex items-center gap-1 ml-2">
                {isAdmin && (
                <>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(true)} className="w-8 h-8 text-slate-500 hover:text-[#7a1f30]" title="Edit metadata">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={toggleDormant} className="w-8 h-8 text-[#7a1f30] hover:text-[#6a1828]" title={track.is_dormant ? "Restore to library" : "Hide from library"}>
                    {track.is_dormant ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleDelete} className="w-8 h-8 text-[#a01828] hover:text-[#8a1422]" title="Delete permanently">
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
          <div className="mx-4 mb-3 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{color: '#7a1f30'}}>Lyrics</span>
              <button onClick={() => setShowLyricsPanel(false)} className="text-slate-500 hover:text-slate-800 text-xs">
                Hide ↑
              </button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
              {track.lyrics}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}