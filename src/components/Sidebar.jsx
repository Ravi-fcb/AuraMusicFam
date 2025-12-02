import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Music, Disc, Search, Heart, PlusSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Your Library', path: '/playlists', icon: Disc },
        { name: 'All Songs', path: '/songs', icon: Music },
    ];

    return (
        <div className={cn(
            "h-screen bg-black flex flex-col fixed left-0 top-0 z-40 border-r border-white/10 pb-24 transition-all duration-300",
            isOpen ? "w-64" : "w-20"
        )}>
            {/* Header / Toggle */}
            <div className="p-6 flex items-center justify-between">
                {isOpen && (
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Music className="text-dark w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wider">Aura</span>
                    </Link>
                )}
                <button
                    onClick={toggle}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 mx-auto" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2 mt-4">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/5 group",
                                isActive ? "text-primary bg-white/5" : "text-gray-400 hover:text-white",
                                !isOpen && "justify-center px-2"
                            )}
                            title={!isOpen ? link.name : ""}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-white")} />
                            {isOpen && <span>{link.name}</span>}
                        </Link>
                    );
                })}

                <div className={cn("pt-6 mt-6 border-t border-white/10", !isOpen && "hidden")}>
                    <Link to="/create-playlist" className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:text-white transition-colors group">
                        <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center group-hover:bg-white/20">
                            <PlusSquare className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Create Playlist</span>
                    </Link>

                    <Link to="/liked-songs" className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:text-white transition-colors group">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm flex items-center justify-center opacity-70 group-hover:opacity-100">
                            <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        <span className="text-sm font-medium">Liked Songs</span>
                    </Link>
                </div>
            </nav>

            {/* Footer/Legal */}
            {isOpen && (
                <div className="px-6 py-4 text-xs text-gray-600">
                    <p>&copy; 2025 AuraMusic</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
