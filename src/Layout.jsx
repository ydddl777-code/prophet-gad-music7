import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { ListMusic } from 'lucide-react';
import { PlayerProvider, usePlayer } from './components/music/PlayerContext';
import MusicPlayer from './components/music/MusicPlayer';

function LayoutContent({ children, currentPageName }) {
  const { currentTrack } = usePlayer();

  const navItems = [
    { name: 'MusicLibrary', label: 'Home', icon: null },
    { name: 'Playlists', label: 'Playlists', icon: ListMusic },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 h-20">
            <div className="flex items-center gap-6 font-bold text-xl flex-1">
              {/* Lion of Judah - Left */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/4626fed3d_1_The-Majesty-of-the-3D-Golden-Lion-Head.png" 
                alt="Lion of Judah" 
                className="w-16 h-16 object-contain"
              />
              
              {/* Center Title - Takes full width */}
              <div className="flex flex-col leading-tight flex-1 text-center">
                <span className="bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent font-extrabold tracking-tight text-3xl">
                  Prophet Gad Music
                </span>
                <span className="text-sm font-normal text-slate-400 tracking-wide">
                  Thread Bear Music · Remnant Seed LLC
                </span>
              </div>

              {/* Breastplate - Right */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/05ff83552_BreastplateButton.png" 
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