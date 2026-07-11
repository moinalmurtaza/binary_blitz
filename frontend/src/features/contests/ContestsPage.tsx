import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const STATUS_CONFIG = {
  RUNNING: { label: 'LIVE', color: 'text-green-400 bg-green-500/15 border-green-500/20', dot: 'bg-green-400 animate-pulse' },
  UPCOMING: { label: 'UPCOMING', color: 'text-[#C4122F] bg-[rgba(164,16,52,0.10)] border-[#A41034]/25', dot: 'bg-blue-400' },
  ENDED: { label: 'ENDED', color: 'text-zinc-500 bg-zinc-800 border-zinc-700', dot: 'bg-zinc-600' },
  FROZEN: { label: 'FROZEN', color: 'text-[#C4122F] bg-[rgba(164,16,52,0.10)] border-[#A41034]/25', dot: 'bg-[#C4122F]' },
};

function ContestRow({ contest, index }: { contest: any; index: number }) {
  const cfg = STATUS_CONFIG[contest.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ENDED;
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  const duration = Math.floor(contest.durationSeconds / 3600);
  const durationMin = Math.floor((contest.durationSeconds % 3600) / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/contests/${contest.id}`}>
        <div className="glass rounded-xl border border-border p-5 glow-hover hover:border-[#A41034]/30 transition-all cursor-pointer">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-100 truncate">{contest.title}</h3>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <Clock size={11} />
                {start.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                {' → '}
                {end.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Duration</p>
                <p className="text-sm font-bold text-zinc-300">{duration}h {durationMin}m</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">By</p>
                <p className="text-sm font-bold text-zinc-300 truncate max-w-[120px]">{contest.creator?.name || '—'}</p>
              </div>
              <ChevronRight size={18} className="text-zinc-600 group-hover:text-[#A41034] transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ContestsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: () => api.get('/contests').then(r => r.data),
  });

  const contests = data?.contests || [];

  const running = contests.filter((c: any) => c.status === 'RUNNING');
  const upcoming = contests.filter((c: any) => c.status === 'UPCOMING');
  const ended = contests.filter((c: any) => c.status === 'ENDED' || c.status === 'FROZEN');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100">Contests</h1>
        <p className="text-sm text-zinc-500 mt-1">Compete and track your performance in rated and unrated contests</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#A41034]" />
        </div>
      )}

      {!isLoading && (
        <>
          {running.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Now
              </h2>
              <div className="space-y-3">
                {running.map((c: any, i: number) => <ContestRow key={c.id} contest={c} index={i} />)}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#C4122F] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Trophy size={14} /> Upcoming
              </h2>
              <div className="space-y-3">
                {upcoming.map((c: any, i: number) => <ContestRow key={c.id} contest={c} index={i} />)}
              </div>
            </section>
          )}

          {ended.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Past Contests</h2>
              <div className="space-y-3">
                {ended.map((c: any, i: number) => <ContestRow key={c.id} contest={c} index={i} />)}
              </div>
            </section>
          )}

          {contests.length === 0 && (
            <div className="text-center py-20 text-zinc-600">
              <Trophy size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No contests available yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
