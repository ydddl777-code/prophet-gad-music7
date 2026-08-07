import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function NavArrow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: '#059669' }}
    >
      <ArrowUp className="w-6 h-6 text-white" />
    </button>
  );
}