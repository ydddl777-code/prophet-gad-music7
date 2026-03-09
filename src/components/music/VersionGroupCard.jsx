import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import TrackCard from './TrackCard';

export default function VersionGroupCard({ groupName, tracks, onUpdate, onDelete, onPlay, isAdmin = false }) {
  const [expanded, setExpanded] = useState(false);
  
  // Sort to show best version first
  const sortedTracks = [...tracks].sort((a, b) => {
    if (a.is_best_version) return -1;
    if (b.is_best_version) return 1;
    return 0;
  });
  
  const bestVersion = sortedTracks.find(t => t.is_best_version) || sortedTracks[0];
  
  return (
    <div className="space-y-2">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {tracks.length}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{groupName}</h3>
                  <p className="text-sm text-slate-600">
                    {tracks.length} version{tracks.length !== 1 ? 's' : ''} • 
                    Best: {bestVersion.artist || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-2"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {expanded && (
        <div className="ml-4 space-y-2 border-l-2 border-slate-200 pl-4">
          {sortedTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onPlay={onPlay}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
      
      {!expanded && (
        <div className="ml-4 pl-4">
          <TrackCard
            track={bestVersion}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onPlay={onPlay}
            isAdmin={isAdmin}
          />
        </div>
      )}
    </div>
  );
}