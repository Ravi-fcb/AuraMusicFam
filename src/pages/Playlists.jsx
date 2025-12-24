import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaylistCard from '../components/PlaylistCard';

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);



    // Utility: Pick N random items from array
    const getRandomSongs = (allSongs, count) => {
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playlistsRes = await axios.get("http://localhost:5000/playlists");
                const songsRes = await axios.get("http://localhost:5000/songs");

                const allPlaylists = playlistsRes.data;
                const allSongs = songsRes.data;

                setSongs(allSongs);

                // Map songIds to actual song objects (Hybrid Logic)
                const playlistsWithSongs = allPlaylists.map(pl => {
                    let playlistSongs;
                    // Default playlists (1, 2, 3) get random songs
                    if (['1', '2', '3'].includes(pl.id)) {
                        playlistSongs = getRandomSongs(allSongs, 4);
                    } else {
                        // Custom playlists get their actual songs
                        playlistSongs = (pl.songIds || []).map(id => allSongs.find(s => s.id === id)).filter(Boolean);
                    }

                    return {
                        ...pl,
                        songs: playlistSongs
                    };
                });

                setPlaylists(playlistsWithSongs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gold">Your Playlists</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {playlists.map(playlist => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                songs={playlist.songs}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Playlists;
