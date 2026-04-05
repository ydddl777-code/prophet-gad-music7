import React, { useState, useEffect } from 'react';
import { usePlayer } from './PlayerContext';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import TrackRow from './TrackRow';

export default function RelatedTracks({ track, allTracks, onClose }) {
  const player = usePlayer();
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findRelatedTracks();
  }, [track]);

  const findRelatedTracks = async () => {
    setLoading(true);
    try {
      // Build track context
      const trackInfo = {
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        rhythm_style: track.rhythm_style,
        language: track.language,
        bpm: track.bpm,
        description: track.description,
        tags: track.tags
      };

      const catalogInfo = allTracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        genre: t.genre,
        rhythm_style: t.rhythm_style,
        language: t.language,
        bpm: t.bpm,
        tags: t.tags
      }));

      const prompt = `You are a music recommendation expert specializing in prophetic and spiritual music.

Current Track:
${JSON.stringify(trackInfo, null, 2)}

Available Tracks:
${JSON.stringify(catalogInfo, null, 2)}

Find the 5 most similar tracks based on:
1. Musical similarity (rhythm, genre, BPM, language)
2. Thematic connection (spiritual messages, prophetic themes)
3. Emotional resonance
4. Cultural context

Return ONLY the track IDs of the 5 most related tracks, in order of relevance.
Do NOT include the current track itself.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            track_ids: {
              type: "array",
              items: { type: "string" }
            },
            reasoning: {
              type: "string"
            }
          }
        }
      });

      const related = result.track_ids
        .map(id => allTracks.find(t => t.id === id))
        .filter(Boolean)
        .slice(0, 5);

      setRelatedTracks(related);
    } catch (error) {
      console.error('Error finding related tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="border-b border-slate-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Related Tracks</h2>
                  <p className="text-sm text-slate-400">Similar to "{track.title}"</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-400">Finding similar prophetic messages...</p>
                </div>
              ) : relatedTracks.length > 0 ? (
                <div className="space-y-1">
                  {relatedTracks.map(relatedTrack => (
                    <TrackRow
                      key={relatedTrack.id}
                      track={relatedTrack}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      onPlay={(t) => {
                        player.play(t, allTracks);
                      }}
                      isAdmin={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">No similar tracks found</p>
                </div>
              )}

              <div className="mt-6">
                <Button onClick={onClose} className="w-full bg-slate-800">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}