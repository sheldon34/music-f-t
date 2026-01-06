import React, { useState } from 'react';
import { CreateEventForm, CreateMerchForm, CreateTrackForm } from '../components/AdminForms';
import { useAuth } from '../context/AuthContext';
import { Plus, Box, Calendar, Music } from 'lucide-react';
import SEO from '../components/SEO';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, isLoading, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'MERCH' | 'TRACKS'>('EVENTS');

  if (isLoading) {
      return <Loading />;
  }

  // Admin-only page
  if (!isAuthenticated || !isAdmin) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">ACCESS DENIED</h1>
            <p className="mb-4">You must be an administrator to view this page.</p>
            <button onClick={login} className="bg-black text-brand-accent px-6 py-2 font-bold">LOGIN</button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <SEO 
        title="Admin Dashboard" 
        description="Manage content, upload merchandise, events, and tracks." 
      />
      <h1 className="text-4xl font-bold mb-8 tracking-widest flex items-center gap-3">
        <span className="text-brand-accent">///</span> ADMIN CONSOLE
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <button 
          onClick={() => setActiveTab('EVENTS')}
          className={`py-4 border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'EVENTS' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white' : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:border-neutral-500'}`}
        >
          <Calendar size={24} />
          <span className="font-bold tracking-widest text-sm">EVENTS</span>
        </button>
        <button 
          onClick={() => setActiveTab('MERCH')}
          className={`py-4 border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'MERCH' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white' : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:border-neutral-500'}`}
        >
          <Box size={24} />
          <span className="font-bold tracking-widest text-sm">MERCH</span>
        </button>
        <button 
          onClick={() => setActiveTab('TRACKS')}
          className={`py-4 border flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'TRACKS' ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white' : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:border-neutral-500'}`}
        >
          <Music size={24} />
          <span className="font-bold tracking-widest text-sm">TRACKS</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-neutral-900 dark:text-white">
            <Plus size={20} className="text-brand-accent"/>
            ADD NEW {activeTab}
        </h2>
        
        {activeTab === 'EVENTS' && <CreateEventForm />}
        {activeTab === 'MERCH' && <CreateMerchForm />}
        {activeTab === 'TRACKS' && <CreateTrackForm />}
      </div>
    </div>
  );
};

export default AdminDashboard;