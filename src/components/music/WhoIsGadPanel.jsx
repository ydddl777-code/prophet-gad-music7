import React from 'react';
import { X } from 'lucide-react';

export default function WhoIsGadPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-amber-800/50 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-xl font-bold text-amber-400">Who Is Prophet Gad?</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 text-slate-300 text-base leading-relaxed">
          <p>
            Prophet Gad is not a pastor, a preacher, or the leader of a ministry. He is a composer — 
            a Hebrew Israelite watchman who records prophetic messages set to rhythm. His compositions 
            are oracles: warnings, lamentations, and calls to repentance delivered through music in the 
            tradition of the ancient seers of Israel.
          </p>
          <p>
            Born in the Caribbean and consecrated at age four, he was brought to New York in secret 
            and raised there. He carries the mantle of the biblical Prophet Gad — David's seer — and 
            his life has mirrored the trials of the prophets of old: exile, opposition, and miraculous 
            return. He does not ask for followers. He does not seek a congregation. His message is simple: 
            <strong className="text-red-400"> repent or perish.</strong>
          </p>
          <p>
            If these songs speak to you, good. If not, they are not for you — and that is perfectly fine. 
            This is not entertainment. This is a warning. Over 600 compositions have been recorded, each 
            one a prophetic word set to Bachata, Kompa, Gospel, Reggae, and more — because the message 
            must reach all nations, in every tongue, through every rhythm.
          </p>
          <p className="text-amber-500/80 text-sm italic border-l-2 border-amber-700/50 pl-4">
            "The lion has roared — who will not fear? The Lord God has spoken — who can but prophesy?" 
            — Amos 3:8
          </p>
        </div>
      </div>
    </div>
  );
}