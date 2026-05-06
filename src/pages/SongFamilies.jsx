import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Star, Crown, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePlayer } from '../components/music/PlayerContext';

export default function SongFamilies() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState({});
  const queryClient = useQueryClient();
  const player = usePlayer();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['song-families-tracks'],
    queryFn: () => base44.entities.MusicTrack.list('composition_date', 1000),
  });

  // Group by composition_date, then by version_group within that date
  const families = React.useMemo(() => {
    const withDate = tracks.filter(t => t.composition_date && !t.is_dormant);
    const byDate = {};
    for (const t of withDate) {
      const key = t.composition_date;
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(t);
    }
    // Sort dates descending (newest first)
    return Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tracks]);

  const toggleExpand = (date) => setExpanded(prev => ({ ...prev, [date]: !prev[date] }));

  const setRating = async (track, rating) => {
    await base44.entities.MusicTrack.update(track.id, { rating });
    queryClient.invalidateQueries({ queryKey: ['song-families-tracks'] });
    toast.success(`Rated "${track.title}" ${rating}/10`);
  };

  const setBestVersion = async (track, familyTracks) => {
    // Clear best version from all siblings first, then set this one
    await Promise.all(
      familyTracks
        .filter(t => t.is_best_version)
        .map(t => base44.entities.MusicTrack.update(t.id, { is_best_version: false }))
    );
    await base44.entities.MusicTrack.update(track.id, { is_best_version: true });
    queryClient.invalidateQueries({ queryKey: ['song-families-tracks'] });
    toast.success(`👑 "${track.title}" is now the best version`);
  };

  const handlePlay = (track, familyTracks) => {
    if (player?.currentTrack?.id === track.id) {
      player.togglePlayPause();
    } else {
      player?.play(track, familyTracks);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <p className="text-slate-400">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-400">Song Families</h1>
          <p className="text-slate-400 mt-1 text-sm">Grouped by genesis date — rate versions and crown the best one for YouTube.</p>
          <p className="text-slate-600 text-xs mt-1">{families.length} families · {tracks.filter(t => t.composition_date && !t.is_dormant).length} songs mapped</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : families.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No songs have composition dates yet. Run the patchCompositionDates function first.
          </div>
        ) : (
          <div className="space-y-3">
            {families.map(([date, familyTracks]) => {
              const bestVersion = familyTracks.find(t => t.is_best_version);
              const isOpen = expanded[date];
              const sorted = [...familyTracks].sort((a, b) => (b.rating || 0) - (a.rating || 0));

              return (
                <div key={date} className="border border-slate-800 rounded-xl overflow-hidden">
                  {/* Family Header */}
                  <button
                    onClick={() => toggleExpand(date)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-slate-900 hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <div>
                        <span className="font-bold text-white text-lg">{date}</span>
                        <span className="ml-3 text-slate-500 text-sm">{familyTracks.length} version{familyTracks.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {bestVersion && (
                        <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold bg-amber-950/60 border border-amber-700/40 px-3 py-1 rounded-full">
                          <Crown className="w-3 h-3" /> {bestVersion.title}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Expanded Track List */}
                  {isOpen && (
                    <div className="divide-y divide-slate-900">
                      {sorted.map(track => {
                        const isPlaying = player?.currentTrack?.id === track.id && player?.isPlaying;
                        return (
                          <div key={track.id} className={`flex items-center gap-4 px-5 py-3 ${track.is_best_version ? 'bg-amber-950/10' : 'bg-[#111] hover:bg-slate-900/60'} transition-colors`}>
                            {/* Play button */}
                            <button
                              onClick={() => handlePlay(track, familyTracks)}
                              disabled={!track.file_url}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex-shrink-0"
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-slate-300 ml-0.5" />}
                            </button>

                            {/* Track info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {track.is_best_version && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                                <span className={`font-semibold text-sm truncate ${track.is_best_version ? 'text-amber-300' : 'text-white'}`}>{track.title}</span>
                                {track.language && <span className="text-xs text-slate-500">{track.language}</span>}
                                {track.rhythm_style && <span className="text-xs text-slate-600">· {track.rhythm_style}</span>}
                                {track.duration && <span className="text-xs font-mono text-slate-600">{track.duration}</span>}
                              </div>
                            </div>

                            {/* Star rating */}
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <button
                                  key={n}
                                  onClick={() => setRating(track, n)}
                                  className={`w-4 h-4 transition-colors ${(track.rating || 0) >= n ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'}`}
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>
                              ))}
                              <span className="text-xs text-slate-500 ml-1 w-6">{track.rating ? `${track.rating}/10` : '—'}</span>
                            </div>

                            {/* Crown button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setBestVersion(track, familyTracks)}
                              className={`flex-shrink-0 h-7 px-2 text-xs gap-1 ${track.is_best_version ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-amber-400'}`}
                              title="Mark as best version"
                            >
                              <Crown className="w-3 h-3" />
                              {track.is_best_version ? 'Best' : 'Pick'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}