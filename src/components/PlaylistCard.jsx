import React from 'react';
import { Link } from 'react-router-dom';
import { Disc } from 'lucide-react';

const PlaylistCard = ({ playlist }) => {
    return (
        <Link to={`/playlists/${playlist.id}`} className="group relative block">
            <div className="relative aspect-square rounded-xl overflow-hidden glass-card mb-3">
                {playlist.coverUrl ? (
                    <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Disc className="w-16 h-16 text-gray-600 group-hover:text-primary transition-colors" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors truncate">
                {playlist.name}
            </h3>
            <p className="text-sm text-gray-400">
                {playlist.songIds.length} Songs
            </p>
        </Link>
    );
};

export default PlaylistCard;
