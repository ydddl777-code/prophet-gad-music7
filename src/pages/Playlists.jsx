import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { ListMusic } from 'lucide-react';
import PlaylistGenerator from '../components/playlist/PlaylistGenerator';
import PlaylistCard from '../components/playlist/PlaylistCard';
import PlaylistDetailView from '../components/playlist/PlaylistDetailView';

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const queryClient = useQueryClient();

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => base44.entities.Playlist.list('-created_date', 1000),
  });

  const { data: tracks = [] } = useQuery({
    queryKey: ['music-tracks'],
    queryFn: () => base44.entities.MusicTrack.list('-created_date', 1000),
  });

  const { data: playlistTracks = [] } = useQuery({
    queryKey: ['playlist-tracks'],
    queryFn: () => base44.entities.PlaylistTrack.list('position', 10000),
  });

  useEffect(() => {
    const unsubscribe = base44.entities.Playlist.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const handleGenerate = async (data) => {
    try {
      const playlist = await base44.entities.Playlist.create({
        name: data.name,
        description: data.description,
        theme: data.theme,
        cover_color: data.cover_color
      });

      const trackRecords = data.track_ids.map((trackId, index) => ({
        playlist_id: playlist.id,
        track_id: trackId,
        position: index
      }));

      await base44.entities.PlaylistTrack.bulkCreate(trackRecords);
      
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-tracks'] });
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const getPlaylistTrackCount = (playlistId) => {
    return playlistTracks.filter(pt => pt.playlist_id === playlistId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <ListMusic className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Playlists</h1>
              <p className="text-slate-600">Create AI-powered playlists from your library</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <PlaylistGenerator tracks={tracks} onGenerate={handleGenerate} />

        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <ListMusic className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No playlists yet. Generate one above!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Your Playlists ({playlists.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  trackCount={getPlaylistTrackCount(playlist.id)}
                  onView={() => setSelectedPlaylist(playlist)}
                  onDelete={() => queryClient.invalidateQueries({ queryKey: ['playlists'] })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPlaylist && (
        <PlaylistDetailView
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
          allTracks={tracks}
        />
      )}
    </div>
  );
}