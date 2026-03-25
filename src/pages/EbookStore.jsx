import React from 'react';

const EBOOKS = [
  {
    id: 'remnant-vol-1',
    title: 'Volume I: No Contemporary Praise Music',
    subtitle: 'The Frequency of Babylon',
    price: 18.89,
    status: 'coming_soon',
    fullTitle: 'No Contemporary Praise Music for the Israelites',
    tagline: 'When worship became performance and the altar became a stage'
  },
  {
    id: 'remnant-vol-2',
    title: 'Volume II: Inordinate Affection',
    subtitle: 'No Dogs for the Israelites',
    price: 18.89,
    status: 'coming_soon',
    fullTitle: 'No Dogs for the Israelites',
    tagline: 'The snare of displaced intimacy and the idolatry of the creature'
  },
  {
    id: 'remnant-vol-3',
    title: "Volume III: No King's Meat",
    subtitle: "The King's Table",
    price: 18.89,
    status: 'coming_soon',
    fullTitle: "No King's Meat for the Israelites",
    tagline: "Daniel's resolve and the divine wisdom of biblical dietary law"
  },
  {
    id: 'remnant-vol-4',
    title: 'Volume IV: No False Wisdom',
    subtitle: 'The Debt Trap',
    price: 18.89,
    status: 'coming_soon',
    fullTitle: 'No False Wisdom for the Israelites',
    tagline: "The borrower is servant to the lender — breaking free from Babylon's schools"
  },
  {
    id: 'twelve-tribes',
    title: 'The Twelve Tribes of Israel',
    subtitle: 'Our Forefathers & Their Seed',
    price: 0,
    status: 'available',
    fullTitle: 'The Twelve Tribes of Israel',
    tagline: 'The apple of His eye — a heritage for every generation',
    downloadUrl: 'https://media.base44.com/files/public/698ae99a8f13115b248081e9/0776f5a8f_twelve_tribes_ebook_v2.pdf'
  },
  {
    id: 'eternal-oracle',
    title: 'The Eternal Oracle',
    subtitle: 'A Chosen People',
    price: 38.89,
    status: 'coming_soon',
    fullTitle: 'The Eternal Oracle',
    tagline: 'Always the same — if He chose then, He chooses now'
  }
];

function EbookCover({ book }) {
  const volMatch = book.id.match(/vol-(\d+)/);
  const volNum = volMatch ? ['I', 'II', 'III', 'IV'][parseInt(volMatch[1]) - 1] : null;

  return (
    <div className="w-[180px] h-[270px] relative overflow-hidden flex-shrink-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#180a08] to-[#0a0a0a]">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at 50% 20%, rgba(180,20,20,0.15) 0%, transparent 60%)'}} />
      </div>

      {/* Double gold outer border */}
      <div className="absolute inset-1 border border-[#D4AF37]" />
      <div className="absolute inset-[5px] border border-[#D4AF37]/40" />
      {/* Inner accent border */}
      <div className="absolute inset-[9px] border border-[rgba(180,30,30,0.45)]" />

      {/* Content — strictly clipped inside borders */}
      <div className="absolute inset-[11px] flex flex-col items-center justify-between text-center overflow-hidden py-1">

        {/* Top label */}
        <div className="w-full shrink-0">
          <div className="text-[0.35rem] tracking-[0.25em] uppercase text-[rgba(212,175,55,0.35)] leading-tight">Remnant Warning</div>
          {volNum ? (
            <div className="text-[0.38rem] tracking-[0.2em] uppercase text-[rgba(200,50,50,0.85)] mt-0.5 font-bold">Volume {volNum}</div>
          ) : (
            <div className="text-[0.35rem] tracking-[0.2em] uppercase text-[rgba(212,175,55,0.4)] mt-0.5">Special Edition</div>
          )}
        </div>

        {/* Gold divider */}
        <div className="w-[35px] h-px shrink-0" style={{background: 'linear-gradient(to right, transparent, #D4AF37, transparent)'}} />

        {/* Subtitle red */}
        <div className="text-[0.34rem] tracking-[0.12em] uppercase leading-tight shrink-0" style={{color: 'rgba(200,60,60,0.9)'}}>
          {book.subtitle}
        </div>

        {/* Main title */}
        <div className="px-1 w-full shrink-0">
          <div className="text-[0.58rem] font-black text-[#D4AF37] leading-snug tracking-wide">
            {book.fullTitle}
          </div>
        </div>

        {/* Red divider */}
        <div className="w-[35px] h-px shrink-0" style={{background: 'linear-gradient(to right, transparent, rgba(180,30,30,0.6), transparent)'}} />

        {/* Tagline */}
        <div className="px-1 w-full shrink-0">
          <div className="text-[0.3rem] italic text-[rgba(245,240,225,0.38)] leading-tight">
            {book.tagline}
          </div>
        </div>

        {/* Author */}
        <div className="w-full shrink-0">
          <div className="w-[28px] h-px mx-auto mb-1" style={{background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)'}} />
          <span className="text-[0.32rem] tracking-[0.18em] uppercase text-[#D4AF37]">Prophet Gad</span>
        </div>
      </div>
    </div>
  );
}

function EbookCard({ book }) {
  const handlePurchase = () => {
    if (book.status === 'available' && book.price === 0 && book.downloadUrl) {
      window.open(book.downloadUrl, '_blank');
      return;
    }
    if (book.status === 'coming_soon') {
      alert('This e-book is coming soon. Pre-orders will be available shortly.');
      return;
    }
    alert('Purchase flow coming soon');
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <EbookCover book={book} />
      <div className="text-center w-[180px]">
        <h3 className="text-[0.65rem] font-bold text-white mb-1 leading-tight">{book.title}</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-bold text-amber-400">
            {book.price === 0 ? '' : `$${book.price.toFixed(2)}`}
          </span>
          {book.status === 'coming_soon' && (
            <span className="text-[0.45rem] tracking-wider uppercase px-1.5 py-0.5 border border-slate-700 text-slate-500">Soon</span>
          )}
        </div>
        <button
          onClick={handlePurchase}
          disabled={book.status === 'coming_soon'}
          className={`w-full text-xs py-1.5 rounded font-semibold transition-all ${
            book.status === 'coming_soon'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white'
          }`}
        >
          {book.price === 0 ? 'Free Download' : book.status === 'coming_soon' ? 'Coming Soon' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}

export default function EbookStore() {
  return (
    <div className="bg-[#0a0a0a] border-y border-amber-500/20 py-8 px-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 mb-1">
          <div className="h-px w-12 bg-amber-500/40" />
          <div className="h-px w-12 bg-amber-500/40" />
        </div>
        <h2 className="text-xl font-black tracking-wider text-white">Remnant Warning Books</h2>
        <p className="text-[0.6rem] text-slate-600 mt-1 tracking-widest uppercase">Coming Soon · Books in Development</p>
      </div>

      {/* Books row with Prophet image on left */}
      <div className="max-w-7xl mx-auto flex items-start gap-6">
        {/* Prophet Gad image on left */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-28 h-40 rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-lg shadow-amber-900/30">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/9cab1d068_Superheropoisedinelegantdiningroom.png"
              alt="Author"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <p className="text-[0.5rem] tracking-[0.2em] uppercase text-amber-500/60">Professor Gad:</p>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-2" style={{scrollbarWidth: 'none'}}>
          {EBOOKS.map(book => (
            <EbookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}