import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, FileText, Download } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import jsPDF from 'jspdf';

export default function LyricsExtractor({ track, onClose, onSave }) {
  const [lyrics, setLyrics] = useState(track.lyrics || '');
  const [extracting, setExtracting] = useState(false);

  const extractLyrics = async () => {
    setExtracting(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find and return the complete lyrics for this song:
        
Title: "${track.title}"
Artist: "${track.artist || 'Unknown'}"
Album: "${track.album || 'Unknown'}"

Return the full lyrics text. If you cannot find the exact lyrics, indicate that clearly.`,
        add_context_from_internet: true
      });

      setLyrics(result);
      
      // Auto-save lyrics
      await base44.entities.MusicTrack.update(track.id, { lyrics: result });
      onSave({ ...track, lyrics: result });
      
      toast.success("Lyrics extracted successfully");
    } catch (error) {
      toast.error("Failed to extract lyrics");
    } finally {
      setExtracting(false);
    }
  };

  const downloadPDF = () => {
    if (!lyrics) {
      toast.error("No lyrics to download");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(track.title, 20, 20);
    
    // Artist
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`By ${track.artist || 'Unknown Artist'}`, 20, 30);
    
    if (track.album) {
      doc.setFontSize(12);
      doc.text(`Album: ${track.album}`, 20, 38);
    }
    
    // Lyrics
    doc.setFontSize(11);
    const lyricsLines = doc.splitTextToSize(lyrics, 170);
    doc.text(lyricsLines, 20, track.album ? 48 : 40);
    
    // Download
    const filename = `${track.title.replace(/[^a-z0-9]/gi, '_')}_lyrics.pdf`;
    doc.save(filename);
    
    toast.success("Lyrics PDF downloaded");
  };

  const handleSave = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, { lyrics });
      onSave({ ...track, lyrics });
      toast.success("Lyrics saved");
      onClose();
    } catch (error) {
      toast.error("Failed to save lyrics");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Lyrics - {track.title}
            </span>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={extractLyrics}
              disabled={extracting}
              variant="outline"
              className="flex-1"
            >
              {extracting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Lyrics...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Extract Lyrics with AI
                </>
              )}
            </Button>
            {lyrics && (
              <Button onClick={downloadPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lyrics</label>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Lyrics will appear here after extraction, or you can paste them manually..."
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={!lyrics}>
              Save Lyrics
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}