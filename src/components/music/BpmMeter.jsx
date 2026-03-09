import React from 'react';
import { motion } from 'framer-motion';

const RHYTHM_INFO = {
  Bachata:   { color: 'bg-rose-500',    label: 'Bachata',   desc: 'Dominican syncopated rhythm' },
  Kompa:     { color: 'bg-purple-500',  label: 'Kompa',     desc: 'Haitian Compas groove' },
  Reggae:    { color: 'bg-green-500',   label: 'Reggae',    desc: 'Jamaican downbeat skank' },
  Reggaeton: { color: 'bg-orange-500',  label: 'Reggaeton', desc: 'Dembow urban rhythm' },
  Gospel:    { color: 'bg-yellow-500',  label: 'Gospel',    desc: 'Inspirational praise music' },
  Salsa:     { color: 'bg-red-500',     label: 'Salsa',     desc: 'Afro-Cuban clave rhythm' },
  Merengue:  { color: 'bg-amber-500',   label: 'Merengue',  desc: 'Dominican fast 2/4 beat' },
  Pop:       { color: 'bg-blue-500',    label: 'Pop',       desc: 'Contemporary pop style' },
  'R&B':     { color: 'bg-indigo-500',  label: 'R&B',       desc: 'Soul and rhythm & blues' },
  'Hip-Hop': { color: 'bg-slate-600',   label: 'Hip-Hop',   desc: 'Urban beats and flow' },
  Other:     { color: 'bg-slate-400',   label: 'Other',     desc: 'Unique style' },
};

export default function BpmMeter({ bpm, rhythmStyle, compact = false }) {
  if (!bpm && !rhythmStyle) return null;

  const pulseDuration = bpm ? 60 / bpm : 1;
  const info = RHYTHM_INFO[rhythmStyle] || RHYTHM_INFO['Other'];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {bpm && (
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${info.color}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {bpm && <span className="text-xs font-mono text-slate-500">{Math.round(bpm)} BPM</span>}
        {rhythmStyle && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded text-white ${info.color}`}>
            {rhythmStyle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      {bpm && (
        <div className="flex flex-col items-center gap-1">
          <motion.div
            className={`w-8 h-8 rounded-full ${info.color} shadow-md`}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-xs font-bold font-mono text-slate-700">{Math.round(bpm)}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">BPM</span>
        </div>
      )}
      {rhythmStyle && (
        <div className="flex-1">
          <p className={`text-sm font-bold text-white px-2 py-0.5 rounded-md inline-block ${info.color} mb-1`}>
            {info.label}
          </p>
          <p className="text-xs text-slate-500">{info.desc}</p>
        </div>
      )}
    </div>
  );
}