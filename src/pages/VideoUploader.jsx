import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import NavArrow from '@/components/NavArrow';

export default function VideoUploader() {
  const [tracks, setTracks] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(null); // track id currently uploading
  const [log, setLog] = useState([]);

  useEffect(() => {
    base44.entities.MusicTrack.filter({ is_free_listen: true }, '-track_number', 100)
      .then(setTracks)
      .catch(() => {});
  }, []);

  const filteredTracks = tracks.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileSelect = async (track, file) => {
    if (!file) return;
    if (!file.name.endsWith('.mp4')) {
      toast.error('Please select an MP4 file');
      return;
    }

    setUploading(track.id);
    setLog(prev => [...prev, `⏫ Uploading "${file.name}" for "${track.title}"...`]);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.MusicTrack.update(track.id, { file_url });
      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, file_url } : t));
      setLog(prev => [...prev, `✅ "${track.title}" — video linked!`]);
      toast.success(`Video uploaded for "${track.title}"`);
    } catch (e) {
      setLog(prev => [...prev, `❌ Failed for "${track.title}": ${e.message}`]);
      toast.error('Upload failed');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-black mb-1" style={{color: '#7a1f30'}}>Video Uploader</h1>
        <p className="text-slate-600 text-sm mb-6">
          Upload MP4 videos for Extended Play tracks (tracks marked as free listen).
          Each video replaces the audio file URL for that track.
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <Input
            className="pl-9 bg-white border-slate-300 text-slate-900"
            placeholder="Search tracks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2 mb-8">
          {filteredTracks.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-8">
              No free-listen tracks found. Mark tracks as "free listen" in the catalog first.
            </p>
          )}
          {filteredTracks.map(track => (
            <div key={track.id} className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3">
              {track.cover_art_url && (
                <img src={track.cover_art_url} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{track.title}</p>
                <p className="text-xs text-slate-500 truncate">
                  {track.file_url?.endsWith('.mp4')
                    ? <span className="text-green-400">✓ MP4 linked</span>
                    : track.file_url
                    ? <span className="text-amber-500">MP3 only — no video yet</span>
                    : <span className="text-red-400">No file</span>
                  }
                </p>
              </div>

              <label className={`cursor-pointer flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border transition-colors
                ${uploading === track.id
                  ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#7a1f30]/10 border-[#7a1f30]/40 text-[#7a1f30] hover:bg-[#7a1f30]/20'
                }`}>
                {uploading === track.id ? (
                  <span className="animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Upload MP4
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4"
                  className="hidden"
                  disabled={uploading === track.id}
                  onChange={e => handleFileSelect(track, e.target.files[0])}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Upload Log</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {log.map((line, i) => (
                <p key={i} className="text-xs font-mono text-slate-700">{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      <NavArrow />
    </div>
  );
}