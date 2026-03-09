import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Music, Loader2 } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function UploadSection({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log(`Starting upload of ${files.length} files...`);

    setUploading(true);
    setProgress({ current: 0, total: files.length });
    
    try {
      // Fetch existing tracks to check for duplicates
      const existingTracks = await base44.entities.MusicTrack.list('-created_date', 10000);
      
      const uploadedTracks = [];
      const skippedTracks = [];
      const failedTracks = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });
        
        try {
          console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`);
          
          // Upload file first to get URL
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          console.log(`File uploaded: ${file_url}`);
          
          // Extract metadata + BPM + rhythm analysis using LLM
          setExtracting(true);
          const metadata = await base44.integrations.Core.InvokeLLM({
            prompt: `You are a music expert and DJ. Analyze this music file name: "${file.name}".

            1. Extract metadata: title, artist, album, genre, year.
            2. Detect language: must be one of "English", "Dominican Spanish", or "Haitian Creole". Use artist/title context clues. Default to "English" if unsure.
            3. Estimate BPM (beats per minute) based on your knowledge of the artist/genre:
               - Bachata: typically 100-140 BPM
               - Kompa (Haitian Compas): typically 100-120 BPM  
               - Reggae: typically 60-90 BPM
               - Reggaeton: typically 90-100 BPM
               - Merengue: typically 120-160 BPM
               - Salsa: typically 170-240 BPM
               - Gospel: typically 60-120 BPM
            4. Detect rhythm_style — one of: "Bachata", "Kompa", "Reggae", "Reggaeton", "Gospel", "Salsa", "Merengue", "Pop", "R&B", "Hip-Hop", "Other"
               - Dominican Spanish artists → likely Bachata or Merengue
               - Haitian Creole artists → likely Kompa
               - If it's a religious/praise song → Gospel
            5. Try to identify a cover_art_url from iTunes search API or a known public image URL for the album art. Return null if unknown.`,
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                artist: { type: "string" },
                album: { type: "string" },
                genre: { type: "string" },
                language: { type: "string", enum: ["English", "Dominican Spanish", "Haitian Creole"] },
                year: { type: "number" },
                bpm: { type: "number" },
                rhythm_style: { type: "string", enum: ["Bachata", "Kompa", "Reggae", "Reggaeton", "Gospel", "Salsa", "Merengue", "Pop", "R&B", "Hip-Hop", "Other"] },
                cover_art_url: { type: "string" }
              }
            }
          });
          console.log(`Metadata extracted:`, metadata);

          // Try iTunes API for cover art if LLM didn't find one
          let coverArtUrl = metadata.cover_art_url || null;
          if (!coverArtUrl && (metadata.artist || metadata.title)) {
            try {
              const query = encodeURIComponent(`${metadata.artist || ''} ${metadata.title || ''}`);
              const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&limit=1`);
              const itunesData = await itunesRes.json();
              if (itunesData.results?.[0]?.artworkUrl100) {
                coverArtUrl = itunesData.results[0].artworkUrl100.replace('100x100', '600x600');
              }
            } catch (e) {
              console.log('iTunes lookup failed:', e);
            }
          }

          // Check for duplicates by metadata (title + artist + album)
          const isDuplicate = existingTracks.some(existing => {
            const titleMatch = existing.title?.toLowerCase() === metadata.title?.toLowerCase();
            const artistMatch = existing.artist?.toLowerCase() === metadata.artist?.toLowerCase();
            const albumMatch = existing.album?.toLowerCase() === metadata.album?.toLowerCase();
            
            // If title, artist, and album all match, it's a duplicate
            return titleMatch && artistMatch && albumMatch;
          });

          if (isDuplicate) {
            console.log(`Skipping duplicate: ${metadata.title}`);
            skippedTracks.push(metadata.title || file.name);
            continue;
          }

          // Create track record
          const track = await base44.entities.MusicTrack.create({
            title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: metadata.artist || "Unknown Artist",
            album: metadata.album,
            genre: metadata.genre,
            language: metadata.language || "English",
            year: metadata.year,
            bpm: metadata.bpm || null,
            rhythm_style: metadata.rhythm_style || null,
            cover_art_url: coverArtUrl || null,
            file_url,
            file_size: file.size,
            duration: "Unknown"
          });
          console.log(`Track created:`, track);
          
          uploadedTracks.push(track);
        } catch (fileError) {
          console.error(`Failed to process ${file.name}:`, fileError);
          failedTracks.push(file.name);
        }
      }
      
      if (uploadedTracks.length > 0) {
        toast.success(`Successfully uploaded ${uploadedTracks.length} track(s)`);
      }
      if (skippedTracks.length > 0) {
        toast.warning(`Skipped ${skippedTracks.length} duplicate(s)`);
      }
      if (failedTracks.length > 0) {
        toast.error(`Failed to upload ${failedTracks.length} file(s): ${failedTracks.slice(0, 2).join(', ')}${failedTracks.length > 2 ? '...' : ''}`);
      }
      if (uploadedTracks.length === 0 && skippedTracks.length === 0 && failedTracks.length === 0) {
        toast.error("No files were uploaded. Check console for errors.");
      }
      
      onUploadComplete(uploadedTracks);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
      setExtracting(false);
      setProgress({ current: 0, total: 0 });
      e.target.value = '';
    }
  };

  return (
    <Card className="border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 transition-colors">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            {uploading || extracting ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <Music className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            {uploading || extracting ? `Processing ${progress.current}/${progress.total}...` : "Bulk Upload Music Files"}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {uploading || extracting ? 
              `Uploading and extracting metadata for track ${progress.current} of ${progress.total}` : 
              "Select multiple files from your desktop. Metadata will be extracted automatically."}
          </p>
          
          <label htmlFor="file-upload">
            <Button disabled={uploading || extracting} asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Choose Multiple Files
              </span>
            </Button>
          </label>
          {progress.total > 0 && (
            <div className="w-full max-w-xs mt-4">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}