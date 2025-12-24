import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';
import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import { useAudio } from '../context/AudioContext';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentSong, setIsPlaying, playSong } = useAudio();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsRes, playlistsRes] = await Promise.all([
                    axios.get('http://localhost:5000/songs'),
                    axios.get('http://localhost:5000/playlists')
                ]);
                setSongs(songsRes.data);
                setPlaylists(playlistsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const trendingSongs = songs.slice(0, 5);



    const handleStartListening = () => {
        if (currentSong) {
            setIsPlaying(true);
        } else if (songs.length > 0) {
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            playSong(randomSong, songs);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden p-12 glass-panel border-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Feel the <span className="text-gold">Rhythm</span> of the Future
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            Experience music like never before with AuraMusic.
                            Immersive soundscapes, curated playlists, and a stunning visual journey.
                        </p>
                        <button
                            onClick={handleStartListening}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Listening
                        </button>
                    </div>
                </div>

                {/* Featured Playlists */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
                        <a href="/playlists" className="text-primary hover:text-secondary transition-colors">View All</a>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {playlists.map(playlist => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </section>

                {/* Trending Songs */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                        <a href="/songs" className="text-primary hover:text-secondary transition-colors">View All</a>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {trendingSongs.map(song => (
                            <SongCard key={song.id} song={song} playlist={songs} />
                        ))}
                    </div>
                </section>

            </div>
        </>
    );
};

export default Home;
