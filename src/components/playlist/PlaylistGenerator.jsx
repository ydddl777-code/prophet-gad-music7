import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Clock, Users, Music2, Image } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlaylistGenerator({ tracks, onGenerate }) {
  const [theme, setTheme] = useState('');
  const [duration, setDuration] = useState(60);
  const [includeArtists, setIncludeArtists] = useState('');
  const [excludeArtists, setExcludeArtists] = useState('');
  const [includeGenres, setIncludeGenres] = useState('');
  const [excludeGenres, setExcludeGenres] = useState('');
  const [generateCoverArt, setGenerateCoverArt] = useState(true);
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
      // Prepare track list for AI with duration estimates (avg 3.5 min per track)
      const tracksList = tracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album,
        genre: t.genre,
        year: t.year,
        rating: t.rating,
        duration_estimate: "~3.5min"
      }));

      // Build constraints
      const constraints = [];
      if (includeArtists) constraints.push(`MUST include artists: ${includeArtists}`);
      if (excludeArtists) constraints.push(`MUST exclude artists: ${excludeArtists}`);
      if (includeGenres) constraints.push(`MUST include genres: ${includeGenres}`);
      if (excludeGenres) constraints.push(`MUST exclude genres: ${excludeGenres}`);
      constraints.push(`Target duration: approximately ${duration} minutes (estimate ~3.5min per track, so aim for ${Math.floor(duration/3.5)} tracks)`);

      // Use AI to select and order tracks
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Given this theme/mood: "${theme}"

Create a curated playlist from the available tracks. 

CONSTRAINTS:
${constraints.join('\n')}

REQUIREMENTS:
1. Select tracks that match the theme and respect all constraints
2. Prioritize tracks with higher ratings when available
3. Order tracks for optimal flow (energy, tempo, mood transitions)
4. Aim for approximately ${duration} minutes total duration

Available tracks:
${JSON.stringify(tracksList, null, 2)}

Return a playlist with creative name, description, and track IDs in optimal play order.`,
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

      // Generate cover art if requested
      let coverImageUrl = null;
      if (generateCoverArt) {
        try {
          const coverResult = await base44.integrations.Core.GenerateImage({
            prompt: `Album cover art for a music playlist. Theme: ${theme}. Style: modern, vibrant, abstract, visually striking. No text or words.`
          });
          coverImageUrl = coverResult.url;
        } catch (error) {
          console.error("Cover art generation failed:", error);
        }
      }

      onGenerate({
        name: result.playlist_name,
        description: result.description,
        theme: theme,
        track_ids: result.selected_track_ids,
        cover_color: result.cover_color || "#3b82f6",
        cover_image_url: coverImageUrl,
        target_duration: duration
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
          <label className="text-sm font-medium mb-2 block">Theme / Mood</label>
          <Input
            placeholder="e.g., Workout energy, Rainy day vibes, 90s nostalgia..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Target Duration
          </label>
          <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Include Artists
            </label>
            <Input
              placeholder="e.g., Beatles, Queen"
              value={includeArtists}
              onChange={(e) => setIncludeArtists(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Exclude Artists
            </label>
            <Input
              placeholder="e.g., Taylor Swift"
              value={excludeArtists}
              onChange={(e) => setExcludeArtists(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              Include Genres
            </label>
            <Input
              placeholder="e.g., Rock, Pop"
              value={includeGenres}
              onChange={(e) => setIncludeGenres(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              Exclude Genres
            </label>
            <Input
              placeholder="e.g., Country"
              value={excludeGenres}
              onChange={(e) => setExcludeGenres(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-lg">
          <label className="text-sm font-medium flex items-center gap-2">
            <Image className="w-4 h-4" />
            Generate Cover Art
          </label>
          <Switch checked={generateCoverArt} onCheckedChange={setGenerateCoverArt} />
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