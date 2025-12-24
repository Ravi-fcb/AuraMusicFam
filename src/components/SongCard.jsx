import React from 'react';
import axios from 'axios';
import { Play, Pause, Heart, PlusCircle } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

const SongCard = ({ song, playlist = [] }) => {
    const { currentSong, isPlaying, playSong } = useAudio();
    const navigate = useNavigate();

    const isCurrentSong = currentSong?.id === song.id;
    const isCurrentPlaying = isCurrentSong && isPlaying;

    const handlePlay = (e) => {
        e.stopPropagation();
        playSong(song, playlist.length > 0 ? playlist : [song]);
    };

    const handleCardClick = () => {
        navigate('/player');
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex flex-col gap-3 p-4 rounded-xl glass-card cursor-pointer"
        >
            <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay with Play Button */}
                <div className={cn(
                    "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
                    isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                    <button
                        onClick={handlePlay}
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg shadow-primary/50"
                    >
                        {isCurrentPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                        ) : (
                            <Play className="w-6 h-6 fill-current ml-1" />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <h3 className={cn(
                        "font-semibold truncate transition-colors flex-1",
                        isCurrentSong ? "text-primary" : "text-white group-hover:text-primary"
                    )}>
                        {song.title}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const playlistsRes = await axios.get('http://localhost:5000/playlists');
                                    // Filter out default playlists (IDs 1, 2, 3)
                                    const playlists = playlistsRes.data.filter(p => !['1', '2', '3'].includes(p.id));

                                    if (playlists.length === 0) {
                                        alert("Create a custom playlist first!");
                                        return;
                                    }

                                    const playlistNames = playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
                                    const selection = prompt(`Enter the number of the playlist to add to:\n${playlistNames}`);

                                    if (selection) {
                                        const index = parseInt(selection) - 1;
                                        if (index >= 0 && index < playlists.length) {
                                            const targetPlaylist = playlists[index];
                                            const currentSongIds = targetPlaylist.songIds || [];

                                            if (!currentSongIds.includes(song.id)) {
                                                await axios.patch(`http://localhost:5000/playlists/${targetPlaylist.id}`, {
                                                    songIds: [...currentSongIds, song.id]
                                                });
                                                alert(`Added to ${targetPlaylist.name}!`);
                                            } else {
                                                alert("Song already in playlist!");
                                            }
                                        } else {
                                            alert("Invalid selection");
                                        }
                                    }
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Add to Playlist"
                        >
                            <PlusCircle className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    await axios.patch(`http://localhost:5000/songs/${song.id}`, {
                                        liked: !song.liked
                                    });
                                    window.location.reload();
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Heart className={cn("w-4 h-4", song.liked ? "fill-red-500 text-red-500" : "")} />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-gray-300 border border-white/5">
                    {song.genre}
                </span>
            </div>
        </div>
    );
};

export default SongCard;
