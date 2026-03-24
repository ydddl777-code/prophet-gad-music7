import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function DuplicateManager() {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState(null);
  const [result, setResult] = useState(null);
  const queryClient = useQueryClient();

  const findDuplicates = async () => {
    setLoading(true);
    setResult(null);
    const res = await base44.functions.invoke('findDuplicateTracks', { action: 'find' });
    setGroups(res.data?.duplicate_groups || []);
    setLoading(false);
  };

  const resolveAll = async () => {
    if (!confirm('This will rename different-duration versions (V1, V2...) and hide exact duplicates. Continue?')) return;
    setLoading(true);
    const res = await base44.functions.invoke('findDuplicateTracks', { action: 'resolve' });
    setResult(res.data);
    setGroups(null);
    queryClient.invalidateQueries({ queryKey: ['music-tracks'] });
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-bold text-sm">🔍 Duplicate Track Manager</h3>
          <p className="text-slate-500 text-xs mt-0.5">Find tracks with the same name and auto-resolve them</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={findDuplicates} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan for Duplicates'}
          </Button>
          {groups?.length > 0 && (
            <Button size="sm" className="bg-amber-700 hover:bg-amber-600 text-white" onClick={resolveAll} disabled={loading}>
              Auto-Resolve All
            </Button>
          )}
        </div>
      </div>

      {groups !== null && groups.length === 0 && (
        <p className="text-green-500 text-sm">✅ No duplicates found!</p>
      )}

      {groups?.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <p className="text-amber-400 text-xs font-semibold">{groups.length} duplicate groups found:</p>
          {groups.map(({ title, tracks }) => (
            <div key={title} className="bg-slate-800 rounded p-3">
              <p className="text-white text-xs font-bold mb-1">"{title}" — {tracks.length} copies</p>
              <div className="space-y-1">
                {tracks.map(t => (
                  <div key={t.id} className="flex justify-between text-xs text-slate-400">
                    <span>{t.title}</span>
                    <span className="text-slate-600">{t.duration || 'no duration'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="bg-slate-800 rounded p-3">
          <p className="text-green-400 text-sm font-semibold mb-1">✅ Resolved {result.total_changes} tracks</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {result.changes?.map((c, i) => (
              <p key={i} className="text-xs text-slate-400">
                {c.action === 'renamed'
                  ? `📝 "${c.old_title}" → "${c.new_title}"`
                  : `🗂 "${c.title}" marked dormant`}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}