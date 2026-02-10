import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function PlaylistGenerator({ tracks, onGenerate }) {
  const [theme, setTheme] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast.error("Please enter a theme or mood");
      return;
    }

    if (tracks.length === 0) {
      toast.error("No tracks available. Upload some music first!");
      return;
    }

    setGenerating(true);
    
    try {
      // Prepare track list for AI
      const tracksList = tracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album,
        genre: t.genre,
        year: t.year
      }));

      // Use AI to select tracks
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Given this theme/mood: "${theme}"
        
Select 8-15 tracks from the following library that best match this theme. Consider the genre, artist style, song titles, and overall vibe.

Available tracks:
${JSON.stringify(tracksList, null, 2)}

Return a curated playlist with a creative name and description.`,
        response_json_schema: {
          type: "object",
          properties: {
            playlist_name: { type: "string" },
            description: { type: "string" },
            selected_track_ids: {
              type: "array",
              items: { type: "string" }
            },
            cover_color: { type: "string" }
          }
        }
      });

      onGenerate({
        name: result.playlist_name,
        description: result.description,
        theme: theme,
        track_ids: result.selected_track_ids,
        cover_color: result.cover_color || "#3b82f6"
      });

      setTheme('');
      toast.success("Playlist generated!");
    } catch (error) {
      toast.error("Generation failed: " + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Playlist Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="e.g., Workout energy, Rainy day vibes, 90s nostalgia..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="bg-white"
          />
          <p className="text-xs text-slate-600 mt-2">
            Describe a mood, theme, genre, or activity
          </p>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={generating || !theme.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Playlist...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Playlist
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}