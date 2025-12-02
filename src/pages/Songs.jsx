import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';

const Songs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/songs')
            .then(res => {
                setSongs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gold">All Songs</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {songs.map(song => (
                            <SongCard key={song.id} song={song} playlist={songs} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Songs;
