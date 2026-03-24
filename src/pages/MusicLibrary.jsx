import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { Disc3, LogIn, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UploadSection from '../components/music/UploadSection';
import TrackRow from '../components/music/TrackRow';
import FilterBar from '../components/music/FilterBar';
import ProphetHeroBanner from '../components/music/ProphetHeroBanner';
import ProphetWelcome from '../components/welcome/ProphetWelcome.jsx';
import EmailCapturePopup from '../components/welcome/EmailCapturePopup.jsx';
import EbookStore from './EbookStore';
import { usePlayer } from '../components/music/PlayerContext';

export default function MusicLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('created_date');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const queryClient = useQueryClient();
  const { play } = usePlayer();

  useEffect(() => {
    base44.auth.me()
      .then(user => {
        setIsAdmin(user?.role === 'admin');
        setCurrentUser(user);
        
        // Check if user has seen welcome
        const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setCurrentUser(null);
      });
  }, []);

  const handleWelcomeDismiss = () => {
    if (currentUser) {
      localStorage.setItem(`welcome_seen_${currentUser.id}`, 'true');
    }
    setShowWelcome(false);
  };

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

  const handleExportCatalog = () => {
    const csvHeader = "Track Title,Artist Name,Price,Status\n";
    const csvRows = tracks.map(track => {
      const artist = (!track.artist || track.artist.toLowerCase().includes('unknown')) ? 'Prophet Gad' : track.artist;
      const price = track.price || 1.99;
      const status = track.is_free_listen ? 'Free' : 'Paid';
      return `"${track.title}","${artist}","${price.toFixed(2)}","${status}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prophet-gad-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Classify into two sections
  const isDominicanMemories = (track) =>
    track.language === 'Dominican Spanish' ||
    track.language === 'Haitian Creole' ||
    (track.language === 'English' && ['Bachata', 'Kompa'].includes(track.rhythm_style));

  const dominicanTracks = filteredTracks.filter(isDominicanMemories);
  const propheticTracks = filteredTracks.filter(t => !isDominicanMemories(t));

  const renderSection = (sectionTracks, title, subtitle, icon) => {
    if (sectionTracks.length === 0) return null;
    return (
      <div className="mb-10">
        {/* Section Header */}
        <div className="mb-3 px-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-lg font-bold text-white">{icon} {title}</span>
            <span className="text-slate-500 text-xs">{sectionTracks.length} tracks</span>
          </div>
          <p className="text-slate-500 text-xs italic">{subtitle}</p>
        </div>

        {/* Track Rows */}
        <div className="rounded-lg overflow-hidden border border-slate-900">
          {sectionTracks.map((track) => (
            <TrackRow key={track.id} track={track} onUpdate={handleUpdate}
              onDelete={handleDelete} onPlay={handlePlay} isAdmin={isAdmin} allTracks={tracks} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111]">
      <EmailCapturePopup />

      {/* Prophet Welcome Modal */}
      {showWelcome && currentUser && (
        <ProphetWelcome
          userName={currentUser.full_name || 'beloved'}
          onDismiss={handleWelcomeDismiss}
        />
      )}

      {/* Prophet Hero Banner */}
      <ProphetHeroBanner />

      {/* Library Header */}
      <div className="bg-[#111] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Prophetic Music Library
              </h2>
              <p className="text-slate-500 text-sm mt-1 italic">Hear the Visions — Listen to the Rhythm</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-400">
                <span className="font-bold text-white">{tracks.length}</span> tracks
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCatalog}>
                  <Download className="w-4 h-4" />
                  Export Catalog
                </Button>
              )}
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
        {isAdmin && (
          <UploadSection onUploadComplete={handleUploadComplete} />
        )}

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
            {renderSection(propheticTracks, 'Prophetic · Spiritual', 'Oracles set to rhythm · Prophecy · Judgment · Repentance · Awakening', '🔥')}
            {renderSection(dominicanTracks, 'Dominican Memories', 'Dominican Spanish · Haitian Creole · Bachata · Love & Life', '🌴')}
          </>
        )}

        {/* E-Book Store — after the music */}
        <div className="-mx-6 mt-10">
          <EbookStore />
        </div>
      </div>
    </div>
  );
}