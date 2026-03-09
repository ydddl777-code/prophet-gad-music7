import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Pencil, Download, Trash2, Star, FileText, Play, Pause } from 'lucide-react';
import { usePlayer } from './PlayerContext';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import LyricsExtractor from './LyricsExtractor';

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
    <Card className={`hover:shadow-lg transition-shadow ${track.is_best_version ? 'bg-gradient-to-br from-amber-50 to-white border-2 border-amber-400' : 'bg-white'}`}>
     <CardContent className="p-4">
       <div className="flex items-start gap-3">
         <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${track.is_best_version ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
           <Music className="w-6 h-6 text-white" />
         </div>

         <div className="flex-1 min-w-0">
           <div className="flex items-center gap-2">
             <h3 className="font-semibold text-lg truncate">{track.title}</h3>
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
            <p className="text-sm text-slate-600 truncate">{track.artist || "Unknown Artist"}</p>
            <p className="text-xs text-slate-500 truncate">{track.album || "Unknown Album"}</p>
            
            <div className="flex gap-2 mt-2 flex-wrap">
              {track.version_group && (
                <Badge variant="outline" className="bg-slate-100 text-slate-700">
                  v: {track.version_group}
                </Badge>
              )}
              {track.genre && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {track.genre}
                </Badge>
              )}
              {track.year && (
                <Badge variant="outline">{track.year}</Badge>
              )}
              {track.tags && track.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700">
                  {tag}
                </Badge>
              ))}
              {track.tags && track.tags.length > 2 && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  +{track.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant={isCurrentTrack ? "default" : "ghost"}
              onClick={handlePlay}
              className={isCurrentTrack ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
              title={isTrackPlaying ? "Pause" : "Play"}
            >
              {isTrackPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
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