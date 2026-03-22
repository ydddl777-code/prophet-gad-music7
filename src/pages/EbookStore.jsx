import React from 'react';
import { ShoppingCart, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EBOOKS = [
  {
    id: 'remnant-vol-1',
    title: 'Volume I: No Contemporary Praise Music',
    subtitle: 'The Frequency of Babylon',
    description: 'A prophetic examination of modern worship culture and its departure from Scripture-ordained music',
    accentColor: '#9B72AA',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No Contemporary Praise Music for the Israelites',
    tagline: 'When worship became performance and the altar became a stage'
  },
  {
    id: 'remnant-vol-2',
    title: 'Volume II: Inordinate Affection',
    subtitle: 'No Dogs for the Israelites',
    description: 'A biblical case against pet culture as spiritual compromise and financial bondage',
    accentColor: '#C4785B',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No Dogs for the Israelites',
    tagline: 'The snare of displaced intimacy and the idolatry of the creature'
  },
  {
    id: 'remnant-vol-3',
    title: 'Volume III: No King\'s Meat',
    subtitle: 'The King\'s Table',
    description: 'Health sovereignty through ancient dietary wisdom — the Daniel precedent for modern believers',
    accentColor: '#5B8AC4',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No King\'s Meat for the Israelites',
    tagline: 'Daniel\'s resolve and the divine wisdom of biblical dietary law'
  },
  {
    id: 'remnant-vol-4',
    title: 'Volume IV: No False Wisdom',
    subtitle: 'The Debt Trap',
    description: 'University indoctrination and student debt as instruments of modern bondage',
    accentColor: '#D4AF37',
    price: 9.99,
    status: 'coming_soon',
    fullTitle: 'No False Wisdom for the Israelites',
    tagline: 'The borrower is servant to the lender — breaking free from Babylon\'s schools'
  },
  {
    id: 'twelve-tribes',
    title: 'The Twelve Tribes of Israel',
    subtitle: 'Our Forefathers & Their Seed',
    description: 'Heritage collection — from the patriarchs to the remnant seed. A family book for the coffee table and the soul.',
    accentColor: '#9B72AA',
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
    description: 'The Gad Book — the complete prophetic narrative from before time began to the fulfillment of Daniel 12:4',
    accentColor: '#C4785B',
    price: 39.99,
    status: 'coming_soon',
    fullTitle: 'The Eternal Oracle',
    tagline: 'Always the same — if He chose then, He chooses now'
  }
];

function EbookCover({ book }) {
  return (
    <div className="w-[260px] h-[390px] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#1a1510] to-[#0d0d0d]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.05)_0%,transparent_60%)]" />
      </div>

      {/* Double borders */}
      <div className="absolute inset-2 border-[1.5px] border-[#D4AF37]" />
      <div className="absolute inset-[14px] border border-[rgba(212,175,55,0.4)]" />

      {/* Content */}
      <div className="absolute inset-5 flex flex-col items-center justify-center text-center z-10">
        <div className="text-[0.45rem] tracking-[0.3em] uppercase text-[rgba(212,175,55,0.3)] mb-1">
          Remnant Warning
        </div>
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1.5" />
        <div className="text-[0.5rem] tracking-[0.25em] uppercase text-[rgba(212,175,55,0.45)] mt-1">
          {book.id.includes('vol-') ? `Volume ${book.id.split('-')[2].toUpperCase()}` : 'Special Edition'}
        </div>
        <div
          className="text-[0.5rem] tracking-[0.2em] uppercase my-1"
          style={{ color: book.accentColor }}
        >
          {book.subtitle}
        </div>
        <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1.5" />
        <div className="text-[1rem] font-bold text-[#D4AF37] leading-tight my-1.5">
          {book.fullTitle.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {word}
              {i < book.fullTitle.split(' ').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1.5" />
        <div className="font-serif italic text-[0.6rem] text-[rgba(245,240,225,0.45)] leading-relaxed max-w-[200px] mt-1">
          {book.tagline}
        </div>

        {/* Author at bottom */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <div className="w-[50px] h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent mx-auto mb-1.5" />
          <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#D4AF37]">
            Prophet Gad
          </span>
        </div>
      </div>
    </div>
  );
}

function EbookCard({ book }) {
  const handlePurchase = async () => {
    if (book.status === 'available' && book.price === 0 && book.downloadUrl) {
      window.open(book.downloadUrl, '_blank');
      return;
    }

    if (book.status === 'coming_soon') {
      alert('This e-book is coming soon. Pre-orders will be available shortly.');
      return;
    }

    // Future: Stripe checkout for paid books
    alert('Purchase flow coming soon');
  };

  return (
    <div className="flex flex-col items-center">
      <EbookCover book={book} />
      <div className="mt-4 text-center max-w-[260px]">
        <h3 className="text-sm font-bold text-white mb-1">{book.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{book.description}</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className={`text-sm font-bold ${book.price === 0 ? 'text-green-500' : 'text-amber-400'}`}>
            {book.price === 0 ? 'Free Download' : `$${book.price.toFixed(2)}`}
          </span>
          {book.status === 'coming_soon' && (
            <span className="text-[0.5rem] tracking-wider uppercase px-2 py-1 border border-slate-700 text-slate-500">
              Coming Soon
            </span>
          )}
        </div>
        <Button
          onClick={handlePurchase}
          variant={book.status === 'available' ? 'default' : 'outline'}
          size="sm"
          className="w-full gap-2"
          disabled={book.status === 'coming_soon'}
        >
          {book.price === 0 ? (
            <>
              <Download className="w-4 h-4" /> Download Free
            </>
          ) : book.status === 'coming_soon' ? (
            <>
              <Clock className="w-4 h-4" /> Coming Soon
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Purchase
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function EbookStore() {
  const remnantVolumes = EBOOKS.filter(b => b.id.includes('vol-'));
  const specialEditions = EBOOKS.filter(b => !b.id.includes('vol-'));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="text-[0.6rem] tracking-[0.4em] uppercase text-[rgba(212,175,55,0.4)] mb-2">
          Thread Bear Books · Remnant Seed LLC
        </div>
        <h1 className="text-3xl tracking-[0.2em] uppercase text-[#D4AF37] font-bold mb-2">
          Remnant Warning Series
        </h1>
        <p className="text-sm tracking-[0.15em] text-slate-500 mb-5">by Prophet Gad</p>
        <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[rgba(212,175,55,0.3)] mb-5">
          Published under Thread Bear Books
        </div>
        <div className="inline-block text-[0.6rem] tracking-[0.15em] uppercase text-[#C4785B] border border-[rgba(196,120,91,0.3)] px-4 py-2 mb-3">
          Books in Development
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
          These covers represent the current design direction for the Remnant Warning series. Final editions are being revised and expanded. Cover artwork and interior content are subject to change before publication.
        </p>
      </div>

      <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-8" />

      {/* Remnant Warning Volumes */}
      <div className="text-center text-[0.7rem] tracking-[0.3em] uppercase text-[rgba(212,175,55,0.5)] mb-8">
        The Four Warnings · Volumes I – IV
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto mb-12">
        {remnantVolumes.map(book => (
          <EbookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-8" />

      {/* Special Editions */}
      <div className="text-center text-[0.7rem] tracking-[0.3em] uppercase text-[rgba(212,175,55,0.5)] mb-8">
        Special Editions
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto mb-12">
        {specialEditions.map(book => (
          <EbookCard key={book.id} book={book} />
        ))}
      </div>

      <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-8" />

      {/* Footer */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs text-slate-600 leading-relaxed">
          All titles are currently in development. Covers shown are design placeholders representing the intended visual direction for each volume. Interior content is being revised, expanded, and fact-checked prior to final publication. Pricing is subject to change. Available for pre-order soon.
        </p>
        <div className="text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(212,175,55,0.25)] mt-4">
          Thread Bear Books · Remnant Seed LLC · Prophet Gad
        </div>
      </div>
    </div>
  );
}