import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { Music2, Disc3 } from 'lucide-react';
import UploadSection from '../components/music/UploadSection';
import TrackCard from '../components/music/TrackCard';
import FilterBar from '../components/music/FilterBar';
import VersionGroupCard from '../components/music/VersionGroupCard';

export default function MusicLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('-created_date');
  
  const queryClient = useQueryClient();

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['music-tracks', sortBy],
    queryFn: () => base44.entities.MusicTrack.list(sortBy, 1000),
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = base44.entities.MusicTrack.subscribe((event) => {
      queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
  };

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
  };

  // Get unique genres
  const genres = [...new Set(tracks.filter(t => t.genre).map(t => t.genre))].sort();

  // Filter tracks
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  // Group by language
  const tracksByLanguage = filteredTracks.reduce((acc, track) => {
    const language = track.language || 'Unknown Language';
    if (!acc[language]) acc[language] = [];
    acc[language].push(track);
    return acc;
  }, {});

  // Group tracks by version_group within each language
  const groupTracksByVersion = (tracks) => {
    const versionGroups = {};
    const standaloneTracksArray = [];

    tracks.forEach(track => {
      if (track.version_group) {
        if (!versionGroups[track.version_group]) {
          versionGroups[track.version_group] = [];
        }
        versionGroups[track.version_group].push(track);
      } else {
        standaloneTracksArray.push(track);
      }
    });

    return { versionGroups, standaloneTracksArray };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Music2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Music Library</h1>
              <p className="text-slate-600">Organize and manage your music collection</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-slate-600 mt-4">
            <div>
              <span className="font-semibold text-slate-900">{tracks.length}</span> tracks
            </div>
            <div>
              <span className="font-semibold text-slate-900">{genres.length}</span> genres
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <UploadSection onUploadComplete={handleUploadComplete} />

        {/* Filters */}
        {tracks.length > 0 && (
          <FilterBar
            genres={genres}
            onSearchChange={setSearchTerm}
            onGenreChange={setSelectedGenre}
            onSortChange={setSortBy}
          />
        )}

        {/* Tracks Display */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading your library...</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <Disc3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">
              {tracks.length === 0 ? "No tracks yet. Upload some music to get started!" : "No tracks match your filters."}
            </p>
          </div>
        ) : selectedGenre === 'all' ? (
          // Grouped by language with version grouping
          Object.entries(tracksByLanguage).map(([language, languageTracks]) => {
            const { versionGroups, standaloneTracksArray } = groupTracksByVersion(languageTracks);
            
            return (
              <div key={language} className="bg-white rounded-xl p-6 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-white" />
                  </div>
                  {language}
                  <span className="text-sm font-normal text-slate-500">({languageTracks.length} tracks)</span>
                </h2>
                
                <div className="space-y-4">
                  {/* Version Groups */}
                  {Object.entries(versionGroups).map(([groupName, groupTracks]) => (
                    <VersionGroupCard
                      key={groupName}
                      groupName={groupName}
                      tracks={groupTracks}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                  
                  {/* Standalone Tracks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {standaloneTracksArray.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Single genre or search results
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}