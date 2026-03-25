import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { ListMusic } from 'lucide-react';
import { PlayerProvider, usePlayer } from './components/music/PlayerContext';
import MusicPlayer from './components/music/MusicPlayer';

function LayoutContent({ children, currentPageName }) {
  const { currentTrack } = usePlayer();

  const navItems = [
    { name: 'MusicLibrary', label: 'Music', icon: null },
    { name: 'EbookStore', label: 'E-Books', icon: null },
    { name: 'Playlists', label: 'Playlists', icon: ListMusic },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative"
      style={{
        outline: '1px solid rgba(212,175,55,0.55)',
        outlineOffset: '4px',
        boxShadow: '0 0 0 1px rgba(212,175,55,0.25), 0 0 0 3px rgba(212,175,55,0.08), inset 0 0 0 1px rgba(212,175,55,0.12)'
      }}
    >
      <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 h-20">
            <div className="flex items-center gap-6 font-bold text-xl flex-1">
              {/* Lion Logo - Left */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/193326470_Lionlogo7.png" 
                alt="Lion of Judah" 
                className="w-20 h-20 object-contain"
              />
              
              {/* Center Title - Takes full width */}
              <div className="flex flex-col leading-tight flex-1 text-center">
                <span className="font-black tracking-tight text-4xl" style={{color: '#D4AF37'}}>
                  Prophet Gad Music
                </span>
              </div>

              {/* Breastplate - Right */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/8b6d2b2f8_Breastplatelogo2.png" 
                alt="High Priest Breastplate" 
                className="w-16 h-16 object-contain"
              />
            </div>


          </div>
        </div>
      </nav>

      <main className={currentTrack ? 'pb-24' : ''}>{children}</main>
      <MusicPlayer />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <PlayerProvider>
      <LayoutContent currentPageName={currentPageName}>
        {children}
      </LayoutContent>
    </PlayerProvider>
  );
}