import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Code2 } from 'lucide-react';
import { useAuth, getRoleRedirectPath } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = await login(email, password);
      navigate(getRoleRedirectPath(profile.role));
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[rgba(164,16,52,0.12)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-[rgba(164,16,52,0.12)] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A41034] to-[#C4122F] mb-4 shadow-lg shadow-[rgba(164,16,52,0.20)]">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to Binary Blitz</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-border p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@binaryblitz.dev"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/40 focus:border-[#A41034]/60 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/40 focus:border-[#A41034]/60 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#A41034] to-[#C4122F] text-white text-sm font-bold tracking-wide hover:from-rose-600 hover:to-rose-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-[rgba(164,16,52,0.20)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick login demo buttons */}
          <div className="mt-5 p-3 rounded-lg bg-[#26292D]/60 border border-border/50">
            <p className="text-[11px] text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Demo Accounts — Click to autofill</p>
            <div className="space-y-1.5">
              {[
                { label: '🔴 Admin', email: 'admin@binaryblitz.dev', pass: 'password123' },
                { label: '🟡 Trainer', email: 'trainer@binaryblitz.dev', pass: 'password123' },
                { label: '🟢 Student', email: 'student1@binaryblitz.dev', pass: 'password123' },
              ].map(({ label, email: de, pass }) => (
                <button
                  key={de}
                  type="button"
                  onClick={() => fillDemo(de, pass)}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-zinc-800/60 transition-colors text-[11px] text-zinc-400 font-mono flex items-center justify-between"
                >
                  <span className="font-semibold text-zinc-300">{label}</span>
                  <span>{de}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500">
            New to PS?{' '}
            <Link to="/register" className="text-[#A41034] hover:text-[#C4122F] font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
