import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { ListMusic } from 'lucide-react';
import { PlayerProvider, usePlayer } from './components/music/PlayerContext';
import MusicPlayer from './components/music/MusicPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import NavArrow from './components/NavArrow';

function LayoutContent({ children, currentPageName }) {
  const { currentTrack } = usePlayer();
  const [lang, setLang] = useState(() => localStorage.getItem('pg_lang') || 'English');
  useEffect(() => { localStorage.setItem('pg_lang', lang); }, [lang]);

  const navItems = [
    { name: 'MusicLibrary', label: 'Music', icon: null },
    { name: 'EbookStore', label: 'E-Books', icon: null },
    { name: 'Playlists', label: 'Playlists', icon: ListMusic },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 relative">
        <div className="absolute top-2 right-3 z-50">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[120px] h-8 text-xs border-[#7a1f30]/30 text-[#7a1f30]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Creole">Creole</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 h-20">
            <div className="flex items-center gap-6 font-bold text-xl flex-1">
              {/* Lion Logo - Left */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/721a8b40d_Lionlogo7a.png" 
                alt="Lion of Judah" 
                className="w-20 h-20 object-contain"
              />
              
              {/* Center Title - Takes full width */}
              <div className="flex flex-col leading-tight flex-1 text-center">
                <span className="font-black tracking-tight text-2xl" style={{color: '#7a1f30'}}>
                  Prophet Gad Music Catalog
                </span>
                <span className="text-[0.5rem] font-bold tracking-widest uppercase text-white px-2 py-0.5 rounded-full self-center" style={{backgroundColor: '#7a1f30'}}>BETA</span>
                <span className="text-[0.5rem] tracking-[0.2em] uppercase text-slate-500 mt-0.5">
                  Thread Bear Music &mdash; Remnant Seed LLC
                </span>
              </div>

              {/* Breastplate - Right */}
              <img 
                src="https://media.base44.com/images/public/698ae99a8f13115b248081e9/c086b78e9_Breastplatelogo2.png" 
                alt="High Priest Breastplate" 
                className="w-20 h-20 object-contain"
              />
            </div>


          </div>
        </div>
      </nav>

      <main className={currentTrack ? 'pb-24' : ''}>{children}</main>
      <NavArrow />
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