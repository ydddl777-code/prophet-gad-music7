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
            In the spirit of ancient Hebrew seers, Prophet Gad has emerged as a prophetic voice for this generation. Born in a Caribbean nation rooted in biblical tradition, he was consecrated at age four and sent to the U.S. in secret for protection, where he was raised and educated in New York. Bearing the mantle of the biblical Prophet Gad, his life has mirrored the trials of the prophets of old, marked by exile and miraculous returns. Now, he delivers an urgent and uncompromising message: <strong className="text-red-500">repent or die.</strong>
          </p>
          <p className="text-slate-500 text-sm italic border-l-2 border-slate-700 pl-4">
            More details coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}