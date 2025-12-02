import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusSquare, Trash2, Disc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaylistManager = () => {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get('http://localhost:5000/playlists');
            // Filter out default playlists (IDs 1, 2, 3)
            const customPlaylists = res.data.filter(p => !['1', '2', '3'].includes(p.id));
            setPlaylists(customPlaylists);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        try {
            await axios.post('http://localhost:5000/playlists', {
                name: newPlaylistName,
                coverUrl: '/covers/userplaylistcoverimage.png',
                songIds: []
            });
            setNewPlaylistName('');
            fetchPlaylists(); // Refresh list
            // Optional: Navigate to the new playlist or just show success
        } catch (error) {
            console.error("Error creating playlist:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this playlist?")) return;

        try {
            await axios.delete(`http://localhost:5000/playlists/${id}`);
            fetchPlaylists(); // Refresh list
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-gold mb-8">Manage Playlists</h1>

            {/* Create Section */}
            <div className="glass-panel p-8 rounded-2xl mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <PlusSquare className="text-primary" />
                    Create New Playlist
                </h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Enter playlist name..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newPlaylistName.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <Disc className="text-primary" />
                    Your Custom Playlists
                </h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : playlists.length > 0 ? (
                    <div className="space-y-4">
                        {playlists.map(playlist => (
                            <div key={playlist.id} className="glass-card p-4 rounded-xl flex items-center justify-between group">
                                <div className="flex items-center gap-4" onClick={() => navigate(`/playlists/${playlist.id}`)}>
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-light">
                                        <img
                                            src={playlist.coverUrl}
                                            alt={playlist.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors cursor-pointer">
                                            {playlist.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {(playlist.songIds || []).length} Songs
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(playlist.id)}
                                    className="p-3 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete Playlist"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                        <p>You haven't created any playlists yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistManager;
