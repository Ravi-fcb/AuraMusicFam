import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import SongCard from '../components/SongCard';

const Search = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/songs')
            .then(res => setSongs(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const results = songs.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSongs(results);
    }, [query, songs]);

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Search Input */}
                <div className="relative max-w-2xl mx-auto mb-12">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                        type="text"
                        placeholder="Search for songs, artists..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-lg text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        autoFocus
                    />
                </div>

                {/* Results */}
                {query && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-300">
                            Found {filteredSongs.length} results
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {filteredSongs.map(song => (
                                <SongCard key={song.id} song={song} playlist={filteredSongs} />
                            ))}
                        </div>
                    </div>
                )}

                {!query && (
                    <div className="text-center text-gray-500 mt-20">
                        <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-xl">Type to search for your favorite tracks</p>
                    </div>
                )}

            </div>
        </>
    );
};

export default Search;
