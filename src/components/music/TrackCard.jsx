import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Pencil, Download, Trash2, Star, FileText, Play, Pause, ShoppingCart, Unlock } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import LyricsExtractor from './LyricsExtractor';
import BpmMeter from './BpmMeter';

export default function TrackCard({ track, onUpdate, onDelete, onPlay, isAdmin = false }) {
  const player = usePlayer();
  const isCurrentTrack = player?.currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && player?.isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      player.togglePlayPause();
    } else if (onPlay) {
      onPlay(track);
    } else {
      player?.play(track, [track]);
    }
  };

  const [editing, setEditing] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const handleBuy = async () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      alert("Purchase is only available from the published app, not the preview.");
      return;
    }
    setPurchasing(true);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', {
        track_id: track.id,
        track_title: track.title,
        track_artist: track.artist,
        price_cents: Math.round((track.price || 1.99) * 100),
        cover_art_url: track.cover_art_url || null,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error("Could not start checkout");
    } finally {
      setPurchasing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete this track?")) {
      try {
        await base44.entities.MusicTrack.delete(track.id);
        onDelete(track.id);
        toast.success("Track deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const toggleFreeListen = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, { is_free_listen: !track.is_free_listen });
      toast.success(track.is_free_listen ? "Removed free listen" : "Marked as free full listen");
      onUpdate();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const toggleBestVersion = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, { 
        is_best_version: !track.is_best_version 
      });
      toast.success(track.is_best_version ? "Unmarked as best" : "Marked as best version");
      onUpdate();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <>
      {editing && (
        <MetadataEditor
          track={track}
          onSave={(updatedTrack) => {
            onUpdate(updatedTrack);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
      
      {showLyrics && (
        <LyricsExtractor
          track={track}
          onClose={() => setShowLyrics(false)}
          onSave={onUpdate}
        />
      )}
    <Card className={`hover:shadow-lg transition-shadow ${track.is_best_version ? 'bg-gradient-to-br from-amber-900/40 to-slate-800 border-2 border-amber-500' : 'bg-slate-800 border border-slate-700'}`}>
     <CardContent className="p-4">
       <div className="flex items-start gap-3">
         <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${track.is_best_version ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
           {track.cover_art_url
             ? <img src={track.cover_art_url} alt="cover" className="w-full h-full object-cover" />
             : <Music className="w-6 h-6 text-white" />}
         </div>

         <div className="flex-1 min-w-0">
           <div className="flex items-center gap-2">
             <h3 className="font-bold text-xl text-white truncate">{track.title}</h3>
               {track.is_free_listen ? (
                 <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0">
                   FREE
                 </Badge>
               ) : (
                 <Badge className="bg-slate-700 text-slate-300 text-xs shrink-0">
                   PREVIEW
                 </Badge>
               )}
               {track.is_best_version && (
               <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                 <Star className="w-3 h-3 fill-white mr-1" />
                 Best
               </Badge>
             )}
             {track.rating && (
               <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 border-yellow-300 text-yellow-700">
                 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                 {track.rating}/10
               </Badge>
             )}
           </div>
            <p className="text-sm text-slate-400 truncate">{(!track.artist || track.artist.toLowerCase().includes('unknown')) ? 'Prophet Gad' : track.artist}</p>
            {track.album && <p className="text-xs text-slate-500 truncate">{track.album}</p>}
            
            <div className="mt-1.5 mb-1">
              <BpmMeter bpm={track.bpm} rhythmStyle={track.rhythm_style} compact />
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {track.version_group && (
                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                  v: {track.version_group}
                </Badge>
              )}
              {track.genre && (
                <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                  {track.genre}
                </Badge>
              )}
              {track.year && (
                <Badge variant="outline">{track.year}</Badge>
              )}
              {track.tags && track.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-blue-900/40 text-blue-300">
                  {tag}
                </Badge>
              ))}
              {track.tags && track.tags.length > 2 && (
                <Badge variant="secondary" className="bg-slate-700 text-slate-400">
                  +{track.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-1 flex-wrap justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBuy}
              disabled={purchasing}
              className="text-amber-600 border-amber-300 hover:bg-amber-50 font-semibold text-xs px-2"
              title="Purchase & Download"
            >
              {purchasing ? (
                <span className="animate-pulse">...</span>
              ) : (
                <><ShoppingCart className="w-3 h-3 mr-1" />${(track.price || 1.99).toFixed(2)}</>
              )}
            </Button>
            <Button
              size="icon"
              variant={isCurrentTrack ? "default" : "ghost"}
              onClick={handlePlay}
              className={isCurrentTrack ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
              title={isTrackPlaying ? "Pause" : "Play"}
            >
              {isTrackPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            {isAdmin && (
              <Button
                size="icon"
                variant={track.is_free_listen ? "default" : "ghost"}
                onClick={toggleFreeListen}
                className={track.is_free_listen ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                title={track.is_free_listen ? "Remove free listen" : "Mark as free full listen"}
              >
                <Unlock className={`w-4 h-4 ${track.is_free_listen ? 'text-white' : ''}`} />
              </Button>
            )}
            {isAdmin && track.version_group && (
              <Button
                size="icon"
                variant={track.is_best_version ? "default" : "ghost"}
                onClick={toggleBestVersion}
                className={track.is_best_version ? "bg-amber-500 hover:bg-amber-600" : ""}
                title={track.is_best_version ? "Unmark as best" : "Mark as best version"}
              >
                <Star className={`w-4 h-4 ${track.is_best_version ? 'fill-white' : ''}`} />
              </Button>
            )}
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowLyrics(true)}
                title="Extract Lyrics"
              >
                <FileText className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              asChild
            >
              <a href={track.file_url} download>
                <Download className="w-4 h-4" />
              </a>
            </Button>
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}