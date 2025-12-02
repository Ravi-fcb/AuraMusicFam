import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, ChevronDown, Repeat1, Infinity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

const Player = () => {
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
        queue,
        isLooping,
        toggleLoop,
        isAutoPlay,
        toggleAutoPlay
    } = useAudio();

    const navigate = useNavigate();

    if (!currentSong) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-bold mb-4">No song playing</h2>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Discover Music
                </button>
            </div>
        );
    }

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="fixed inset-0 bg-dark z-50 flex flex-col">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src={currentSong.coverUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-20 blur-3xl"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <button onClick={() => navigate(-1)} className="btn-icon">
                    <ChevronDown className="w-8 h-8" />
                </button>
                <span className="text-sm font-medium tracking-widest uppercase text-gray-400">Now Playing</span>
                <button className="btn-icon">
                    <ListMusic className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-12">

                {/* Album Art */}
                <div className="relative w-64 h-64 md:w-96 md:h-96">
                    <div className={cn(
                        "w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]",
                        isPlaying ? "animate-spin-slow" : ""
                    )}>
                        <img
                            src={currentSong.coverUrl}
                            alt={currentSong.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Center Hole */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-dark rounded-full border border-white/10 flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rounded-full" />
                    </div>
                </div>

                {/* Song Info */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gold">{currentSong.title}</h1>
                    <p className="text-lg text-gray-400">{currentSong.artist}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/5 uppercase tracking-wider">
                        {currentSong.genre || 'Music'}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-2xl space-y-2">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                    <button
                        onClick={toggleLoop}
                        className={cn("btn-icon transition-colors", isLooping ? "text-gold" : "text-gray-400 hover:text-white")}
                        title="Loop Song"
                    >
                        <Repeat1 className="w-6 h-6" />
                    </button>

                    <button onClick={prevSong} className="btn-icon hover:text-primary transform hover:scale-110">
                        <SkipBack className="w-8 h-8 fill-current" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.5)] transform hover:scale-105 active:scale-95 transition-all"
                    >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-current" />
                        ) : (
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        )}
                    </button>

                    <button onClick={nextSong} className="btn-icon hover:text-primary transform hover:scale-110">
                        <SkipForward className="w-8 h-8 fill-current" />
                    </button>

                    <button
                        onClick={toggleAutoPlay}
                        className={cn("btn-icon transition-colors", isAutoPlay ? "text-gold" : "text-gray-400 hover:text-white")}
                        title="Auto-play"
                    >
                        <Infinity className="w-6 h-6" />
                    </button>
                </div>

                {/* Volume Control */}
                <div className="w-full max-w-xs flex items-center gap-4">
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
                        className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                </div>

            </div>
        </div>
    );
};

export default Player;
