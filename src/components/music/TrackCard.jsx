import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Music, Pencil, Save, X, Download, Trash2 } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function TrackCard({ track, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(track);

  const handleSave = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, editData);
      onUpdate(editData);
      setEditing(false);
      toast.success("Track updated");
    } catch (error) {
      toast.error("Update failed");
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

  if (editing) {
    return (
      <Card className="bg-white border-blue-300 border-2">
        <CardContent className="p-4 space-y-3">
          <Input
            value={editData.title || ''}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            placeholder="Title"
            className="font-semibold"
          />
          <Input
            value={editData.artist || ''}
            onChange={(e) => setEditData({...editData, artist: e.target.value})}
            placeholder="Artist"
          />
          <Input
            value={editData.album || ''}
            onChange={(e) => setEditData({...editData, album: e.target.value})}
            placeholder="Album"
          />
          <div className="flex gap-2">
            <Input
              value={editData.genre || ''}
              onChange={(e) => setEditData({...editData, genre: e.target.value})}
              placeholder="Genre"
              className="flex-1"
            />
            <Input
              type="number"
              value={editData.year || ''}
              onChange={(e) => setEditData({...editData, year: parseInt(e.target.value)})}
              placeholder="Year"
              className="w-24"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button onClick={() => setEditing(false)} size="sm" variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{track.title}</h3>
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
  );
}