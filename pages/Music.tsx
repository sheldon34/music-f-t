import React, { useEffect, useState } from 'react';
import { TrackService } from '../services/api';
import { TrackDto, TrackSource } from '../types';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const Music = () => {
  const [tracks, setTracks] = useState<TrackDto[]>([]);
  const [playingTrack, setPlayingTrack] = useState<TrackDto | null>(null);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    TrackService.getAll().then(setTracks);
  }, []);

  const handlePlay = (track: TrackDto) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setPlayingTrack(track);
  };

  const getEmbedUrl = (track: TrackDto) => {
    if (track.source === TrackSource.YOUTUBE) {
      let videoId = track.link;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = track.link.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } 
    
    if (track.source === TrackSource.SPOTIFY) {
       const id = track.link.split('track/')[1]?.split('?')[0];
       if(id) return `https://open.spotify.com/embed/track/${id}`;
       return track.link;
    }
    
    return track.link;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <SEO 
        title="Music" 
        description="Listen to the latest releases, remixes and albums. Exclusive streaming for members." 
      />
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl md:text-9xl font-bold mb-12 tracking-tighter text-black dark:text-brand-accent"
      >
        DISCOGRAPHY
      </motion.h1>

      <div className="grid grid-cols-1 gap-2">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 border-b border-black/10 dark:border-neutral-800 flex items-center justify-between group transition-all duration-300 
              ${playingTrack?.id === track.id 
                ? 'bg-black text-brand-accent dark:bg-brand-accent dark:text-black scale-[1.01] shadow-xl' 
                : 'hover:bg-black/5 dark:hover:bg-neutral-900 text-black dark:text-white'}`}
          >
            <div className="flex items-center gap-6">
               <span className={`font-mono text-sm w-8 ${playingTrack?.id === track.id ? 'text-brand-accent dark:text-black' : 'text-black/50 dark:text-neutral-600'}`}>0{index + 1}</span>
               <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">{track.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs font-mono border px-2 py-1 ${playingTrack?.id === track.id ? 'border-brand-accent text-brand-accent dark:border-black dark:text-black' : 'border-black/30 dark:border-neutral-800 text-black/60 dark:text-neutral-500'}`}>
                        {track.source}
                    </span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => handlePlay(track)}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all
                 ${playingTrack?.id === track.id 
                    ? 'border-brand-accent text-brand-accent dark:border-black dark:text-black' 
                    : 'border-black/30 dark:border-neutral-600 hover:bg-black hover:text-brand-accent dark:hover:bg-brand-accent dark:hover:text-black hover:border-transparent'}`}
            >
              {isAuthenticated ? (
                playingTrack?.id === track.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />
              ) : (
                <Lock size={16} />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {!isAuthenticated && (
          <div className="mt-12 p-8 border-2 border-black dark:border-brand-accent bg-transparent text-center">
              <p className="text-black dark:text-brand-accent font-bold text-2xl mb-2">LOGIN REQUIRED</p>
              <p className="text-sm text-black/60 dark:text-neutral-400 font-mono">Sign in to listen to full tracks and exclusives.</p>
          </div>
      )}

      {/* Media Modal */}
      <AnimatePresence>
        {playingTrack && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-black text-brand-accent dark:bg-brand-accent dark:text-black p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full h-[80px] md:h-[152px]">
                   {playingTrack.source === TrackSource.SPOTIFY ? (
                       <iframe 
                         src={getEmbedUrl(playingTrack)} 
                         width="100%" 
                         height="152" 
                         allow="encrypted-media" 
                         className="rounded-none shadow-xl border-2 border-brand-accent dark:border-black"
                         title="Spotify Player"
                       ></iframe>
                   ) : (
                       <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden border-2 border-brand-accent dark:border-black">
                           <iframe 
                             width="100%" 
                             height="100%" 
                             src={getEmbedUrl(playingTrack)} 
                             title="YouTube video player" 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen
                           ></iframe>
                       </div>
                   )}
                </div>
                <button 
                  onClick={() => setPlayingTrack(null)}
                  className="absolute -top-6 right-6 bg-brand-accent text-black dark:bg-black dark:text-brand-accent p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  <X size={24}/>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Music;