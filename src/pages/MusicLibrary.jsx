import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from "@/api/base44Client";
import { Disc3, LogIn, Download, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UploadSection from '../components/music/UploadSection';
import TrackRow from '../components/music/TrackRow';
import FilterBar from '../components/music/FilterBar';
import ProphetHeroBanner from '../components/music/ProphetHeroBanner';
import ExtendedPlayStrip from '../components/music/ExtendedPlayStrip';
import ProphetWelcome from '../components/welcome/ProphetWelcome.jsx';
import EmailCapturePopup from '../components/welcome/EmailCapturePopup.jsx';

import { usePlayer } from '../components/music/PlayerContext';

export default function MusicLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('-track_number');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const queryClient = useQueryClient();
  const { play } = usePlayer();

  useEffect(() => {
    base44.auth.me()
      .then(user => {
        setIsAdmin(user?.role === 'admin');
        setAuthChecked(true);
        setCurrentUser(user);
        
        // Check if user has seen welcome
        const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setAuthChecked(true);
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

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Permanently delete ${selectedIds.size} track(s)?`)) return;
    setBulkDeleting(true);
    for (const id of selectedIds) {
      await base44.entities.MusicTrack.delete(id);
    }
    setSelectedIds(new Set());
    setBulkDeleting(false);
    queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
  };

  // Get unique genres
  const genres = [...new Set(tracks.filter(t => t.genre).map(t => t.genre))].sort();

  // Filter tracks — exclude dormant placeholders and extended-play strip tracks
  const filteredTracks = tracks.filter(track => {
    if (track.is_dormant) return false;
    const matchesSearch = 
      track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (track.track_number && String(track.track_number).includes(searchTerm.trim()));
    
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    const matchesLanguage = selectedLanguage === 'all' || track.language === selectedLanguage;
    
    return matchesSearch && matchesGenre && matchesLanguage;
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

  // Split by language
  const englishTracks = filteredTracks.filter(t => !t.language || t.language === 'English');
  const spanishTracks = filteredTracks.filter(t => t.language === 'Dominican Spanish');
  const creoleTracks = filteredTracks.filter(t => t.language === 'Haitian Creole');

  const renderSection = (sectionTracks, title, subtitle, icon) => {
    if (sectionTracks.length === 0) return null;
    return (
      <div className="mb-10">
        {/* Section Header */}
        <div className="mb-3 text-center">
          <span className="text-lg font-bold text-white">{icon} {title}</span>
          <p className="text-slate-500 text-xs italic mt-1">{subtitle}</p>
        </div>

        {/* Track Rows */}
        <div className="rounded-lg overflow-hidden border border-slate-900">
          {sectionTracks.map((track) => (
            <TrackRow key={track.id} track={track} onUpdate={handleUpdate}
              onDelete={handleDelete} onPlay={handlePlay} isAdmin={isAdmin} allTracks={tracks}
              selectable={isAdmin} selected={selectedIds.has(track.id)} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Admin corner button */}
      {authChecked && isAdmin && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
          >
            ⚙ Admin
          </button>
        </div>
      )}

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

      {/* Extended Play Strip — free-listen featured tracks */}
      <ExtendedPlayStrip />


      {/* Library Header */}
      <div id="music-catalog" className="bg-[#111] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Prophetic Music Library
              </h2>
              <p className="text-slate-500 text-sm mt-1 italic">Hear the Visions — Listen to the Rhythm</p>
            </div>
            <div className="flex items-center gap-3">
              {authChecked && isAdmin && tracks.filter(t => t.is_dormant).length > 0 && (
                <div className="text-sm text-slate-400">
                  <span className="text-slate-600"><span className="text-amber-700">{tracks.filter(t => t.is_dormant).length} dormant</span></span>
                </div>
              )}
              {authChecked && isAdmin && (
                <>
                  <Button
                    variant="outline" size="sm"
                    className="gap-2 border-purple-700 text-purple-400 hover:bg-purple-950"
                    onClick={() => window.location.href = '/SongFamilies'}
                  >
                    👨‍👩‍👧‍👦 Song Families
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="gap-2 border-green-700 text-green-400 hover:bg-green-950"
                    onClick={() => window.location.href = '/AdminImport'}
                  >
                    🚀 Import from Supabase
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="gap-2 border-amber-800 text-amber-600 hover:bg-amber-950"
                    onClick={async () => {
                      if (!confirm('Mark all image-only placeholder records as dormant?')) return;
                      try {
                        const res = await base44.functions.invoke('markDormantRecords', {});
                        alert(res.data?.message || 'Done');
                        queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
                      } catch { alert('Error running task'); }
                    }}
                  >
                    🗂 Mark Dormant
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCatalog}>
                    <Download className="w-4 h-4" />
                    Export Catalog
                  </Button>
                </>
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
        {authChecked && isAdmin && (
          <div id="admin-panel">
            <UploadSection onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Filters */}
        {tracks.length > 0 && (
          <FilterBar
            genres={genres}
            onSearchChange={setSearchTerm}
            onGenreChange={setSelectedGenre}
            onSortChange={setSortBy}
            onLanguageChange={setSelectedLanguage}
          />
        )}

        {/* Bulk Delete Toolbar — admin only, shows when tracks are selected */}
        {isAdmin && selectedIds.size > 0 && (
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-2">
            <span className="text-red-400 text-sm font-semibold">{selectedIds.size} selected</span>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-white text-xs">
              Clear
            </Button>
            <Button size="sm" onClick={handleBulkDelete} disabled={bulkDeleting}
              className="bg-red-700 hover:bg-red-600 text-white text-xs ml-auto">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
            </Button>
          </div>
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
            {renderSection(englishTracks, 'PGMC Catalog — English', 'Prophecy · Judgment · Repentance · Awakening', '🔥')}
            {renderSection(spanishTracks, 'PGMC Catalog — Spanish', 'Dominican Spanish · Bachata · Amor y Vida', '🇩🇴')}
            {renderSection(creoleTracks, 'PGMC Catalog — Haitian Creole', 'Kreyòl · Leve · Pwofesi', '🇭🇹')}
          </>
        )}

        {/* E-Book Store moved above */}
      </div>
    </div>
  );
}