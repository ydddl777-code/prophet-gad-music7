import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Loader2, X, Music2, Heart, Sparkles } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function TrackAnalysis({ track, onClose }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeTrack = async () => {
    setAnalyzing(true);
    try {
      const prompt = `You are a master musicologist and spiritual counselor. Analyze this prophetic song in depth:

Title: "${track.title}"
Artist: ${track.artist || 'Prophet Gad'}
${track.lyrics ? `Lyrics:\n${track.lyrics}` : ''}
${track.description ? `Context: ${track.description}` : ''}

Provide a comprehensive analysis covering:

1. **Musical Structure**: Chord progressions, tempo, rhythm patterns, key signature
2. **Vocal Techniques**: Delivery style, emotional tone, phrasing
3. **Lyrical Themes**: Core messages, biblical references, prophetic warnings
4. **Spiritual Impact**: How this song functions as a spiritual oracle
5. **Emotional Journey**: The emotional arc listeners experience
6. **Production Elements**: Instrumentation, layering, sonic choices
7. **Cultural Context**: Connection to Hebraic roots, reggae tradition, Dominican influences
8. **Application**: How listeners should respond to this message

Be thorough, insightful, and honor the prophetic nature of this work.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false,
        model: 'claude_sonnet_4_6' // Higher quality for deep analysis
      });

      setAnalysis(result);
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-4xl w-full shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-800 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Track Analysis</h2>
                <p className="text-sm text-slate-400">{track.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!analysis ? (
              <div className="text-center py-12">
                <Music2 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Deep Track Analysis
                </h3>
                <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                  Our AI will analyze the musical structure, lyrical themes, spiritual impact, 
                  and prophetic message of this track using advanced musicology and biblical interpretation.
                </p>
                <Button
                  onClick={analyzeTrack}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white px-8 py-6 text-lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Track...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Deep Analysis
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-4">
                  Uses advanced AI model • Higher credit usage
                </p>
              </div>
            ) : (
              <div className="prose prose-invert prose-amber max-w-none">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-amber-400 m-0">Analysis Results</h3>
                  </div>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={analyzeTrack}
                    disabled={analyzing}
                    variant="outline"
                    className="flex-1 border-amber-500/50 text-amber-400"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Re-analyzing...
                      </>
                    ) : (
                      'Re-analyze Track'
                    )}
                  </Button>
                  <Button onClick={onClose} className="flex-1 bg-slate-800">
                    Close Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}