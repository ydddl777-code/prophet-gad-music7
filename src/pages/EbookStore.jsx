import React from 'react';

const EBOOKS = [
  {
    id: 'remnant-vol-1',
    subtitle: 'The Frequency of Babylon',
    fullTitle: 'No Contemporary Praise Music for the Israelites',
    tagline: 'When worship became performance and the altar became a stage'
  },
  {
    id: 'remnant-vol-2',
    subtitle: 'No Dogs for the Israelites',
    fullTitle: 'No Dogs for the Israelites',
    tagline: 'The snare of displaced intimacy and the idolatry of the creature'
  },
  {
    id: 'remnant-vol-3',
    subtitle: "The King's Table",
    fullTitle: "No King's Meat for the Israelites",
    tagline: "Daniel's resolve and the divine wisdom of biblical dietary law"
  },
  {
    id: 'remnant-vol-4',
    subtitle: 'The Debt Trap',
    fullTitle: 'No False Wisdom for the Israelites',
    tagline: "The borrower is servant to the lender — breaking free from Babylon's schools"
  },
  {
    id: 'twelve-tribes',
    subtitle: 'Our Forefathers & Their Seed',
    fullTitle: 'The Twelve Tribes of Israel',
    tagline: 'The apple of His eye — a heritage for every generation'
  },
  {
    id: 'eternal-oracle',
    subtitle: 'A Chosen People',
    fullTitle: 'The Eternal Oracle',
    tagline: 'Always the same — if He chose then, He chooses now'
  }
];

function EbookCover({ book }) {
  const volMatch = book.id.match(/vol-(\d+)/);
  const volNum = volMatch ? ['I', 'II', 'III', 'IV'][parseInt(volMatch[1]) - 1] : null;

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
    </div>
  );
}

export default function EbookStore() {
  return (
    <div className="bg-[#0a0a0a] border-y border-amber-500/20 py-8 px-6">
      <div className="text-center mb-6">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-red-500/70 mb-1">Doctrine They Don't Want You to Read</p>
        <h2 className="text-xl font-black tracking-wider text-white">These Books Will Offend You.</h2>
        <p className="text-sm text-slate-400 mt-2 italic">No dogs. No king's meat. No contemporary praise music. No false wisdom.<br/>Find out why — if you can handle it.</p>
        <p className="text-lg font-black text-amber-400 mt-3 uppercase" style={{letterSpacing:'0.15em'}}>prophetgad.com</p>
      </div>
      <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto pb-2 justify-center" style={{scrollbarWidth: 'none'}}>
        {EBOOKS.map(book => (
          <div key={book.id} className="flex-shrink-0 cursor-pointer" onClick={() => window.open('https://prophetgad.com', '_blank')}>
            <EbookCover book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}