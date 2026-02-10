import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Trash2, Plus, Music, ArrowLeft, Pencil, Check, Shuffle, GripVertical } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function PlaylistDetailView({ playlist, onClose, allTracks }) {
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist.name);

  useEffect(() => {
    loadPlaylistTracks();
  }, [playlist.id]);

  const loadPlaylistTracks = async () => {
    try {
      const playlistTrackRecords = await base44.entities.PlaylistTrack.filter(
        { playlist_id: playlist.id },
        'position'
      );
      
      const trackIds = playlistTrackRecords.map(pt => pt.track_id);
      const tracks = allTracks.filter(t => trackIds.includes(t.id));
      
      setPlaylistTracks(tracks);
    } catch (error) {
      toast.error("Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      const playlistTrackRecord = await base44.entities.PlaylistTrack.filter({
        playlist_id: playlist.id,
        track_id: trackId
      });
      
      if (playlistTrackRecord[0]) {
        await base44.entities.PlaylistTrack.delete(playlistTrackRecord[0].id);
        setPlaylistTracks(prev => prev.filter(t => t.id !== trackId));
        toast.success("Track removed");
      }
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  const handleAddTrack = async (trackId) => {
    try {
      const maxPosition = playlistTracks.length;
      await base44.entities.PlaylistTrack.create({
        playlist_id: playlist.id,
        track_id: trackId,
        position: maxPosition
      });
      
      const newTrack = allTracks.find(t => t.id === trackId);
      setPlaylistTracks(prev => [...prev, newTrack]);
      toast.success("Track added");
    } catch (error) {
      toast.error("Add failed");
    }
  };

  const handleUpdateName = async () => {
    try {
      await base44.entities.Playlist.update(playlist.id, { name: playlistName });
      setEditingName(false);
      toast.success("Playlist updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleShuffle = async () => {
    const shuffled = [...playlistTracks].sort(() => Math.random() - 0.5);
    setPlaylistTracks(shuffled);
    
    // Update positions in database
    try {
      for (let i = 0; i < shuffled.length; i++) {
        const playlistTrackRecord = await base44.entities.PlaylistTrack.filter({
          playlist_id: playlist.id,
          track_id: shuffled[i].id
        });
        if (playlistTrackRecord[0]) {
          await base44.entities.PlaylistTrack.update(playlistTrackRecord[0].id, { position: i });
        }
      }
      toast.success("Playlist shuffled");
    } catch (error) {
      toast.error("Shuffle failed");
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(playlistTracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylistTracks(items);

    // Update positions in database
    try {
      for (let i = 0; i < items.length; i++) {
        const playlistTrackRecord = await base44.entities.PlaylistTrack.filter({
          playlist_id: playlist.id,
          track_id: items[i].id
        });
        if (playlistTrackRecord[0]) {
          await base44.entities.PlaylistTrack.update(playlistTrackRecord[0].id, { position: i });
        }
      }
    } catch (error) {
      toast.error("Reorder failed");
    }
  };

  const availableTracksToAdd = allTracks.filter(
    t => !playlistTracks.find(pt => pt.id === t.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div 
          className="p-8 text-white"
          style={{ 
            background: `linear-gradient(135deg, ${playlist.cover_color}, ${playlist.cover_color}dd)` 
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {playlist.cover_image_url ? (
                <img src={playlist.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <Music className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex gap-2 items-center mb-2">
                  <Input
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-2xl font-bold"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateName}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{playlistName}</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingName(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <p className="text-white/90 mb-2">{playlist.description}</p>
              {playlist.theme && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {playlist.theme}
                </Badge>
              )}
              <div className="flex gap-4 mt-3">
                <p className="text-sm text-white/80">
                  {playlistTracks.length} tracks
                </p>
                {playlist.target_duration && (
                  <p className="text-sm text-white/80">
                    • Target: {playlist.target_duration} min
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Track Section */}
          {availableTracksToAdd.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Track
              </h3>
              <Select onValueChange={handleAddTrack}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track to add..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTracksToAdd.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.title} - {track.artist || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Track List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Tracks</h3>
              {playlistTracks.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShuffle}
                  className="gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle
                </Button>
              )}
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-600">Loading...</div>
            ) : playlistTracks.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                No tracks in this playlist yet. Add some above!
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="playlist-tracks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {playlistTracks.map((track, index) => (
                        <Draggable key={track.id} draggableId={track.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-slate-50 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <CardContent className="p-4 flex items-center gap-4">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-5 h-5 text-slate-400" />
                                </div>
                                <span className="text-sm text-slate-500 font-mono w-6">
                                  {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{track.title}</p>
                                  <p className="text-sm text-slate-600 truncate">
                                    {track.artist || "Unknown Artist"}
                                  </p>
                                </div>
                                {track.genre && (
                                  <Badge variant="secondary" className="hidden md:block">
                                    {track.genre}
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveTrack(track.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}