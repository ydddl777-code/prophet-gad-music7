import React from 'react';

export default function BookCoversGallery() {
  const books = [
    { id: 1, title: "Book 1: Repent or Die", color: '#8b0000', position: 'top-left' },
    { id: 2, title: "Book 2: Last Warning", color: '#a00000', position: 'top-center' },
    { id: 3, title: "Book 3: Final Hour", color: '#c41e3a', position: 'top-right' },
    { id: 4, title: "Book 4: Judgment", color: '#9d0208', position: 'bottom-left' },
    { id: 5, title: "Book 5: Awakening", color: '#b41c27', position: 'bottom-center' },
    { id: 6, title: "Book 6: Remnant", color: '#7d0a0a', position: 'bottom-right' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Book Covers Gallery</h1>
      <p className="text-slate-400 text-center mb-10">Right-click any cover → Save image as to download as PNG</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {books.map((book) => (
          <div key={book.id} className="flex flex-col items-center">
            {/* Book Cover */}
            <div
              className="w-64 h-96 rounded-lg shadow-2xl border-2 border-amber-700 flex flex-col justify-between p-6 overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${book.color}dd 0%, ${book.color} 50%, #1a1a1a 100%)`,
              }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600/40" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4 text-amber-400/80">📖</div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                    {book.title.split(':')[0]}
                  </h2>
                  <p className="text-sm text-amber-200/70 mt-3 font-semibold tracking-wider">
                    {book.title.split(':')[1]}
                  </p>
                </div>

                {/* Bottom decorative */}
                <div className="mt-auto pt-4 border-t border-amber-600/30">
                  <p className="text-xs text-amber-300/60 text-center">Prophet Gad</p>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-600/10 rounded-full blur-xl" />
            </div>

            {/* Title below */}
            <p className="text-center text-white text-sm mt-4 font-semibold">{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}