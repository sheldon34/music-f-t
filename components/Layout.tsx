import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, login, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'TOUR', path: '/tour' },
    { name: 'MUSIC', path: '/music' },
    { name: 'SHOP', path: '/shop' },
  ];

  // Dashboard is admin-only
  if (isAuthenticated && isAdmin) {
    navLinks.push({ name: 'DASHBOARD', path: '/admin' });
  }

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-brand-accent dark:bg-neutral-950 text-black dark:text-white font-sans transition-colors duration-500">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-[0.2em] hover:opacity-70 transition-opacity z-50 flex items-center gap-1 group">
            <span className="bg-black text-brand-accent dark:bg-white dark:text-black px-1 transition-colors">DJ</span>
            <span className="text-black dark:text-brand-accent font-extrabold transition-colors">PIMPIM</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold tracking-widest transition-all px-2 py-1 
                  ${location.pathname === link.path 
                    ? 'bg-black text-brand-accent dark:bg-brand-accent dark:text-black' 
                    : 'text-black hover:bg-black/10 dark:text-white dark:hover:text-brand-accent'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme} 
                className="p-2 text-black hover:bg-black hover:text-brand-accent dark:text-white dark:hover:text-brand-accent transition-all rounded-full"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {isAuthenticated ? (
               <div className="flex items-center gap-4">
                 {user?.picture && <img src={user.picture} alt="User" className="w-8 h-8 rounded-full border border-black dark:border-white" />}
                 <button onClick={logout} className="flex items-center gap-2 text-xs font-mono border border-black/20 dark:border-white/20 px-4 py-2 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all">
                    <LogOut size={14} /> SIGNOUT
                 </button>
               </div>
            ) : (
              <button onClick={login} className="flex items-center gap-2 text-xs font-mono border-2 border-black text-black dark:border-brand-accent dark:text-brand-accent px-4 py-2 hover:bg-black hover:text-brand-accent dark:hover:bg-brand-accent dark:hover:text-black transition-all font-bold">
                <User size={14} /> LOGIN
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <button 
                onClick={toggleTheme} 
                className="text-black dark:text-white hover:opacity-70 transition-colors"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-black dark:text-white hover:opacity-70 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} className="text-brand-accent dark:text-black" /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - INVERTED LOGIC */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-black dark:bg-brand-accent z-40 flex flex-col justify-center items-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-6xl font-bold tracking-tighter text-brand-accent dark:text-black hover:opacity-70 transition-colors"
              >
                {link.name}
              </Link>
            ))}
             {isAuthenticated ? (
               <button onClick={logout} className="text-xl font-mono mt-8 text-brand-accent dark:text-black border-2 border-brand-accent dark:border-black px-6 py-2 hover:bg-brand-accent hover:text-black dark:hover:bg-black dark:hover:text-brand-accent">SIGNOUT</button>
             ) : (
               <button onClick={() => { setIsMenuOpen(false); login(); }} className="text-xl font-mono mt-8 text-brand-accent dark:text-black border-2 border-brand-accent dark:border-black px-6 py-2 hover:bg-brand-accent hover:text-black dark:hover:bg-black dark:hover:text-brand-accent">LOGIN</button>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="pt-24 min-h-screen">
        {children}
      </main>

      {/* Footer - Black on Mustard (Light) vs Mustard on Black (Dark) */}
      <footer className="mt-20">
        <div className="bg-black dark:bg-brand-accent py-12 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-brand-accent dark:text-black">
               <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 md:mb-0">DJ PIMPIM</h2>
               <div className="flex gap-4">
                  <a href="#" className="font-bold border-2 border-brand-accent dark:border-black px-6 py-2 hover:bg-brand-accent hover:text-black dark:hover:bg-black dark:hover:text-brand-accent transition-colors">INSTAGRAM</a>
                  <a href="#" className="font-bold border-2 border-brand-accent dark:border-black px-6 py-2 hover:bg-brand-accent hover:text-black dark:hover:bg-black dark:hover:text-brand-accent transition-colors">YOUTUBE</a>
               </div>
            </div>
        </div>
        <div className="bg-black/90 dark:bg-neutral-900 py-4 border-t border-white/10 dark:border-neutral-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 text-neutral-500 text-xs font-mono text-center md:text-left">
             © 2024 DJ PIMPIM. ALL RIGHTS RESERVED.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;