import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function AdminImport() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);

  const runImport = async (startOffset = 0) => {
    setRunning(true);
    setDone(false);
    if (startOffset === 0) setLog([]);

    let offset = startOffset;
    const batchSize = 10; // small batches to respect rate limits
    let totalImported = 0;
    let retries = 0;
    const maxRetries = 3;

    while (true) {
      try {
        const res = await base44.functions.invoke('importFromSupabase', { offset, limit: batchSize });
        const data = res.data;
        totalImported += data.imported;
        retries = 0; // reset retries on success
        setLog(prev => [...prev, `✅ offset ${offset}: imported ${data.imported}, failed ${data.failed}`]);
        if (data.failures?.length) {
          data.failures.forEach(f => setLog(prev => [...prev, `  ⚠️ ${f.title}: ${f.error}`]));
        }
        if (data.total_in_page < batchSize) break;
        offset += batchSize;
      } catch (e) {
        retries++;
        setLog(prev => [...prev, `⚠️ Error at offset ${offset} (attempt ${retries}): ${e.message}`]);
        if (retries >= maxRetries) {
          setLog(prev => [...prev, `❌ Failed after ${maxRetries} attempts at offset ${offset}. Skipping batch.`]);
          offset += batchSize; // skip this batch and continue
          retries = 0;
          // Stop if we've skipped too many
          if (offset > 700) break;
        } else {
          await new Promise(r => setTimeout(r, 3000)); // wait 3s before retry
        }
      }
    }

    setLog(prev => [...prev, `🎉 Done! Total imported this run: ${totalImported}`]);
    setDone(true);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Supabase Catalog Import</h1>
        <p className="text-slate-400 mb-6 text-sm">Imports all Prophet Gad tracks from Supabase into the music library. Run once.</p>

        <div className="flex gap-3 items-center mb-6">
          <Button
            onClick={() => runImport(0)}
            disabled={running}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            {running ? '⏳ Importing...' : '🚀 Start Full Import'}
          </Button>
          <Button
            onClick={() => {
              const offset = parseInt(prompt('Resume from offset (e.g. 100, 150, 200...):') || '0');
              if (!isNaN(offset)) runImport(offset);
            }}
            disabled={running}
            variant="outline"
            className="border-slate-600 text-slate-300 px-6 py-3 rounded-lg"
          >
            ↩️ Resume from offset
          </Button>
        </div>

        {log.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-1 max-h-96 overflow-y-auto">
            {log.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}

        {done && (
          <div className="mt-4 p-4 bg-green-900/40 border border-green-600 rounded-lg text-green-400 font-bold">
            Import complete! Go back to the <a href="/" className="underline">Music Library</a>.
          </div>
        )}
      </div>
    </div>
  );
}