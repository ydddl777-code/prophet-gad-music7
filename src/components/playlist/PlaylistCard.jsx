import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Trash2, Eye } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function PlaylistCard({ playlist, trackCount, onView, onDelete }) {
  const handleDelete = async () => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      try {
        await base44.entities.Playlist.delete(playlist.id);
        onDelete(playlist.id);
        toast.success("Playlist deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all cursor-pointer"
      style={{ borderTop: `4px solid ${playlist.cover_color}` }}
    >
      <CardContent className="p-6">
        <div 
          className="w-full h-32 rounded-lg mb-4 flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${playlist.cover_color}, ${playlist.cover_color}dd)` 
          }}
        >
          <Music className="w-12 h-12 text-white opacity-80" />
        </div>
        
        <h3 className="font-bold text-lg mb-1 truncate">{playlist.name}</h3>
        <p className="text-sm text-slate-600 mb-2 line-clamp-2 min-h-[2.5rem]">
          {playlist.description || playlist.theme}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-500">{trackCount} tracks</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
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