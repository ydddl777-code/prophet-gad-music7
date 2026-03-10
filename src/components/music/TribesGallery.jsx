import React from 'react';

const TRIBES = [
  { name: "Judah", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/62121e8bd_JUDAH1.jpg" },
  { name: "Reuben", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/e237ef153_REUBEN1.jpg" },
  { name: "Gad", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/d759e65b4_GAD1.jpg" },
  { name: "Asher", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/a92747e62_ASHER1.jpg" },
  { name: "Naphtali", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/e92c9bb08_naphtali1.jpg" },
  { name: "Simeon", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/64a5d1c11_SIMEON1.jpg" },
  { name: "Levi", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/1b0dffc2d_LEVI1.jpeg" },
  { name: "Issachar", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/f45a1b7ad_ISSACHAR1.jpg" },
  { name: "Zebulun", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/c90a2525e_ZEBULUN1.jpg" },
  { name: "Joseph", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/fdb7d9ab4_JOSEPH1.jpg" },
  { name: "Benjamin", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ab3d8b448_BENJAMIN1.jpg" },
  { name: "Dan", url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/cdc196f14_DAN1.jpg" },
];

const GOLDEN_GATE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ddc9085d4_Gemini_Generated_Image_kkdrsjkkdrsjkkdr.png";

export default function TribesGallery() {
  return (
    <div className="relative">
      {/* Section Header with golden gate background */}
      <div className="relative overflow-hidden h-28">
        <img src={GOLDEN_GATE} alt="New Jerusalem" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">The Twelve Tribes of Israel</p>
          <h2 className="text-white text-2xl font-black tracking-wide" style={{textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
            Remnant Seed · Standing Firm
          </h2>
          <p className="text-slate-400 text-xs mt-1 italic">"He that hath an ear, let him hear what the Spirit saith" — Rev. 2</p>
        </div>
      </div>

      {/* Tribe Banners Grid */}
      <div className="bg-slate-950 py-6 px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 max-w-7xl mx-auto">
          {TRIBES.map((tribe) => (
            <div key={tribe.name} className="group relative overflow-hidden rounded-lg border border-slate-800 hover:border-amber-500/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-900/30 cursor-pointer"
              style={{ aspectRatio: '3/4' }}>
              <img
                src={tribe.url}
                alt={`Tribe of ${tribe.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <span className="text-amber-400 text-[10px] font-bold drop-shadow-lg">{tribe.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}