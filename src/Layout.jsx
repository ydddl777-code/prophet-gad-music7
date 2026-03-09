import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Music2, ListMusic } from 'lucide-react';
import { PlayerProvider, usePlayer } from './components/music/PlayerContext';
import MusicPlayer from './components/music/MusicPlayer';

function LayoutContent({ children, currentPageName }) {
  const { currentTrack } = usePlayer();

  const navItems = [
    { name: 'MusicLibrary', label: 'Library', icon: Music2 },
    { name: 'Playlists', label: 'Playlists', icon: ListMusic },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 h-16">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MusicHub
              </span>
            </div>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
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