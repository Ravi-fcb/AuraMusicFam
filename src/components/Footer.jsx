import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full py-8 text-center text-gray-500 text-sm glass-panel border-t border-white/5 mt-auto mb-24">
            <div className="flex items-center justify-center gap-2">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
                <span>for Music Lovers</span>
            </div>
            <div className="mt-2">
                &copy; {new Date().getFullYear()} AuraMusicFam. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
