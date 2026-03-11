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
          <div className="flex items-center gap-8 h-16">
            <div className="flex items-center gap-4 font-bold text-xl">
              {/* Lion of Judah placeholder - will be replaced with actual image */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center shadow-md">
                <span className="text-white text-2xl">🦁</span>
              </div>
              
              <div className="flex flex-col leading-tight">
                <span className="bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent font-extrabold tracking-tight text-2xl">
                  Prophet Gad Music
                </span>
                <span className="text-sm font-normal text-slate-400 tracking-wide">
                  Thread Bear Music · Remnant Seed LLC
                </span>
              </div>

              {/* Breastplate placeholder - will be replaced with actual image */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center shadow-md">
                <span className="text-white text-2xl">💎</span>
              </div>
            </div>

            <div className="flex gap-1 ml-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400 font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                );
              })}
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