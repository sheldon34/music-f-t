import React, { useEffect, useState } from 'react';
import { EventService } from '../services/api';
import { EventsDto, EventStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, Ticket, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Tour = () => {
  const [events, setEvents] = useState<EventsDto[]>([]);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    EventService.getAll().then(setEvents);
  }, []);

  const handleBook = () => {
    if (!isAuthenticated) {
      login();
    } else {
      alert("Redirecting to ticket vendor...");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SEO 
        title="Tour Dates" 
        description="Find tickets for upcoming shows and festivals near you. Join the experience." 
      />
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl md:text-9xl font-bold mb-16 tracking-tighter text-black dark:text-brand-accent"
      >
        TOUR DATES
      </motion.h1>

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col md:flex-row md:items-center justify-between border-b border-black/20 dark:border-neutral-800 py-6 px-4 transition-all duration-300 hover:bg-black hover:text-brand-accent dark:hover:bg-brand-accent dark:hover:text-black hover:pl-8"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 flex-1">
                {/* Date */}
                <div className="flex flex-col w-32 border-r border-black/20 dark:border-neutral-800 group-hover:border-brand-accent/20 dark:group-hover:border-black/20 pr-4">
                    <span className="text-5xl font-bold group-hover:text-brand-accent dark:group-hover:text-black text-black dark:text-white transition-colors">{new Date(event.startDate).getDate()}</span>
                    <span className="text-xl text-black/60 dark:text-neutral-500 uppercase group-hover:text-brand-accent/80 dark:group-hover:text-black/60">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="text-3xl font-bold uppercase mb-2 text-black dark:text-white group-hover:text-brand-accent dark:group-hover:text-black transition-colors">{event.venueName}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-black/70 dark:text-neutral-400 group-hover:text-brand-accent/80 dark:group-hover:text-black/70 font-mono text-sm">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {event.location}</span>
                        
                        {event.locationLatitude && event.locationLongitude && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${event.locationLatitude},${event.locationLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-bold underline hover:no-underline"
                          >
                            <Map size={14}/> VIEW MAP
                          </a>
                        )}

                        <span className={`px-2 py-0.5 text-[10px] border w-fit font-bold ${event.status === EventStatus.UPCOMING ? 'border-black text-black dark:border-green-500 dark:text-green-500 group-hover:border-brand-accent group-hover:text-brand-accent dark:group-hover:border-black dark:group-hover:text-black' : 'border-neutral-400 dark:border-neutral-600'}`}>
                            {event.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="mt-6 md:mt-0">
                {event.status === EventStatus.UPCOMING ? (
                    <button 
                        onClick={handleBook}
                        className="px-8 py-3 bg-black text-brand-accent dark:bg-neutral-900 dark:text-white group-hover:bg-brand-accent group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-brand-accent font-bold tracking-widest transition-all w-full md:w-auto flex items-center justify-center gap-2 border border-transparent group-hover:border-black dark:group-hover:border-transparent"
                    >
                       <Ticket size={16} /> {isAuthenticated ? 'TICKETS' : 'LOGIN TO BOOK'}
                    </button>
                ) : (
                    <button disabled className="px-8 py-3 border border-black/30 dark:border-neutral-800 text-black/40 dark:text-neutral-600 font-bold tracking-widest cursor-not-allowed w-full md:w-auto group-hover:border-brand-accent/50 group-hover:text-brand-accent/50 dark:group-hover:text-black/50">
                        SOLD OUT
                    </button>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tour;