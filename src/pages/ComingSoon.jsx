import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-[0.3em] uppercase text-amber-500/70 mb-3">Post Production</p>
      <h1 className="text-3xl font-black text-white mb-2" style={{ color: '#D4AF37' }}>Coming Soon</h1>
      <p className="text-slate-400 text-sm mb-8">This e-book is currently in final review. Check back shortly.</p>
      <Link to="/" className="text-xs tracking-widest uppercase text-slate-500 hover:text-amber-400 transition-colors">
        ← Back to Library
      </Link>
    </div>
  );
}