import React, { useEffect, useState } from 'react';
import { MerchandiseService } from '../services/api';
import { MerchandiseDto } from '../types';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Shop = () => {
  const [merch, setMerch] = useState<MerchandiseDto[]>([]);

  useEffect(() => {
    MerchandiseService.getAll().then(setMerch);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SEO 
        title="Merchandise" 
        description="Shop the exclusive collection. Hoodies, Tees, and Accessories limited edition drops." 
      />
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl md:text-9xl font-bold mb-16 tracking-tighter text-right text-black dark:text-brand-accent"
      >
        OFFICIAL MERCH
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
        {merch.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] overflow-hidden bg-black/5 dark:bg-neutral-900 mb-6 relative border-b-4 border-transparent group-hover:border-black dark:group-hover:border-brand-accent transition-colors">
               {item.merchandiseImg && (
                   <img 
                    src={item.merchandiseImg} 
                    alt={item.merchandiseName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    loading="lazy"
                   />
               )}
               {/* DOMINANT OVERLAY */}
               <div className="absolute inset-0 bg-black/90 dark:bg-brand-accent/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                   <h3 className="text-3xl font-bold text-brand-accent dark:text-black uppercase mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.merchandiseName}</h3>
                   <span className="bg-brand-accent text-black dark:bg-black dark:text-brand-accent px-6 py-2 text-sm font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">ADD TO CART</span>
               </div>
            </div>
            
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold uppercase group-hover:text-black/70 dark:group-hover:text-brand-accent transition-colors text-black dark:text-white">{item.merchandiseName}</h3>
                    <p className="text-black/60 dark:text-neutral-500 text-sm mt-1 font-mono">{item.merchandiseDetails}</p>
                </div>
                <span className="font-bold text-lg bg-black text-brand-accent dark:bg-brand-accent dark:text-black px-3 py-1 font-mono">{item.merchandisePrice}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;