import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import { Heart } from 'lucide-react';

const LikedSongs = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/songs');
                const allSongs = res.data;
                const liked = allSongs.filter(song => song.liked === true);
                setLikedSongs(liked);
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedSongs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white fill-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Liked Songs</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : likedSongs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {likedSongs.map(song => (
                        <SongCard key={song.id} song={song} playlist={likedSongs} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-20">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No liked songs yet.</p>
                    <p className="text-sm mt-2">Tap the heart on any song to add it here.</p>
                </div>
            )}
        </div>
    );
};

export default LikedSongs;
