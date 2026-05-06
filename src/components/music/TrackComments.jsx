import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send } from 'lucide-react';

const BAD_WORDS = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'hell', 'bastard', 'cunt', 'dick', 'piss'];

function hasProfanity(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(w => lower.includes(w));
}

export function CommentButton({ trackId }) {
  const [open, setOpen] = useState(false);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', trackId],
    queryFn: () => base44.entities.TrackComment.filter({ track_id: trackId }, '-created_date', 50),
    enabled: open,
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-xs"
        title="Comments"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      {open && <CommentsPanel trackId={trackId} comments={comments} onClose={() => setOpen(false)} />}
    </>
  );
}

function CommentsPanel({ trackId, comments, onClose }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (data) => base44.entities.TrackComment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', trackId] });
      setName('');
      setMessage('');
      setError('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    if (hasProfanity(name) || hasProfanity(message)) {
      setError('Please keep it clean 🙏');
      return;
    }
    addComment({ track_id: trackId, author_name: name.trim().slice(0, 40), message: message.trim().slice(0, 150) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white text-sm">Comments</span>
            <span className="text-slate-500 text-xs">({comments.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[100px]">
          {comments.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-6">Be the first to leave a comment</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-900/60 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-400">
                  {c.author_name[0]?.toUpperCase()}
                </div>
                <div>
                  <span className="text-amber-400 text-xs font-semibold">{c.author_name}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{c.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="border-t border-slate-800 px-5 py-4 space-y-2">
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-600"
          />
          <div className="flex gap-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Leave a message... (150 chars)"
              maxLength={150}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              disabled={isPending || !name.trim() || !message.trim()}
              className="w-9 h-9 flex items-center justify-center bg-amber-700 hover:bg-amber-600 disabled:opacity-40 rounded-lg flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}