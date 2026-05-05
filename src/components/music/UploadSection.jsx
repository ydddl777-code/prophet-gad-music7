import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Music, Loader2 } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function UploadSection({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [defaults, setDefaults] = useState({
    language: 'English',
    rhythm_style: 'Reggae',
    price: '2.99',
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setProgress({ current: 0, total: files.length });

    const uploaded = [];
    const failed = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        // Clean title from filename
        const title = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
          .trim();

        await base44.entities.MusicTrack.create({
          title,
          artist: 'Prophet Gad',
          language: defaults.language,
          rhythm_style: defaults.rhythm_style,
          price: parseFloat(defaults.price) || 2.99,
          file_url,
          file_size: file.size,
          year: new Date().getFullYear(),
          is_dormant: false,
          is_free_listen: false,
          tags: [],
        });

        uploaded.push(title);
      } catch (err) {
        failed.push(file.name);
      }
    }

    if (uploaded.length > 0) toast.success(`Uploaded ${uploaded.length} track(s)`);
    if (failed.length > 0) toast.error(`Failed: ${failed.join(', ')}`);

    setUploading(false);
    setProgress({ current: 0, total: 0 });
    e.target.value = '';
    onUploadComplete();
  };

  return (
    <Card className="border border-slate-700 bg-slate-900">
      <CardContent className="p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-400" /> Upload New Tracks
        </h3>

        {/* Default settings */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Language</label>
            <Select value={defaults.language} onValueChange={v => setDefaults(d => ({ ...d, language: v }))}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Dominican Spanish">Dominican Spanish</SelectItem>
                <SelectItem value="Haitian Creole">Haitian Creole</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rhythm Style</label>
            <Select value={defaults.rhythm_style} onValueChange={v => setDefaults(d => ({ ...d, rhythm_style: v }))}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Bachata","Kompa","Reggae","Reggaeton","Gospel","Salsa","Merengue","Pop","R&B","Hip-Hop","Other"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Price ($)</label>
            <Input
              type="number"
              step="0.01"
              value={defaults.price}
              onChange={e => setDefaults(d => ({ ...d, price: e.target.value }))}
              className="bg-slate-800 border-slate-700 text-white text-sm"
            />
          </div>
        </div>

        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-slate-300 text-sm">Processing {progress.current}/{progress.total}...</p>
                <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Music className="w-8 h-8 text-slate-500" />
                <p className="text-slate-400 text-sm">Click to select audio files</p>
                <p className="text-slate-600 text-xs">All tracks attributed to Prophet Gad</p>
              </div>
            )}
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="audio/*,video/mp4,.mp4"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
      </CardContent>
    </Card>
  );
}