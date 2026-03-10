import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { Music2, Disc3, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UploadSection from '../components/music/UploadSection';
import TrackCard from '../components/music/TrackCard';
import FilterBar from '../components/music/FilterBar';
import VersionGroupCard from '../components/music/VersionGroupCard';
import ProphetHeroBanner from '../components/music/ProphetHeroBanner';
import { usePlayer } from '../components/music/PlayerContext';

export default function MusicLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('-created_date');
  const [isAdmin, setIsAdmin] = useState(false);

  const queryClient = useQueryClient();
  const { play } = usePlayer();

  useEffect(() => {
    base44.auth.me()
      .then(user => setIsAdmin(user?.role === 'admin'))
      .catch(() => setIsAdmin(false));
  }, []);

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

  const handlePlay = (track) => play(track, filteredTracks);

  // Group tracks by version_group within each section
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

  // Classify into two sections
  const isDominicanMemories = (track) =>
    track.language === 'Dominican Spanish' ||
    track.language === 'Haitian Creole' ||
    (track.language === 'English' && ['Bachata', 'Kompa'].includes(track.rhythm_style));

  const dominicanTracks = filteredTracks.filter(isDominicanMemories);
  const propheticTracks = filteredTracks.filter(t => !isDominicanMemories(t));

  const renderSection = (sectionTracks, title, subtitle, isPrimary) => {
    if (sectionTracks.length === 0) return null;
    const { versionGroups, standaloneTracksArray } = groupTracksByVersion(sectionTracks);
    return (
      <div className={isPrimary ? 'mb-16' : 'border-t border-slate-800 pt-12 mb-8'}>
        {isPrimary ? (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Primary Collection</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2">{title}</h2>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
        ) : (
          <div className="mb-8">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Side Collection</span>
            <h3 className="text-2xl font-bold text-slate-300 mt-1">{title}</h3>
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          </div>
        )}
        <div className="space-y-4">
          {Object.entries(versionGroups).map(([groupName, groupTracks]) => (
            <VersionGroupCard key={groupName} groupName={groupName} tracks={groupTracks}
              onUpdate={handleUpdate} onDelete={handleDelete} onPlay={handlePlay} isAdmin={isAdmin} />
          ))}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standaloneTracksArray.map((track) => (
              <TrackCard key={track.id} track={track} onUpdate={handleUpdate}
                onDelete={handleDelete} onPlay={handlePlay} isAdmin={isAdmin} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Prophet Hero Banner */}
      <ProphetHeroBanner />

      {/* Library Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Prophetic Music Library
              </h2>
              <p className="text-slate-400 text-sm mt-1">These are not merely songs — they are oracles set to rhythm</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-5 text-sm text-slate-400">
                <div><span className="font-bold text-white">{tracks.length}</span> tracks</div>
                <div><span className="font-bold text-white">{genres.length}</span> genres</div>
              </div>
              {!isAdmin && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => base44.auth.redirectToLogin()}>
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section - Admin only */}
        {isAdmin && <UploadSection onUploadComplete={handleUploadComplete} />}

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
            <p className="text-slate-400">Loading your library...</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <Disc3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {tracks.length === 0 ? "No tracks yet. Upload some music to get started!" : "No tracks match your filters."}
            </p>
          </div>
        ) : (
          <>
            {renderSection(propheticTracks, 'Prophetic · Spiritual', 'Oracles set to rhythm · Prophecy · Judgment · Repentance · Awakening', true)}
            {renderSection(dominicanTracks, '🌴 Dominican Memories', 'Dominican Spanish · Haitian Creole · Bachata · Love & Life', false)}
          </>
        )}
      </div>
    </div>
  );
}