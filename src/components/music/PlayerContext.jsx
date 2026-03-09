import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [queueLength, setQueueLength] = useState(0);

  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const currentIndexRef = useRef(-1);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const onEnded = () => {
      const q = queueRef.current;
      const idx = currentIndexRef.current;
      if (idx < q.length - 1) {
        loadTrack(q[idx + 1], q, idx + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  function loadTrack(track, queue, idx) {
    const audio = audioRef.current;
    if (!audio) return;
    queueRef.current = queue;
    currentIndexRef.current = idx;
    setQueueLength(queue.length);
    setCurrentIndex(idx);
    setCurrentTrack(track);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    audio.src = track.file_url;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error('Playback error:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
  }

  const play = (track, tracks) => {
    const queue = tracks && tracks.length > 0 ? tracks : [track];
    const idx = queue.findIndex(t => t.id === track.id);
    loadTrack(track, queue, idx >= 0 ? idx : 0);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const next = () => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    if (idx < q.length - 1) loadTrack(q[idx + 1], q, idx + 1);
  };

  const previous = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const q = queueRef.current;
    const idx = currentIndexRef.current;
    if (idx > 0) loadTrack(q[idx - 1], q, idx - 1);
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (v) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, isLoading, currentTime, duration, volume,
      currentIndex, queueLength,
      play, togglePlayPause, next, previous, seek, setVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}