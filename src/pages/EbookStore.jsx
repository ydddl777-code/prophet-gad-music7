import React from 'react';
import { useNavigate } from 'react-router-dom';

const EBOOKS = [
  {
    id: 'remnant-vol-1',
    subtitle: 'The Frequency of Babylon',
    fullTitle: 'No Contemporary Praise Music for the Israelites',
    tagline: 'When worship became performance and the altar became a stage',
    price: 18.98,
    controversial: true
  },
  {
    id: 'remnant-vol-2',
    subtitle: 'No Dogs for the Israelites',
    fullTitle: 'No Dogs for the Israelites',
    tagline: 'The snare of displaced intimacy and the idolatry of the creature',
    price: 18.98,
    controversial: true
  },
  {
    id: 'remnant-vol-3',
    subtitle: "The King's Table",
    fullTitle: "No King's Meat for the Israelites",
    tagline: "Daniel's resolve and the divine wisdom of biblical dietary law",
    price: 9.89
  },
  {
    id: 'remnant-vol-4',
    subtitle: 'The Debt Trap',
    fullTitle: 'No False Wisdom for the Israelites',
    tagline: "The borrower is servant to the lender — breaking free from Babylon's schools",
    price: 9.89
  },
  {
    id: 'twelve-tribes',
    subtitle: 'Our Forefathers & Their Seed',
    fullTitle: 'The Twelve Tribes of Israel',
    tagline: 'The apple of His eye — a heritage for every generation',
    price: 0
  },
  {
    id: 'eternal-oracle',
    subtitle: 'A Chosen People',
    fullTitle: 'The Eternal Oracle',
    tagline: 'Always the same — if He chose then, He chooses now',
    price: 38.98
  }
];

function EbookCover({ book }) {
  const volMatch = book.id.match(/vol-(\d+)/);
  const volNum = volMatch ? ['I', 'II', 'III', 'IV'][parseInt(volMatch[1]) - 1] : null;

  const priceLabel = book.price === 0 ? 'FREE' : `$${book.price % 1 === 0 ? book.price : book.price.toFixed(2)}`;

  return (
    <div className="w-[180px] h-[270px] relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#180a08] to-[#0a0a0a]">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at 50% 20%, rgba(180,20,20,0.15) 0%, transparent 60%)'}} />
      </div>
      <div className="absolute inset-1 border border-[#D4AF37]" />
      <div className="absolute inset-[5px] border border-[#D4AF37]/40" />
      <div className="absolute inset-[9px] border border-[rgba(180,30,30,0.45)]" />
      <div className="absolute inset-[11px] flex flex-col items-center justify-between text-center overflow-hidden py-1">
        <div className="w-full shrink-0">
          <div className="text-[0.35rem] tracking-[0.25em] uppercase text-[rgba(212,175,55,0.35)] leading-tight">Remnant Warning</div>
          {volNum ? (
            <div className="text-[0.38rem] tracking-[0.2em] uppercase text-[rgba(200,50,50,0.85)] mt-0.5 font-bold">Volume {volNum}</div>
          ) : (
            <div className="text-[0.35rem] tracking-[0.2em] uppercase text-[rgba(212,175,55,0.4)] mt-0.5">Special Edition</div>
          )}
        </div>
        <div className="w-[35px] h-px shrink-0" style={{background: 'linear-gradient(to right, transparent, #D4AF37, transparent)'}} />
        <div className="text-[0.34rem] tracking-[0.12em] uppercase leading-tight shrink-0" style={{color: 'rgba(200,60,60,0.9)'}}>
          {book.subtitle}
        </div>
        <div className="px-1 w-full shrink-0">
          <div className="text-[0.58rem] font-black text-[#D4AF37] leading-snug tracking-wide">
            {book.fullTitle}
          </div>
        </div>
        <div className="w-[35px] h-px shrink-0" style={{background: 'linear-gradient(to right, transparent, rgba(180,30,30,0.6), transparent)'}} />
        <div className="px-1 w-full shrink-0">
          <div className="text-[0.3rem] italic text-[rgba(245,240,225,0.38)] leading-tight">
            {book.tagline}
          </div>
        </div>
        <div className="w-full shrink-0">
          <div className="w-[28px] h-px mx-auto mb-1" style={{background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)'}} />
          <span className="text-[0.32rem] tracking-[0.18em] uppercase text-[#D4AF37]">Prophet Gad</span>
        </div>
      </div>
      {/* CONTROVERSIAL diagonal stamp — only on controversial books */}
      {book.controversial && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{transform: 'rotate(-32deg)'}}>
          <div className="flex flex-col items-center">
            <span className="text-[0.6rem] font-black tracking-[0.22em] uppercase text-white/90" style={{whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)'}}>CONTROVERSIAL</span>
            <span className="text-[0.5rem] font-bold tracking-[0.18em] uppercase text-white/70" style={{whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)'}}>DOCTRINE</span>
          </div>
        </div>
      )}
      {/* Price badge */}
      <div className={`absolute top-2 right-2 z-20 font-black text-[0.55rem] px-1.5 py-0.5 rounded ${book.price === 0 ? 'bg-green-500 text-white' : 'bg-amber-500 text-black'}`}>
        {priceLabel}
      </div>
    </div>
  );
}

export default function EbookStore() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0a0a0a] border-y border-amber-500/20 py-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        {/* Author box — left of books */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-[90px] h-[120px] rounded-lg overflow-hidden border border-amber-500/40 shadow-lg">
            <img
              src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/4ce5d0e0a_prophet-suit.jpg"
              alt="Author"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-amber-400/80 mt-1">Author</p>
        </div>

        {/* Books panel — right */}
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h2 className="text-xl font-black tracking-wider" style={{color: '#D4AF37'}}>Remnant Warning E-Books</h2>
            <p className="text-xs text-white/60 tracking-wider uppercase">Instant Download</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{scrollbarWidth: 'none'}}>
            {EBOOKS.map(book => (
              <div key={book.id} className="flex-shrink-0 cursor-pointer"
                onClick={() => navigate('/ComingSoon')}>
                <EbookCover book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}