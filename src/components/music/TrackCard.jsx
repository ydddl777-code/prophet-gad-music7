import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Pencil, Download, Trash2, Star, FileText } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import MetadataEditor from './MetadataEditor';
import LyricsExtractor from './LyricsExtractor';

export default function TrackCard({ track, onUpdate, onDelete }) {
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
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">{track.title}</h3>
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
              variant="ghost"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowLyrics(true)}
              title="Extract Lyrics"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              asChild
            >
              <a href={track.file_url} download>
                <Download className="w-4 h-4" />
              </a>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}