import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Code2, BookOpen, Flame, TrendingUp, Clock, CheckCircle2, Activity, BarChart as ChartIcon, Calendar, Map, ChevronRight, BookMarked } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const RATING_TIERS = [
  { min: 0,    max: 1199, name: 'Newbie',              color: '#808080', bg: 'bg-gray-500/10',   text: 'text-gray-400'   },
  { min: 1200, max: 1399, name: 'Pupil',               color: '#008000', bg: 'bg-green-500/10',  text: 'text-green-400'  },
  { min: 1400, max: 1599, name: 'Specialist',          color: '#03a89e', bg: 'bg-teal-500/10',   text: 'text-teal-400'   },
  { min: 1600, max: 1899, name: 'Expert',              color: '#0000ff', bg: 'bg-[rgba(164,16,52,0.10)]',   text: 'text-[#C4122F]'   },
  { min: 1900, max: 2099, name: 'Candidate Master',    color: '#aa00aa', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  { min: 2100, max: 2299, name: 'Master',              color: '#ff8c00', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { min: 2300, max: 2399, name: 'International Master',color: '#ff8c00', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  { min: 2400, max: 2599, name: 'Grandmaster',         color: '#ff0000', bg: 'bg-red-500/10',    text: 'text-red-400'    },
  { min: 2600, max: 2899, name: 'Int. Grandmaster',    color: '#ff0000', bg: 'bg-red-500/10',    text: 'text-red-500'    },
  { min: 2900, max: 9999, name: 'Legendary GM',        color: '#ff0000', bg: 'bg-red-500/10',    text: 'text-red-500 rating-legendary' },
];

function getRatingTier(rating: number) {
  return RATING_TIERS.find(t => rating >= t.min && rating <= t.max) || RATING_TIERS[0];
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#33363B] rounded border border-[#4B4F55] p-5 hover:border-[#A41034]/40 transition-all flex items-center gap-4"
    >
      <div className={`p-3 rounded ${color}`}>{icon}</div>
      <div>
        <p className="text-[9px] text-[#9A9A9A] font-bold uppercase tracking-[0.12em]"
        >{label}</p>
        <p className="text-2xl font-bold text-[#F2F2F2] font-serif mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

function ContestCard({ contest }: { contest: any }) {
  const isRunning = contest.status === 'RUNNING';
  const isUpcoming = contest.status === 'UPCOMING';

  const formatTime = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <Link to={`/contests/${contest.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-xl border border-border p-4 glow-hover transition-all hover:border-[#A41034]/30 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isRunning && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              )}
              {isUpcoming && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(164,16,52,0.10)] text-[#C4122F] border border-[#A41034]/25">
                  UPCOMING
                </span>
              )}
              {!isRunning && !isUpcoming && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-500 border border-zinc-700">
                  ENDED
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-zinc-100 truncate">{contest.title}</p>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <Clock size={11} /> {formatTime(contest.startTime)}
            </p>
          </div>
          <div className="text-xs text-zinc-500 text-right shrink-0">
            {Math.floor(contest.durationSeconds / 3600)}h {Math.floor((contest.durationSeconds % 3600) / 60)}m
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const tier = user ? getRatingTier(user.rating || 0) : RATING_TIERS[0];

  const { data: contestsData } = useQuery({
    queryKey: ['contests'],
    queryFn: () => api.get('/contests').then(r => r.data),
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard-mini'],
    queryFn: () => api.get('/leaderboard?limit=5').then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['schedule-progress'],
    queryFn: () => api.get('/schedule/progress/summary').then(r => r.data),
    staleTime: 60_000,
  });

  const contests = contestsData?.contests || [];
  const topUsers = leaderboardData?.leaderboard || [];
  const progress = progressData || null;

  // Mock Performance Data for Recharts relative to today's date
  const getRatingHistoryData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const name = months[d.getMonth()];
      let ratingVal = 1200;
      if (i === 5) ratingVal = 1200;
      else if (i === 4) ratingVal = 1250;
      else if (i === 3) ratingVal = 1380;
      else if (i === 2) ratingVal = 1350;
      else if (i === 1) ratingVal = 1480;
      else ratingVal = user?.rating || 1540;
      data.push({ name, rating: ratingVal });
    }
    return data;
  };
  const ratingHistoryData = getRatingHistoryData();

  const topicStrengthsData = [
    { topic: 'Math', solved: 24 },
    { topic: 'DP', solved: 18 },
    { topic: 'Graphs', solved: 15 },
    { topic: 'Greedy', solved: 22 },
    { topic: 'Strings', solved: 10 },
    { topic: 'Data Struct', solved: 14 },
  ];

  // Render a mock activity calendar heatmap block (53 weeks * 7 days)
  const renderHeatmap = () => {
    const days = Array.from({ length: 364 }, (_, i) => {
      // Deterministic pseudo-random generation to look like streaks and sparse days
      const val = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
      const cluster = Math.sin(i / 15) * Math.cos(i / 7);
      let intensity = 0;
      if (cluster > 0.3) {
        intensity = val > 0.8 ? 3 : val > 0.5 ? 2 : val > 0.2 ? 1 : 0;
      } else if (cluster > -0.2) {
        intensity = val > 0.9 ? 2 : val > 0.7 ? 1 : 0;
      } else {
        intensity = val > 0.95 ? 1 : 0;
      }
      return intensity;
    });

    const getIntensityClass = (intensity: number) => {
      if (intensity === 3) return 'bg-[#A41034]';
      if (intensity === 2) return 'bg-[#7A0C24]/60';
      if (intensity === 1) return 'bg-rose-800/40';
      return 'bg-zinc-800/40';
    };

    return (
      <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-auto py-2">
        {days.map((density, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-sm shrink-0 ${getIntensityClass(density)}`}
            title={`Day ${idx + 1}: ${density} submissions`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 glass rounded-2xl border border-border"
      >
        <div className="relative">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100'}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl border-2 border-[#A41034]/30 object-cover"
          />
          <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tier.bg} ${tier.text} border border-current/20`}>
            {tier.name.split(' ')[0]}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-zinc-100">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-200">{user?.name?.split(' ')[0]}</span>!
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Rating: <span className={`font-bold ${tier.text}`}>{user?.rating || 0}</span>
            <span className="mx-1.5 text-zinc-700">·</span>
            <span className={`font-semibold ${tier.text}`}>{tier.name}</span>
            <span className="mx-1.5 text-zinc-700">·</span>
            {user?.category?.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {user?.handleCodeforces && (
            <a href={`https://codeforces.com/profile/${user.handleCodeforces}`} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[rgba(164,16,52,0.10)] text-[#C4122F] border border-[#A41034]/25 hover:bg-[#7A0C24]/20 transition-colors">
              CF: {user.handleCodeforces}
            </a>
          )}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy size={20} className="text-[#A41034]" />} label="Rating" value={user?.rating || 0} color="bg-[rgba(164,16,52,0.12)]" />
        <StatCard icon={<CheckCircle2 size={20} className="text-[#A41034]" />} label="Problems Solved" value="83" color="bg-[rgba(164,16,52,0.12)]" />
        <StatCard icon={<Code2 size={20} className="text-[#A41034]" />} label="Contests" value="12" color="bg-[rgba(164,16,52,0.12)]" />
        <StatCard icon={<Flame size={20} className="text-[#A41034]" />} label="Day Streak" value="5 days" color="bg-[rgba(164,16,52,0.12)]" />
      </div>

      {/* Schedule Progress Widget */}
      {progress ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#33363B] rounded border border-[#4B4F55] border-l-2 border-l-[#A41034] p-5 hover:border-[#A41034]/40 transition-all cursor-pointer group"
          onClick={() => navigate('/schedule')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[9px] font-bold text-[#9A9A9A] uppercase tracking-[0.14em] flex items-center gap-2">
              <Map size={13} className="text-[#A41034]" /> CP Roadmap Progress
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#A41034] font-semibold group-hover:text-[#C4122F]">
              View Tracker <ChevronRight size={12} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0 text-center">
              <p className="text-4xl font-extrabold text-zinc-100">{progress.completionPercentage}<span className="text-xl text-zinc-500">%</span></p>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-semibold uppercase tracking-wider">Complete</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2.5 rounded-full bg-zinc-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#A41034] to-[#C4122F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.completionPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Phase', value: progress.currentPhase || '—' },
                  { label: 'Week', value: `W${progress.currentWeek || 1}` },
                  { label: 'Done', value: `${progress.completedDays}/${progress.totalDays}` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2 rounded-lg bg-[#26292D]/60 border border-border/50">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold">{label}</p>
                    <p className="text-xs font-bold text-zinc-200 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#33363B] rounded border border-[#4B4F55] border-l-2 border-l-zinc-500 p-5 hover:border-[#A41034]/40 transition-all cursor-pointer group"
          onClick={() => navigate('/schedule')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[9px] font-bold text-[#9A9A9A] uppercase tracking-[0.14em] flex items-center gap-2">
              <Map size={13} className="text-zinc-500" /> CP Roadmap Progress
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#A41034] font-semibold group-hover:text-[#C4122F]">
              View Tracker <ChevronRight size={12} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Track Your Daily Coding Roadmap</p>
              <p className="text-xs text-zinc-500 mt-1">Keep track of your training, solve problem sets, and prepare for contests.</p>
            </div>
            <button className="btn-crimson shrink-0 self-start md:self-auto text-xs py-1.5 px-4 rounded">
              Start Training
            </button>
          </div>
        </motion.div>
      )}

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Progress Graph */}
        <div className="bg-[#33363B] rounded border border-[#4B4F55] p-5 space-y-4">
          <h3 className="text-[9px] font-bold text-[#9A9A9A] uppercase tracking-[0.14em] flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#A41034]" /> Rating Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingHistoryData}>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#33363B', borderColor: '#4B4F55' }}
                  labelStyle={{ color: '#F2F2F2', fontSize: 12 }}
                  itemStyle={{ color: '#A41034', fontSize: 11 }}
                />
                <Line type="monotone" dataKey="rating" stroke="#A41034" strokeWidth={2} dot={{ fill: '#A41034' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Strengths Radar/Bar Graph */}
        <div className="bg-[#33363B] rounded border border-[#4B4F55] p-5 space-y-4">
          <h3 className="text-[9px] font-bold text-[#9A9A9A] uppercase tracking-[0.14em] flex items-center gap-1.5">
            <ChartIcon size={14} className="text-[#C4122F]" /> Topic Strengths
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicStrengthsData}>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                <XAxis dataKey="topic" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#33363B', borderColor: '#4B4F55' }}
                  labelStyle={{ color: '#F2F2F2', fontSize: 12 }}
                  itemStyle={{ color: '#C4122F', fontSize: 11 }}
                />
                <Bar dataKey="solved" fill="#A41034" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap calendar */}
      <div className="bg-[#33363B] rounded border border-[#4B4F55] p-5 space-y-4">
        <h3 className="text-[9px] font-bold text-[#9A9A9A] uppercase tracking-[0.14em] flex items-center gap-1.5">
          <Calendar size={14} className="text-[#A41034]" /> Activity Calendar
        </h3>
        <div className="overflow-x-auto">
          {renderHeatmap()}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-800/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-800/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#7A0C24]/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#A41034]" />
          <span>More</span>
        </div>
      </div>

      {/* Contests + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contests Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-semibold text-[#F2F2F2] flex items-center gap-2">
              <Trophy size={16} className="text-[#A41034]" /> Contests
            </h3>
            <Link to="/contests" className="text-[9px] uppercase tracking-widest font-bold text-[#A41034] hover:text-[#C4122F]">View all →</Link>
          </div>
          <div className="space-y-3">
            {contests.length === 0 ? (
              <div className="text-center text-zinc-600 text-sm py-10 glass rounded-xl border border-border">No contests found.</div>
            ) : (
              contests.slice(0, 5).map((c: any) => <ContestCard key={c.id} contest={c} />)
            )}
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-semibold text-[#F2F2F2] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#A41034]" /> Top Coders
            </h3>
            <Link to="/leaderboard" className="text-[9px] uppercase tracking-widest font-bold text-[#A41034] hover:text-[#C4122F]">Full board →</Link>
          </div>
          <div className="bg-[#33363B] rounded border border-[#4B4F55] overflow-hidden">
            {topUsers.map((u: any, i: number) => {
              const t = getRatingTier(u.rating);
              return (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-zinc-900/40 transition-colors">
                  <span className="text-xs font-bold text-zinc-600 w-5 text-right">#{i + 1}</span>
                  <img src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40'} alt="av" className="w-7 h-7 rounded-full border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">{u.name}</p>
                    <p className={`text-[10px] font-bold ${t.text}`}>{t.name}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">{u.rating}</span>
                </div>
              );
            })}
            {topUsers.length === 0 && (
              <div className="text-center text-zinc-600 text-xs py-6">Loading leaderboard...</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
          <Activity size={16} className="text-zinc-400" /> Quick Access
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Solve Problems', desc: 'Browse problem set', icon: Code2, to: '/problems', color: 'from-indigo-600/20 to-indigo-600/5 border-indigo-600/20 hover:border-[#A41034]/40' },
            { label: 'Active Contest', desc: 'Join running contests', icon: Trophy, to: '/contests', color: 'from-[rgba(164,16,52,0.15)] to-[rgba(164,16,52,0.05)] border-[rgba(164,16,52,0.2)] hover:border-[rgba(164,16,52,0.4)]' },
            { label: 'Schedule Tracker', desc: 'Daily CP roadmap', icon: Map, to: '/schedule', color: 'from-rose-800/25 to-rose-800/10 border-rose-700/25 hover:border-[#A41034]/40' },
            { label: 'Learning Hub', desc: 'Books, slides, notes', icon: BookOpen, to: '/learning', color: 'from-rose-700/20 to-cyan-600/5 border-rose-700/20 hover:border-[#C4122F]/40' },
          ].map(({ label, desc, icon: Icon, to, color }) => (
            <Link key={label} to={to}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-5 rounded-xl bg-gradient-to-b ${color} border cursor-pointer transition-all`}
              >
                <Icon size={22} className="text-zinc-300 mb-3" />
                <p className="text-sm font-bold text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
