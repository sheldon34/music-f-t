import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await loginWithCredentials(username, password);
      // Let route guards/UI determine admin access.
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Login failed. Check username/password.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/');
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <Loading />;
  if (isAuthenticated) return null;

  const inputClass =
    'bg-neutral-100 dark:bg-neutral-800 p-3 w-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-brand-accent dark:focus:border-white outline-none transition-colors font-mono';

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SEO title="Login" description="Login to access members content and admin tools." />

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl md:text-9xl font-bold tracking-tighter text-black dark:text-brand-accent"
      >
        LOGIN
      </motion.h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-2 border-black dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900/50 transition-colors"
        >
          <h2 className="text-2xl font-bold tracking-widest mb-2">WELCOME BACK</h2>
          <p className="text-black/60 dark:text-neutral-400 font-mono text-sm leading-relaxed">
            Sign in to unlock full streaming and access your tools.
          </p>

          <div className="mt-8 border-t border-black/10 dark:border-neutral-800 pt-6">
            <p className="font-mono text-xs text-black/60 dark:text-neutral-500">
              Don’t have an account?
            </p>
            <Link
              to="/signup"
              className="inline-block mt-3 px-6 py-3 border-2 border-black text-black dark:border-brand-accent dark:text-brand-accent font-bold tracking-widest hover:bg-black hover:text-brand-accent dark:hover:bg-brand-accent dark:hover:text-black transition-all"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-2 border-black dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900 transition-colors"
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs tracking-widest mb-2 text-black/70 dark:text-neutral-400">
                USERNAME
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-xs tracking-widest mb-2 text-black/70 dark:text-neutral-400">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="font-mono text-sm text-red-600 dark:text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-brand-accent dark:bg-brand-accent dark:text-black font-bold py-3 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 tracking-[0.2em]"
            >
              {submitting ? 'SIGNING IN…' : 'SIGN IN'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
