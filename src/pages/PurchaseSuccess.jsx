import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, Music2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PurchaseSuccess() {
  const [track, setTrack] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const trackId = params.get('track_id');
  const title = params.get('title') || 'Your track';

  useEffect(() => {
    if (trackId) {
      base44.entities.MusicTrack.filter({ id: trackId }, '-created_date', 1)
        .then(results => {
          if (results?.[0]) setTrack(results[0]);
        })
        .catch(console.error);
    }
  }, [trackId]);

  const handleDownload = () => {
    if (!track?.file_url) return;
    setDownloading(true);
    const a = document.createElement('a');
    a.href = track.file_url;
    a.download = `${track.title || 'track'}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-1">Thank you for your purchase.</p>
        <p className="text-slate-700 font-semibold mb-6">"{title}"</p>

        {track?.cover_art_url && (
          <img
            src={track.cover_art_url}
            alt="Album art"
            className="w-32 h-32 object-cover rounded-xl mx-auto mb-6 shadow"
          />
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Artist</p>
          <p className="font-semibold text-slate-800">Prophet Gad</p>
          <p className="text-xs text-slate-500 mt-1">Thread Bear Music · Remnant Seed LLC</p>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!track || downloading}
          className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-semibold py-3 mb-3"
        >
          {downloading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Downloading...</>
          ) : (
            <><Download className="w-4 h-4 mr-2" /> Download Track</>
          )}
        </Button>

        <Link to={createPageUrl('MusicLibrary')}>
          <Button variant="outline" className="w-full">
            <Music2 className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </Link>
      </div>
    </div>
  );
}