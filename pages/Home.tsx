import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
  return (
    <div className="relative">
      <SEO 
        title="Home" 
        description="Welcome to the official site of DJ PIMPIM. Check out the latest tour dates, new music releases, and exclusive merchandise." 
      />
      
      {/* Hero Section */}
      <section className="h-[90vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Image/Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Concert Background - Live performance crowd" 
            className="w-full h-full object-cover opacity-30 dark:opacity-60 mix-blend-multiply"
            fetchPriority="high"
            loading="eager"
          />
          {/* Gradient matches the background color of the mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-accent via-brand-accent/50 to-transparent dark:from-neutral-950 dark:via-neutral-950/40 dark:to-brand-accent/20"></div>
        </div>

        <div className="z-10 text-center px-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-[10rem] leading-none font-bold tracking-tighter mb-4 uppercase drop-shadow-xl"
          >
            <span className="text-black dark:text-white transition-colors">DJ</span><br/>
            <span className="relative inline-block">
                <span className="text-black dark:text-brand-accent transition-colors">PIMPIM</span>
                <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-2 md:-bottom-4 left-0 h-2 md:h-4 bg-black dark:bg-brand-accent"
                ></motion.span>
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-6 justify-center mt-16"
          >
            <Link to="/tour" className="px-10 py-4 border-2 border-black text-black dark:border-white dark:text-white font-bold tracking-[0.2em] hover:bg-black hover:text-brand-accent dark:hover:bg-white dark:hover:text-black transition-all">
              TOUR DATES
            </Link>
            <Link to="/music" className="px-10 py-4 bg-black text-brand-accent dark:bg-brand-accent dark:text-black font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-3 justify-center shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,195,0,0.5)]">
              <Play size={20} fill="currentColor" /> LATEST TRACK
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black dark:border-neutral-800 transition-colors duration-300">
            <motion.div 
               initial={{ x: -50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="aspect-square bg-black dark:bg-neutral-900 relative group overflow-hidden"
            >
                <img 
                  src="https://picsum.photos/800/800?random=10" 
                  alt="New Merchandise Release - Hoodie Collection" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" 
                  loading="lazy"
                  width="800"
                  height="800"
                />
            </motion.div>
            
            <motion.div
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="flex flex-col justify-center p-12 md:p-20 bg-white dark:bg-neutral-900/50 relative overflow-hidden transition-colors duration-300"
            >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-black dark:bg-brand-accent opacity-20 transform rotate-45 translate-x-10 -translate-y-10"></div>

                <h2 className="text-5xl font-bold mb-6 tracking-wide text-black dark:text-brand-accent">NEW DROP</h2>
                <p className="text-neutral-700 dark:text-neutral-400 mb-10 font-mono leading-relaxed">
                    Designed for the rave, built for the street.
                    The new collection features bold cuts and our signature style.
                </p>
                <Link to="/shop" className="inline-block bg-black text-brand-accent dark:bg-white dark:text-black px-8 py-3 font-bold tracking-widest hover:opacity-80 transition-opacity w-fit">
                    SHOP NOW
                </Link>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;