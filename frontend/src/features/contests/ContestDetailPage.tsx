import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, Trophy, AlertCircle, Loader2, ChevronRight, Timer } from 'lucide-react';
import api from '../../services/api';

function useCountdown(endTime: string) {
  const [remaining, setRemaining] = useState('');
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) { setIsOver(true); setRemaining('00:00:00'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return { remaining, isOver };
}

export default function ContestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'problems' | 'scoreboard' | 'announcements'>('problems');

  const { data: contestData, isLoading: contestLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => api.get(`/contests/${id}`).then(r => r.data),
  });

  const { data: scoreboardData, isLoading: scoreLoading } = useQuery({
    queryKey: ['scoreboard', id],
    queryFn: () => api.get(`/contests/${id}/scoreboard`).then(r => r.data),
    enabled: activeTab === 'scoreboard',
    refetchInterval: activeTab === 'scoreboard' ? 15000 : false,
  });

  const contest = contestData?.contest;
  const { remaining } = useCountdown(contest?.endTime || new Date().toISOString());

  const isLessThanTenMin = contest && (new Date(contest.endTime).getTime() - Date.now()) < 10 * 60 * 1000;

  if (contestLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-[#A41034]" /></div>;
  }
  if (!contest) {
    return <div className="text-center py-20 text-zinc-500">Contest not found.</div>;
  }

  const standings = scoreboardData?.standings || [];
  const contestProblems = scoreboardData?.problems || [];

  return (
    <div className="space-y-6">
      {/* Contest Header */}
      <div className="glass rounded-2xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {contest.status === 'RUNNING' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                </span>
              )}
              {contest.status === 'UPCOMING' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[rgba(164,16,52,0.10)] text-[#C4122F] border border-[#A41034]/25">UPCOMING</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-100">{contest.title}</h1>
            {contest.description && (
              <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{contest.description}</p>
            )}
            <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1">
              <Clock size={11} />
              {new Date(contest.startTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              {' → '}
              {new Date(contest.endTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          {/* Timer */}
          {contest.status === 'RUNNING' && (
            <div className={`flex flex-col items-center p-4 rounded-xl border ${isLessThanTenMin ? 'bg-red-500/10 border-red-500/30' : 'bg-[#26292D]/60 border-border'} min-w-[140px]`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1">
                <Timer size={10} /> Time Remaining
              </p>
              <p className={`text-3xl font-extrabold font-mono tracking-widest ${isLessThanTenMin ? 'text-red-400' : 'text-zinc-100'}`}>
                {remaining}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {(['problems', 'scoreboard', 'announcements'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? 'text-[#A41034] border-[#A41034]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
          >
            {tab}
            {tab === 'scoreboard' && activeTab === 'scoreboard' && scoreLoading && <Loader2 size={10} className="inline animate-spin ml-1" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'problems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contest.problems.map((cp: any) => (
            <motion.div
              key={cp.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-xl border border-border p-5 glow-hover hover:border-[#A41034]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-extrabold text-[#A41034]">{cp.alias}</span>
                <span className="text-xs font-bold text-zinc-500">{cp.score} pts</span>
              </div>
              <p className="text-sm font-bold text-zinc-200 mb-2">{cp.problem.title}</p>
              <div className="flex flex-wrap gap-1">
                {cp.problem.tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-500 border border-zinc-700">{t}</span>
                ))}
              </div>
              <Link to={`/problems/${cp.problem.id}`}
                className="mt-4 flex items-center gap-1 text-xs text-[#A41034] hover:text-[#C4122F] font-semibold transition-colors">
                Solve <ChevronRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'scoreboard' && (
        <div className="glass rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-zinc-900/40">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Participant</th>
                {contestProblems.map((cp: any) => (
                  <th key={cp.problemId} className="text-center px-3 py-3.5 text-xs font-bold text-[#A41034] uppercase">{cp.alias}</th>
                ))}
                <th className="text-center px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Solved</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {standings.length === 0 ? (
                <tr>
                  <td colSpan={4 + contestProblems.length} className="text-center py-12 text-zinc-600 text-sm">
                    <Trophy size={36} className="mx-auto mb-2 opacity-20" />
                    No submissions yet. Scoreboard will update in real-time.
                  </td>
                </tr>
              ) : (
                standings.map((entry: any, i: number) => (
                  <motion.tr
                    key={entry.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-border/50 hover:bg-[#26292D]/50 transition-colors ${i < 3 ? 'bg-gradient-to-r from-yellow-500/3 to-transparent' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-orange-500' : 'text-zinc-600'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-zinc-200">{entry.userName}</td>
                    {contestProblems.map((cp: any) => {
                      const probEntry = entry.problems[cp.problemId];
                      return (
                        <td key={cp.problemId} className="text-center px-3 py-3.5">
                          {probEntry?.solved ? (
                            <span className="text-green-400 text-xs font-mono">+{probEntry.attemptsBeforeSolve > 0 ? probEntry.attemptsBeforeSolve : ''} <span className="text-zinc-600">{probEntry.solvedTimeMinutes}m</span></span>
                          ) : probEntry?.attemptsBeforeSolve > 0 ? (
                            <span className="text-red-400 text-xs font-mono">-{probEntry.attemptsBeforeSolve}</span>
                          ) : (
                            <span className="text-zinc-700 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center px-5 py-3.5 text-sm font-bold text-zinc-200">{entry.solvedCount}</td>
                    <td className="text-center px-5 py-3.5 text-xs font-mono text-zinc-500">{entry.totalPenalty}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="glass rounded-xl border border-border p-8 text-center text-zinc-600 text-sm">
          <AlertCircle size={36} className="mx-auto mb-3 opacity-30" />
          <p>No announcements yet. Contest admin updates will appear here in real-time.</p>
        </div>
      )}
    </div>
  );
}
