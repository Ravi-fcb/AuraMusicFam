import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    // Initialize state from localStorage
    const [currentSong, setCurrentSong] = useState(() => {
        const saved = localStorage.getItem('currentSong');
        return saved ? JSON.parse(saved) : null;
    });
    const [isPlaying, setIsPlaying] = useState(false); // Always start paused
    const [queue, setQueue] = useState(() => {
        const saved = localStorage.getItem('queue');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = localStorage.getItem('currentIndex');
        return saved ? Number(saved) : -1;
    });
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('volume');
        return saved ? Number(saved) : 1;
    });
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('progress');
        return saved ? Number(saved) : 0;
    });
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('isMuted');
        return saved === 'true';
    });

    const [isLooping, setIsLooping] = useState(() => {
        const saved = localStorage.getItem('isLooping');
        return saved === 'true';
    });
    const [isAutoPlay, setIsAutoPlay] = useState(() => {
        const saved = localStorage.getItem('isAutoPlay');
        return saved !== 'false'; // Default to true if not set (null) or 'true'
    });

    const audioRef = useRef(new Audio());

    // Persist state changes
    useEffect(() => {
        localStorage.setItem('currentSong', JSON.stringify(currentSong));
        localStorage.setItem('queue', JSON.stringify(queue));
        localStorage.setItem('currentIndex', currentIndex);
        localStorage.setItem('volume', volume);
        localStorage.setItem('isMuted', isMuted);
        localStorage.setItem('isLooping', isLooping);
        localStorage.setItem('isAutoPlay', isAutoPlay);
        // We don't persist progress here to avoid too many writes, 
        // instead we can save it on unload or periodically if needed, 
        // but for now let's save it when it changes significantly or on pause
    }, [currentSong, queue, currentIndex, volume, isMuted, isLooping, isAutoPlay]);

    // Save progress periodically or on pause
    useEffect(() => {
        localStorage.setItem('progress', progress);
    }, [progress]);


    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (isLooping) {
                audio.currentTime = 0;
                audio.play();
            } else if (isAutoPlay) {
                nextSong();
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isLooping, isAutoPlay, currentIndex, queue]);

    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong.audioUrl;
            // Restore progress if it matches the saved song
            // For simplicity, we just set it. 
            // Note: setting currentTime immediately might fail if metadata isn't loaded, 
            // but usually works enough for restoration.
            // We only want to restore progress on initial load, not every time currentSong changes naturally.
            // However, since we are using the same state, we need to be careful.
            // A better approach for "reload" vs "new song" differentiation would be needed for perfect seeking,
            // but for now, let's just set the source.

            // If we are reloading, we might want to seek to saved progress.
            // But if we change songs, we want to start at 0.
            // The simplest way is to rely on the fact that on reload, progress is restored from state.
            // But we need to apply it to the audio element.
        }
    }, [currentSong]);

    // Effect to restore progress on mount/song change if it's the SAME song as saved
    useEffect(() => {
        if (currentSong && audioRef.current.src === currentSong.audioUrl) {
            // It's the same song (likely reload), try to restore time
            if (Math.abs(audioRef.current.currentTime - progress) > 1) {
                audioRef.current.currentTime = progress;
            }
        }
    }, [currentSong]); // This dependency might need tuning, but let's try. 
    // Actually, a better way for the "reload" case specifically:

    useEffect(() => {
        // On mount, if we have a current song, set the src and time
        if (currentSong) {
            audioRef.current.src = currentSong.audioUrl;
            audioRef.current.currentTime = progress;
        }
    }, []); // Run once on mount

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    const playSong = (song, newQueue = null) => {
        if (newQueue) {
            setQueue(newQueue);
            const index = newQueue.findIndex(s => s.id === song.id);
            setCurrentIndex(index);
        }

        if (currentSong?.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            setProgress(0); // Reset progress for new song
        }
    };

    const nextSong = () => {
        if (queue.length === 0) return;
        const nextIndex = (currentIndex + 1) % queue.length;
        setCurrentIndex(nextIndex);
        setCurrentSong(queue[nextIndex]);
        setIsPlaying(true);
        setProgress(0);
    };

    const prevSong = () => {
        if (queue.length === 0) return;
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        setCurrentIndex(prevIndex);
        setCurrentSong(queue[prevIndex]);
        setIsPlaying(true);
        setProgress(0);
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    const toggleMute = () => setIsMuted(!isMuted);
    const toggleLoop = () => {
        if (!isLooping) setIsAutoPlay(false);
        setIsLooping(!isLooping);
    };
    const toggleAutoPlay = () => {
        if (!isAutoPlay) setIsLooping(false);
        setIsAutoPlay(!isAutoPlay);
    };

    return (
        <AudioContext.Provider value={{
            currentSong,
            isPlaying,
            setIsPlaying,
            queue,
            volume,
            setVolume,
            progress,
            duration,
            seek,
            playSong,
            nextSong,
            prevSong,
            toggleMute,
            isMuted,
            isLooping,
            toggleLoop,
            isAutoPlay,
            toggleAutoPlay
        }}>
            {children}
        </AudioContext.Provider>
    );
};
