import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { Play, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAudio } from '../context/AudioContext';

const PlaylistView = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = useAudio();

    // Move these hooks to the top level
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allSongs, setAllSongs] = useState([]);

    // Utility: Pick random N songs
    const getRandomSongs = (allSongs, count) => {
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playlistRes = await axios.get(`http://localhost:5000/playlists/${id}`);
                const allSongsRes = await axios.get("http://localhost:5000/songs");

                const currentPlaylist = playlistRes.data;
                const allSongs = allSongsRes.data;

                let playlistSongs;
                // Default playlists (1, 2, 3) get random songs
                if (['1', '2', '3'].includes(id)) {
                    playlistSongs = getRandomSongs(allSongs, 8); // Show 8 random songs for defaults
                } else {
                    // Custom playlists get their actual songs
                    playlistSongs = (currentPlaylist.songIds || []).map(id => allSongs.find(s => s.id === id)).filter(Boolean);
                }

                setPlaylist(currentPlaylist);
                setSongs(playlistSongs);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        // Fetch all songs for the modal
        const fetchAllSongs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/songs");
                setAllSongs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (isModalOpen) fetchAllSongs();
    }, [isModalOpen]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playSong(songs[0], songs);
        }
    };

    const handleAddSong = async (songId) => {
        try {
            const currentSongIds = playlist.songIds || [];
            if (currentSongIds.includes(songId)) return;

            const updatedSongIds = [...currentSongIds, songId];
            await axios.patch(`http://localhost:5000/playlists/${id}`, {
                songIds: updatedSongIds
            });

            // Update local state
            const addedSong = allSongs.find(s => s.id === songId);
            setSongs([...songs, addedSong]);
            setPlaylist({ ...playlist, songIds: updatedSongIds });

            // Optional: Close modal or keep open for multiple adds
            // setIsModalOpen(false); 
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!playlist) return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Playlist Not Found</h2>
                <p className="text-gray-400 mb-6">The playlist you are looking for does not exist.</p>
                <a href="/playlists" className="btn-primary">Back to Playlists</a>
            </div>
        </>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
                    <div className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl">
                        <img
                            src={playlist?.coverUrl || "/covers/default.jpg"}
                            alt={playlist?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <span className="text-sm font-medium uppercase tracking-wider text-primary">Playlist</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{playlist?.name}</h1>
                        <p className="text-gray-400">{songs.length} Songs</p>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handlePlayAll}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Play All
                            </button>

                            {/* Only show Add/Delete for custom playlists */}
                            {!['1', '2', '3'].includes(id) && (
                                <>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                        title="Add Songs"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to delete this playlist?")) {
                                                try {
                                                    await axios.delete(`http://localhost:5000/playlists/${id}`);
                                                    window.location.href = '/playlists';
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }
                                        }}
                                        className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 transition-colors"
                                        title="Delete Playlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Songs */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {songs.map(song => (
                        <SongCard key={song.id} song={song} playlist={songs} />
                    ))}
                </div>
            </div>

            {/* Add Song Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-dark-light w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Add Songs</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                Close
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-2">
                            {allSongs.map(song => {
                                const isAdded = (playlist.songIds || []).includes(song.id);
                                return (
                                    <div key={song.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <img src={song.coverUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                            <div>
                                                <p className={cn("font-medium", isAdded ? "text-primary" : "text-white")}>{song.title}</p>
                                                <p className="text-sm text-gray-400">{song.artist}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddSong(song.id)}
                                            disabled={isAdded}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                                                isAdded
                                                    ? "bg-primary/20 text-primary cursor-default"
                                                    : "bg-white/10 hover:bg-primary hover:text-white text-white"
                                            )}
                                        >
                                            {isAdded ? "Added" : "Add"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlaylistView;
