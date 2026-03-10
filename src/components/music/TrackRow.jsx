import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Pause, ShoppingCart, ChevronDown, ChevronUp, Pencil, Trash2, FileText, Unlock, Star } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import LyricsExtractor from './LyricsExtractor';

export default function TrackRow({ track, onUpdate, onDelete, onPlay, isAdmin = false }) {
  const player = usePlayer();
  const isCurrentTrack = player?.currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && player?.isPlaying;

  const [showLyricsPanel, setShowLyricsPanel] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLyricsExtractor, setShowLyricsExtractor] = useState(false);
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
  const formattedDate = track.created_date ? new Date(track.created_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '';

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

      <div className={`group border-b border-slate-800 transition-colors ${isCurrentTrack ? 'bg-amber-950/20' : 'hover:bg-slate-800/50'}`}>
        {/* Main Row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Thumbnail */}
          <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden bg-slate-700 flex items-center justify-center relative">
            {track.cover_art_url
              ? <img src={track.cover_art_url} alt="cover" className="w-full h-full object-cover" />
              : <Music className="w-4 h-4 text-slate-400" />}
            <button
              onClick={handlePlay}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              {isTrackPlaying
                ? <Pause className="w-4 h-4 text-white" />
                : <Play className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* Title + Artist */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm truncate ${isCurrentTrack ? 'text-amber-400' : 'text-white'}`}>
                {track.title}
              </span>
              {track.is_free_listen
                ? <Badge className="bg-emerald-700 text-white text-[10px] px-1.5 py-0 h-4 shrink-0">FREE</Badge>
                : <Badge className="bg-slate-700 text-slate-400 text-[10px] px-1.5 py-0 h-4 shrink-0">PREVIEW</Badge>}
              {track.is_best_version && (
                <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 shrink-0">★ Best</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">{displayArtist}{track.album ? ` · ${track.album}` : ''}</p>
          </div>

          {/* Duration + Date */}
          <div className="text-right flex-shrink-0 mr-2 hidden sm:block">
            <p className="text-xs text-slate-300 font-mono">{track.duration || '—'}</p>
            <p className="text-xs text-slate-500">{formattedDate}</p>
          </div>

          {/* Style Badge */}
          {track.rhythm_style && (
            <Badge className="bg-slate-700 text-slate-300 text-[10px] hidden md:inline-flex">
              {track.rhythm_style}
            </Badge>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Play button (always visible) */}
            <Button size="icon" variant={isCurrentTrack ? "default" : "ghost"} onClick={handlePlay}
              className={`w-7 h-7 ${isCurrentTrack ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
              {isTrackPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>

            {/* Buy button */}
            {!track.is_free_listen && (
              <Button size="sm" variant="ghost" onClick={handleBuy} disabled={purchasing}
                className="text-amber-500 hover:text-amber-400 text-xs px-2 h-7">
                {purchasing ? '...' : <><ShoppingCart className="w-3 h-3 mr-1" />${(track.price || 1.99).toFixed(2)}</>}
              </Button>
            )}

            {/* Lyrics toggle */}
            {track.lyrics && (
              <Button size="icon" variant="ghost" onClick={() => setShowLyricsPanel(p => !p)}
                className={`w-7 h-7 ${showLyricsPanel ? 'text-amber-400' : 'text-slate-500'}`}
                title="Show/hide lyrics">
                {showLyricsPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </Button>
            )}

            {/* Admin controls */}
            {isAdmin && (
              <>
                <Button size="icon" variant="ghost"
                  onClick={toggleFreeListen}
                  className={`w-7 h-7 ${track.is_free_listen ? 'text-emerald-400' : 'text-slate-600'}`}
                  title={track.is_free_listen ? "Remove free listen" : "Mark as free"}>
                  <Unlock className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(true)} className="w-7 h-7 text-slate-500">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setShowLyricsExtractor(true)} className="w-7 h-7 text-slate-500">
                  <FileText className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleDelete} className="w-7 h-7 text-red-700 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
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