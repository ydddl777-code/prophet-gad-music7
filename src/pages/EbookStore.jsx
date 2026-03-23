import React from 'react';

const EBOOKS = [
  {
    id: 'remnant-vol-1',
    title: 'Volume I: No Contemporary Praise Music',
    subtitle: 'The Frequency of Babylon',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No Contemporary Praise Music for the Israelites',
    tagline: 'When worship became performance and the altar became a stage'
  },
  {
    id: 'remnant-vol-2',
    title: 'Volume II: Inordinate Affection',
    subtitle: 'No Dogs for the Israelites',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No Dogs for the Israelites',
    tagline: 'The snare of displaced intimacy and the idolatry of the creature'
  },
  {
    id: 'remnant-vol-3',
    title: "Volume III: No King's Meat",
    subtitle: "The King's Table",
    price: 9.99,
    status: 'coming_soon',
    fullTitle: "No King's Meat for the Israelites",
    tagline: "Daniel's resolve and the divine wisdom of biblical dietary law"
  },
  {
    id: 'remnant-vol-4',
    title: 'Volume IV: No False Wisdom',
    subtitle: 'The Debt Trap',
    price: 9.99,
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
    price: 39.99,
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

      {/* Outer border gold */}
      <div className="absolute inset-1.5 border border-[#D4AF37]" />
      {/* Inner border red */}
      <div className="absolute inset-[9px] border border-[rgba(180,30,30,0.55)]" />

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
          <span className={`text-xs font-bold ${book.price === 0 ? 'text-green-500' : 'text-amber-400'}`}>
            {book.price === 0 ? 'Free' : `$${book.price.toFixed(2)}`}
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
          {book.price === 0 ? 'Download Free' : book.status === 'coming_soon' ? 'Coming Soon' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}

export default function EbookStore() {
  const remnantVolumes = EBOOKS.filter(b => b.id.includes('vol-'));
  const specialEditions = EBOOKS.filter(b => !b.id.includes('vol-'));

  return (
    <div className="bg-[#0a0a0a] text-white py-10 px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="text-[0.6rem] tracking-[0.4em] uppercase text-[rgba(212,175,55,0.4)] mb-2">
          Thread Bear Books · Remnant Seed LLC
        </div>
        <h1 className="text-3xl tracking-[0.2em] uppercase text-[#D4AF37] font-bold mb-2">
          Remnant Warning Series
        </h1>
        <p className="text-sm tracking-[0.15em] text-slate-500 mb-4">by Prophet Gad</p>
        <div className="inline-block text-[0.6rem] tracking-[0.15em] uppercase text-[#C4785B] border border-[rgba(196,120,91,0.3)] px-4 py-2 mb-3">
          Books in Development
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
          These covers represent the current design direction for the Remnant Warning series. Final editions are being revised and expanded.
        </p>
      </div>

      <div className="w-[120px] h-px mx-auto my-8" style={{background: 'linear-gradient(to right, transparent, #D4AF37, transparent)'}} />

      {/* Volumes I–IV */}
      <div className="text-center text-[0.7rem] tracking-[0.3em] uppercase text-[rgba(212,175,55,0.5)] mb-8">
        The Four Warnings · Volumes I – IV
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12 justify-items-center">
        {remnantVolumes.map(book => (
          <EbookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="w-[120px] h-px mx-auto my-8" style={{background: 'linear-gradient(to right, transparent, #D4AF37, transparent)'}} />

      {/* Special Editions */}
      <div className="text-center text-[0.7rem] tracking-[0.3em] uppercase text-[rgba(212,175,55,0.5)] mb-8">
        Special Editions
      </div>
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-12 justify-items-center">
        {specialEditions.map(book => (
          <EbookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="w-[120px] h-px mx-auto my-8" style={{background: 'linear-gradient(to right, transparent, #D4AF37, transparent)'}} />

      {/* Footer */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-slate-600 leading-relaxed">
          All titles are currently in development. Covers shown are design placeholders. Interior content is being revised prior to final publication. Pricing is subject to change.
        </p>
        <div className="text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(212,175,55,0.25)] mt-4">
          Thread Bear Books · Remnant Seed LLC · Prophet Gad
        </div>
      </div>
    </div>
  );
}