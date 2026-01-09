import React, { useState } from 'react';
import { EventStatus, TrackSource } from '../types';
import { AdminUserService, EventService, MerchandiseService, TrackService } from '../services/api';
import { Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CreateEventForm = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { getAccessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());
    const file = formData.get('imageUrl') as File | null;
    
    const payload = { ...data };

    try {
      const token = await getAccessToken();
      await EventService.create(payload, file, token);
      setMsg({ type: 'success', text: 'Event created successfully!' });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to upload event. Check permissions.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-neutral-100 dark:bg-neutral-800 p-3 w-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-brand-accent dark:focus:border-white outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Event Title" required className={inputClass} />
        <input name="venueName" placeholder="Venue Name" required className={inputClass} />
        <input name="location" placeholder="Location (City, Country)" required className={inputClass} />
        <input name="startDate" type="date" required className={inputClass} />
        <input name="ticketLink" placeholder="Ticket URL" required className={inputClass} />
        
        <div className="flex gap-2">
            <input name="LocationLatitude" type="number" step="any" placeholder="Latitude (e.g. -1.29)" required className={inputClass} />
            <input name="LocationLongitude" type="number" step="any" placeholder="Longitude (e.g. 36.82)" required className={inputClass} />
        </div>
        
        <select name="status" className={inputClass}>
          <option value={EventStatus.UPCOMING}>UPCOMING</option>
          <option value={EventStatus.COMPLETED}>COMPLETED</option>
          <option value={EventStatus.CANCELLED}>CANCELLED</option>
        </select>
        
        <div className="relative border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-2 flex items-center justify-center cursor-pointer hover:border-brand-accent dark:hover:border-white transition-colors">
            <input type="file" name="imageUrl" className="absolute inset-0 opacity-0 cursor-pointer" required />
            <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"><Upload size={16}/> Upload Cover Image</span>
        </div>
      </div>
      
      <button disabled={loading} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 mt-4 hover:bg-brand-accent dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin mx-auto"/> : 'CREATE EVENT'}
      </button>
      {msg && <p className={`text-center ${msg.type === 'success' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{msg.text}</p>}
    </form>
  );
};

export const CreateMerchForm = () => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { getAccessToken } = useAuth();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setMsg(null);
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      const file = formData.get('merchandiseImg') as File | null;
      
      try {
        const token = await getAccessToken();
        await MerchandiseService.create(data, file, token);
        setMsg({ type: 'success', text: 'Merchandise added successfully!' });
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        console.error(err);
        setMsg({ type: 'error', text: 'Failed to upload merchandise. Check permissions.' });
      } finally {
        setLoading(false);
      }
    };

    const inputClass = "bg-neutral-100 dark:bg-neutral-800 p-3 w-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-brand-accent dark:focus:border-white outline-none transition-colors";
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
        <div className="grid grid-cols-1 gap-4">
          <input name="merchandiseName" placeholder="Item Name" required className={inputClass} />
          <input name="merchandisePrice" placeholder="Price (e.g. KSH 2500)" required className={inputClass} />
          <textarea name="merchandiseDetails" placeholder="Details/Description" required rows={3} className={inputClass} />
          
          <div className="relative border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4 flex items-center justify-center cursor-pointer hover:border-brand-accent dark:hover:border-white transition-colors border-dashed">
              <input type="file" name="merchandiseImg" className="absolute inset-0 opacity-0 cursor-pointer" required />
              <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"><Upload size={16}/> Upload Product Image</span>
          </div>
        </div>
        
        <button disabled={loading} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 mt-4 hover:bg-brand-accent dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin mx-auto"/> : 'ADD PRODUCT'}
        </button>
        {msg && <p className={`text-center ${msg.type === 'success' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{msg.text}</p>}
      </form>
    );
  };

  export const CreateTrackForm = () => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { getAccessToken } = useAuth();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setMsg(null);
      const formData = new FormData(e.currentTarget);
      const data: any = Object.fromEntries(formData.entries());
      
      try {
        const token = await getAccessToken();
        await TrackService.create(data, token);
        setMsg({ type: 'success', text: 'Track added successfully!' });
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        console.error(err);
        setMsg({ type: 'error', text: 'Failed to add track. Check permissions.' });
      } finally {
        setLoading(false);
      }
    };

    const inputClass = "bg-neutral-100 dark:bg-neutral-800 p-3 w-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-brand-accent dark:focus:border-white outline-none transition-colors";
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
        <div className="grid grid-cols-1 gap-4">
          <input name="title" placeholder="Track Title" required className={inputClass} />
          
          <div className="grid grid-cols-2 gap-4">
            <select name="source" className={inputClass}>
                <option value={TrackSource.SPOTIFY}>SPOTIFY</option>
                <option value={TrackSource.YOUTUBE}>YOUTUBE</option>
            </select>
            <input name="link" placeholder="Full URL (YouTube/Spotify)" required className={inputClass} />
          </div>
        </div>
        
        <button disabled={loading} className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 mt-4 hover:bg-brand-accent dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin mx-auto"/> : 'ADD TRACK'}
        </button>
        {msg && <p className={`text-center ${msg.type === 'success' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{msg.text}</p>}
      </form>
    );
  };

export const ManageUsersForm = () => {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [updatesJson, setUpdatesJson] = useState('{}');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const inputClass =
    'bg-neutral-100 dark:bg-neutral-800 p-3 w-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-brand-accent dark:focus:border-white outline-none transition-colors';

  const fetchUser = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const token = await getAccessToken();
      const result = await AdminUserService.getByEmail(email.trim(), token);
      setUser(result);
      setMsg({ type: 'success', text: 'User loaded.' });
    } catch (err) {
      console.error(err);
      setUser(null);
      setMsg({ type: 'error', text: 'User not found (or not authorized).' });
    } finally {
      setLoading(false);
    }
  };

  const patchUser = async () => {
    if (!user) return;

    setLoading(true);
    setMsg(null);
    try {
      const updates = JSON.parse(updatesJson || '{}') as Record<string, any>;
      const token = await getAccessToken();
      const id = String((user as any).user_id ?? (user as any).id ?? '');
      if (!id) throw new Error('Missing user id');

      const updated = await AdminUserService.update(id, updates, token);
      setUser(updated);
      setMsg({ type: 'success', text: 'User updated.' });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Update failed. Ensure JSON is valid and you are admin.' });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!user) return;

    setLoading(true);
    setMsg(null);
    try {
      const token = await getAccessToken();
      const id = String((user as any).user_id ?? (user as any).id ?? '');
      if (!id) throw new Error('Missing user id');
      await AdminUserService.delete(id, token);
      setUser(null);
      setMsg({ type: 'success', text: `User deleted: ${id}` });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Delete failed. Check permissions.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
          className={inputClass}
          autoComplete="email"
        />
        <button
          disabled={loading || email.trim().length === 0}
          onClick={fetchUser}
          className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 hover:bg-brand-accent dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'SEARCH'}
        </button>

        <button
          disabled={loading || !user}
          onClick={deleteUser}
          className="w-full border border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 font-bold py-3 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
        >
          DELETE
        </button>
      </div>

      <div>
        <label className="block text-xs tracking-widest mb-2 text-black/70 dark:text-neutral-400">PATCH JSON</label>
        <textarea
          value={updatesJson}
          onChange={(e) => setUpdatesJson(e.target.value)}
          rows={6}
          className={inputClass}
          spellCheck={false}
        />
        <button
          disabled={loading || !user}
          onClick={patchUser}
          className="mt-3 w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 hover:bg-brand-accent dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'APPLY PATCH'}
        </button>
      </div>

      <div className="border border-neutral-300 dark:border-neutral-700 p-4 bg-white/50 dark:bg-neutral-900/50">
        <div className="text-xs tracking-widest text-black/60 dark:text-neutral-500 mb-2">RESULT</div>
        <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
          {user ? JSON.stringify(user, null, 2) : 'No user loaded.'}
        </pre>
      </div>

      {msg && (
        <p
          className={`text-center ${msg.type === 'success' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
};