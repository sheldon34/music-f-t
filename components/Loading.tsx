import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-brand-accent">
      <Loader2 size={48} className="animate-spin mb-4" />
      <span className="font-mono text-sm tracking-widest animate-pulse">LOADING ASSETS...</span>
    </div>
  );
};

export default Loading;