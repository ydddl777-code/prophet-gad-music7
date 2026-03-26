import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 relative">
      {/* Faded checkout-style background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center pt-16">
        <div className="max-w-md w-full border border-slate-700 rounded-xl p-8 mx-6">
          <div className="h-4 bg-slate-800 rounded mb-4 w-3/4" />
          <div className="h-3 bg-slate-800 rounded mb-2 w-full" />
          <div className="h-3 bg-slate-800 rounded mb-6 w-2/3" />
          <div className="h-10 bg-slate-800 rounded mb-3" />
          <div className="h-10 bg-slate-800 rounded" />
        </div>
      </div>

      {/* Overlay notice */}
      <div className="relative z-10 border border-amber-500/50 bg-[#0a0a0a]/95 rounded-xl px-10 py-8 text-center max-w-sm w-full shadow-2xl">
        <div className="text-[0.6rem] tracking-[0.35em] uppercase text-amber-500/70 mb-2">Post Production</div>
        <h2 className="text-2xl font-black mb-1" style={{ color: '#D4AF37' }}>Available Soon</h2>
        <p className="text-slate-400 text-sm mt-3 mb-6">This e-book is in its final stage of review. The checkout will be active upon release.</p>
        <Link to="/" className="text-xs tracking-widest uppercase text-slate-500 hover:text-amber-400">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}