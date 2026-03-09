import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, X, Sparkles, Loader2, Plus, XCircle } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MetadataEditor({ track, onSave, onCancel }) {
  const [editData, setEditData] = useState(track);
  const [newTag, setNewTag] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);

  const handleAIAutoFill = async () => {
    setAiProcessing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this music track and fill in missing metadata:
        
Current data:
- Title: ${editData.title || 'Unknown'}
- Artist: ${editData.artist || 'Unknown'}
- Album: ${editData.album || 'Unknown'}
- Genre: ${editData.genre || 'Unknown'}
- Year: ${editData.year || 'Unknown'}

Based on the title and artist, provide:
1. Best guess for missing fields
2. Appropriate genre classification
3. Estimated release year if missing
4. Relevant tags (e.g., mood, style, era)

Return enhanced metadata.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            artist: { type: "string" },
            album: { type: "string" },
            genre: { type: "string" },
            year: { type: "number" },
            tags: { 
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setEditData({
        ...editData,
        ...result,
        tags: [...(editData.tags || []), ...(result.tags || [])]
      });
      toast.success("Metadata enhanced by AI");
    } catch (error) {
      toast.error("AI auto-fill failed");
    } finally {
      setAiProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      await base44.entities.MusicTrack.update(track.id, editData);
      onSave(editData);
      toast.success("Metadata saved");
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setEditData({
        ...editData,
        tags: [...(editData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <span>Edit Metadata</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAIAutoFill}
              disabled={aiProcessing}
              className="gap-2"
            >
              {aiProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Auto-Fill
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={editData.title || ''}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              placeholder="Track title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist</label>
              <Input
                value={editData.artist || ''}
                onChange={(e) => setEditData({...editData, artist: e.target.value})}
                placeholder="Artist name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Album</label>
              <Input
                value={editData.album || ''}
                onChange={(e) => setEditData({...editData, album: e.target.value})}
                placeholder="Album name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Input
                value={editData.genre || ''}
                onChange={(e) => setEditData({...editData, genre: e.target.value})}
                placeholder="Music genre"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select 
                value={editData.language || ''} 
                onValueChange={(value) => setEditData({...editData, language: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Dominican Spanish">Dominican Spanish</SelectItem>
                  <SelectItem value="Haitian Creole">Haitian Creole</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Version Group (Optional)</label>
            <Input
              value={editData.version_group || ''}
              onChange={(e) => setEditData({...editData, version_group: e.target.value})}
              placeholder="e.g., 'Amazing Grace' - groups different versions together"
            />
            <p className="text-xs text-slate-500">
              Use the same name for different versions of the same song to group them
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price (USD)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={editData.price || ''}
              onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value) || null})}
              placeholder="e.g. 1.99"
            />
            <p className="text-xs text-slate-500">Leave blank for default $1.99</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Input
                type="number"
                value={editData.year || ''}
                onChange={(e) => setEditData({...editData, year: parseInt(e.target.value) || ''})}
                placeholder="Release year"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={editData.rating || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 10) {
                    setEditData({...editData, rating: val});
                  } else if (e.target.value === '') {
                    setEditData({...editData, rating: null});
                  }
                }}
                placeholder="Rate 1-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Tags</label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add a tag (e.g., upbeat, chill, workout)"
              />
              <Button onClick={addTag} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(editData.tags || []).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="hover:bg-slate-300 rounded-full p-0.5"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {(!editData.tags || editData.tags.length === 0) && (
                <span className="text-sm text-slate-400">No tags yet</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}