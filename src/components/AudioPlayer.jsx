import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Repeat1, Infinity } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const AudioPlayer = () => {
    const {
        currentSong,
        isPlaying,
        setIsPlaying,
        nextSong,
        prevSong,
        progress,
        duration,
        seek,
        volume,
        setVolume,
        toggleMute,
        isMuted,
        isLooping,
        toggleLoop,
        isAutoPlay,
        toggleAutoPlay
    } = useAudio();

    const navigate = useNavigate();
    const location = useLocation();

    if (!currentSong || location.pathname === '/player') return null;

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        seek(Number(e.target.value));
    };

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl z-50 glass-panel border border-white/10 px-6 py-4 backdrop-blur-2xl bg-black/60 rounded-full shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Song Info */}
                <div
                    className="flex items-center gap-4 w-1/3 cursor-pointer group"
                    onClick={() => navigate('/player')}
                >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden">
                        <img
                            src={currentSong.coverUrl}
                            alt={currentSong.title}
                            className={cn(
                                "w-full h-full object-cover",
                                isPlaying && "animate-spin-slow"
                            )}
                        />
                    </div>
                    <div className="hidden sm:block overflow-hidden">
                        <h4 className="font-medium text-white truncate group-hover:text-primary transition-colors">
                            {currentSong.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLoop}
                            className={cn("transition-colors", isLooping ? "text-gold" : "text-gray-400 hover:text-white")}
                            title="Loop Song"
                        >
                            <Repeat1 className="w-4 h-4" />
                        </button>

                        <button onClick={prevSong} className="text-gray-400 hover:text-white transition-colors">
                            <SkipBack className="w-5 h-5 fill-current" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 fill-current" />
                            ) : (
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                        </button>

                        <button onClick={nextSong} className="text-gray-400 hover:text-white transition-colors">
                            <SkipForward className="w-5 h-5 fill-current" />
                        </button>

                        <button
                            onClick={toggleAutoPlay}
                            className={cn("transition-colors", isAutoPlay ? "text-gold" : "text-gray-400 hover:text-white")}
                            title="Auto-play"
                        >
                            <Infinity className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 text-xs text-gray-400">
                        <span className="w-10 text-right">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                        <span className="w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="flex items-center justify-end gap-4 w-1/3">
                    <div className="hidden md:flex items-center gap-2 group">
                        <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/player')}
                        className="text-gray-400 hover:text-primary transition-colors"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AudioPlayer;
