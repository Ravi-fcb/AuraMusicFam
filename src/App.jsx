import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Player from './pages/Player';
import Playlists from './pages/Playlists';
import PlaylistView from './pages/PlaylistView';
import Search from './pages/Search';

import Sidebar from './components/Sidebar';
import AudioPlayer from './components/AudioPlayer';

import LikedSongs from './pages/LikedSongs';
import PlaylistManager from './pages/PlaylistManager';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-dark text-white flex">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 pb-24 relative transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/liked-songs" element={<LikedSongs />} />
          <Route path="/create-playlist" element={<PlaylistManager />} />
          <Route path="/player" element={<Player />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistView />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
      <AudioPlayer />
    </div>
  );
}

export default App;
