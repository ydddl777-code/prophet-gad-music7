import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const APPS = [
  {
    id: 'fervent',
    name: 'Fervent',
    tagline: 'Biblical Counseling & Prayer',
    description: 'Bring your troubles — a wayward child, a broken home, a question you can\'t answer. Receive biblical guidance and scripture. And at the end of every session, the AI will pray for you. Worldwide. Anyone. Anytime.',
    url: 'https://furbanconsol.com',
    icon: '🙏',
    color: 'border-purple-700/50',
    labelColor: 'text-purple-400',
    cta: 'Get Counsel',
  },
  {
    id: 'clearsignal',
    name: 'Clear Signal',
    tagline: 'Music Discernment Tool',
    description: 'Bring any song — any artist, any genre. Clear Signal analyzes the lyrics, the imagery, and the themes to help you discern whether what you\'re listening to is building you up or tearing you down. Know what you\'re feeding your spirit.',
    url: null,
    icon: '🔍',
    color: 'border-blue-700/50',
    labelColor: 'text-blue-400',
    cta: 'Coming Soon',
  },
  {
    id: 'threshingfloor',
    name: 'The Threshing Floor',
    tagline: 'Debate the Word',
    description: 'You think there\'s no God? Bring your argument. This is the arena where the enemies of the Most High are answered — chapter and verse, iron sharpening iron. Prophet Gad takes on all challengers from the Word of the God of Israel.',
    url: null,
    icon: '⚔️',
    color: 'border-red-800/50',
    labelColor: 'text-red-400',
    cta: 'Coming Soon',
  },
];

export default function EcosystemApps({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">The Ecosystem</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <p className="text-slate-400 text-sm">
            Prophet Gad's message extends across four platforms. The music is just the beginning.
          </p>

          {APPS.map(app => (
            <div key={app.id} className={`bg-slate-800/60 border ${app.color} rounded-xl p-5`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{app.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-white text-lg">{app.name}</h3>
                    <span className={`text-xs font-semibold ${app.labelColor}`}>{app.tagline}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{app.description}</p>
                  {app.url ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-800/60 hover:bg-amber-700/80 border border-amber-700/40 text-amber-300 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {app.cta} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-slate-700/60 border border-slate-600/40 text-slate-500 text-sm font-semibold px-4 py-2 rounded-lg">
                      {app.cta}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}