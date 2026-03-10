import React, { useRef, useEffect } from 'react';

export default function WaveformVisualizer({ analyserRef, isPlaying }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = (timestamp) => {
      animFrameRef.current = requestAnimationFrame(draw);
      timeRef.current = timestamp;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const analyser = analyserRef?.current;
      const BAR_COUNT = 32;
      const gap = 2;
      const barW = (W - (BAR_COUNT - 1) * gap) / BAR_COUNT;

      if (!analyser || !isPlaying) {
        // Idle gentle pulse animation
        for (let i = 0; i < BAR_COUNT; i++) {
          const wave = Math.sin(timestamp / 600 + i * 0.4) * 0.5 + 0.5;
          const h = 3 + wave * 6;
          const x = i * (barW + gap);
          ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
          ctx.beginPath();
          ctx.roundRect(x, (H - h) / 2, barW, h, 2);
          ctx.fill();
        }
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIdx = Math.floor((i / BAR_COUNT) * bufferLength * 0.75); // use lower 75% of spectrum
        const value = dataArray[dataIdx] / 255;
        const barH = Math.max(3, value * H);

        const gradient = ctx.createLinearGradient(0, H, 0, H - barH);
        gradient.addColorStop(0, '#f59e0b');   // amber
        gradient.addColorStop(0.5, '#ef4444'); // red
        gradient.addColorStop(1, '#fbbf24');   // bright amber top

        ctx.fillStyle = gradient;
        const x = i * (barW + gap);
        ctx.beginPath();
        ctx.roundRect(x, H - barH, barW, barH, 2);
        ctx.fill();

        // Mirror reflection below center
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, H, barW, barH * 0.4, 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [analyserRef, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={44}
      className="rounded"
      style={{ display: 'block' }}
    />
  );
}