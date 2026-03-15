import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function EmailCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    if (localStorage.getItem('email_popup_dismissed')) return;

    const timer = setTimeout(() => setVisible(true), 60000); // 60 seconds
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem('email_popup_dismissed', 'true');
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSaving(true);
    await base44.entities.EmailSubscriber.create({ email, source: 'popup' });
    setSubmitted(true);
    setSaving(false);
    localStorage.setItem('email_popup_dismissed', 'true');
    setTimeout(() => setVisible(false), 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-500/50 rounded-2xl shadow-2xl p-5">
      <button onClick={dismiss} className="absolute top-3 right-3 text-slate-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-amber-400" />
        <p className="text-amber-400 font-bold text-sm">Stay Connected</p>
      </div>

      {submitted ? (
        <p className="text-green-400 text-sm font-semibold text-center py-2">God bless you! You're on the list. 🙏</p>
      ) : (
        <>
          <p className="text-slate-300 text-xs mb-4 leading-relaxed">
            Get updates on new music, prophecies, and releases from Prophet Gad.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-slate-800 border-slate-600 text-white text-sm h-9"
            />
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-sm h-9"
            >
              {saving ? 'Saving...' : 'Keep Me Informed'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}