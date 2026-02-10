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

    setUploading(true);
    setProgress({ current: 0, total: files.length });
    
    try {
      const uploadedTracks = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });
        
        // Upload file
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        
        // Extract metadata using LLM
        setExtracting(true);
        const metadata = await base44.integrations.Core.InvokeLLM({
          prompt: `Extract metadata from this music file: ${file.name}. 
          Parse the filename and return structured data.
          If the filename has format like "Artist - Title.mp3" or "Artist - Album - Title.mp3", extract those parts.
          Make reasonable guesses for genre based on the artist/title if you know them.`,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              album: { type: "string" },
              genre: { type: "string" },
              year: { type: "number" }
            }
          }
        });

        // Create track record
        const track = await base44.entities.MusicTrack.create({
          ...metadata,
          file_url,
          file_size: file.size,
          duration: "Unknown"
        });
        
        uploadedTracks.push(track);
      }
      
      toast.success(`Successfully uploaded ${uploadedTracks.length} track(s)`);
      onUploadComplete(uploadedTracks);
    } catch (error) {
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