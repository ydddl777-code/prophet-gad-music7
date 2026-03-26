import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, Music2, Loader2, Clock, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PurchaseSuccess() {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [coverArt, setCoverArt] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const trackId = params.get('track_id');
  const source = params.get('source'); // 'square' or null (stripe)
  const title = params.get('title') || 'Your track';

  useEffect(() => {
    if (source === 'square' && trackId) {
      // Square payment — fetch track directly and provide download
      base44.entities.MusicTrack.filter({ id: trackId }, '-created_date', 1)
        .then(results => {
          const track = results?.[0];
          if (track?.file_url) {
            setDownloadUrl(track.file_url);
            setTrackTitle(track.title || title);
            setTrackArtist(track.artist || 'Prophet Gad');
            if (track.cover_art_url) setCoverArt(track.cover_art_url);
            setStatus('ready');
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
      return;
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Stripe flow — verify session server-side
    base44.functions.invoke('generateDownloadLink', { session_id: sessionId })
      .then(res => {
        if (res.data?.download_url) {
          setDownloadUrl(res.data.download_url);
          setTrackTitle(res.data.track_title || title);
          setTrackArtist(res.data.track_artist || 'Prophet Gad');
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));

    if (trackId) {
      base44.entities.MusicTrack.filter({ id: trackId }, '-created_date', 1)
        .then(results => { if (results?.[0]?.cover_art_url) setCoverArt(results[0].cover_art_url); })
        .catch(() => {});
    }
  }, [sessionId, trackId, source]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    setDownloading(true);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${trackTitle || 'track'}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">Verifying payment & preparing your download...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music2 className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">We couldn't verify your purchase. Please contact support with your order details.</p>
            <Link to="/MusicLibrary">
              <Button variant="outline" className="w-full">Back to Library</Button>
            </Link>
          </>
        )}

        {status === 'ready' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-1">Thank you for your purchase.</p>
            <p className="text-slate-700 font-semibold mb-6">"{trackTitle}"</p>

            {coverArt && (
              <img src={coverArt} alt="Album art" className="w-32 h-32 object-cover rounded-xl mx-auto mb-6 shadow" />
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-left">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Artist</p>
              <p className="font-semibold text-slate-800">{trackArtist}</p>
              <p className="text-xs text-slate-500 mt-1">Thread Bear Music · Remnant Seed LLC</p>
            </div>

            {/* Secure link notice */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-left">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Secure download link</p>
                <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Expires in 1 hour</p>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-semibold py-3 mb-3"
            >
              {downloading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Downloading...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Download Track</>
              )}
            </Button>

            {/* Email delivery option */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3 text-left">
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><Mail className="w-3 h-3" /> Send download link to your email</p>
              {emailSent ? (
                <p className="text-green-600 text-sm font-semibold">✓ Email sent! Check your inbox.</p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400"
                  />
                  <button
                    disabled={emailSending || !email}
                    onClick={async () => {
                      setEmailSending(true);
                      await base44.functions.invoke('sendDownloadEmail', {
                        email,
                        track_id: trackId,
                        track_title: trackTitle,
                        track_artist: trackArtist,
                        file_url: downloadUrl
                      }).catch(() => {});
                      setEmailSent(true);
                      setEmailSending(false);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    {emailSending ? '...' : 'Send'}
                  </button>
                </div>
              )}
            </div>

            <Link to="/MusicLibrary">
              <Button variant="outline" className="w-full">
                <Music2 className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}