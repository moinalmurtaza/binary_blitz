import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Code2, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', handleCodeforces: '', handleGithub: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      // Supabase sends a confirmation email by default.
      // If email confirmation is disabled in Supabase dashboard, redirect directly.
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[rgba(164,16,52,0.12)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-[rgba(164,16,52,0.12)] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A41034] to-[#C4122F] mb-4 shadow-lg shadow-[rgba(164,16,52,0.20)]">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Join Binary Blitz</h1>
          <p className="mt-2 text-sm text-zinc-500">Start your competitive programming journey</p>
        </div>

        <div className="glass rounded-2xl border border-border p-8 shadow-2xl">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <CheckCircle2 size={48} className="text-green-400 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-100">Account Created!</h3>
              <p className="text-sm text-zinc-400">
                Check your email to confirm your account, then you'll be redirected to your dashboard.
              </p>
              <div className="text-xs text-zinc-600">Redirecting in 3 seconds…</div>
            </motion.div>
          ) : (
          <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@binaryblitz.dev' },
              { label: 'Codeforces Handle', name: 'handleCodeforces', type: 'text', placeholder: 'your_cf_handle (optional)' },
              { label: 'GitHub Username', name: 'handleGithub', type: 'text', placeholder: 'your-github (optional)' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
                <input
                  id={`register-${name}`}
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={name === 'name' || name === 'email'}
                  className="w-full px-4 py-3 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/40 focus:border-[#A41034]/60 transition-all"
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/40 focus:border-[#A41034]/60 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#A41034] to-[#C4122F] text-white text-sm font-bold tracking-wide hover:from-rose-600 hover:to-rose-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-[rgba(164,16,52,0.20)] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#A41034] hover:text-[#C4122F] font-semibold">Sign in</Link>
          </p>
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
