import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Map, ChevronDown, ChevronRight, Search, Filter, CheckCircle2,
  Circle, BookOpen, Code2, Trophy, Coffee, Zap, Calendar,
  TrendingUp, Clock, ExternalLink, Loader2, AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../auth/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DayResource { id: string; title: string; resourceType: string; url: string; description?: string; }
interface DayProgress { id: string; studentId: string; dayId: string; completed: boolean; }
interface Day {
  id: string; weekId: string; dayNumber: number; date: string; type: string;
  title: string; description?: string; status: string;
  resources: DayResource[]; progress?: DayProgress[];
}
interface Week { id: string; phaseId: string; weekNumber: number; startDate: string; endDate: string; days: Day[]; }
interface Phase { id: string; title: string; description?: string; phaseOrder: number; startDate: string; endDate: string; weeks: Week[]; }

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; badge: string }> = {
  Theory:        { icon: <BookOpen size={14} />, label: 'Theory', color: 'text-[#C4122F]', badge: 'bg-[rgba(164,16,52,0.10)] text-[#C4122F] border-[#A41034]/25' },
  'Problem Set': { icon: <Code2 size={14} />, label: 'Problem Set', color: 'text-[#A41034]', badge: 'bg-[rgba(164,16,52,0.10)] text-[#A41034] border-[#A41034]/20' },
  Preparation:   { icon: <Zap size={14} />, label: 'Preparation', color: 'text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  Contest:       { icon: <Trophy size={14} />, label: 'Contest', color: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  'Off Day':     { icon: <Coffee size={14} />, label: 'Off Day', color: 'text-zinc-500', badge: 'bg-zinc-800 text-zinc-500 border-zinc-700' },
};

const STATUS_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  Published:  { label: 'Published', dotClass: 'bg-green-400', textClass: 'text-green-400' },
  Upcoming:   { label: 'Upcoming', dotClass: 'bg-blue-400', textClass: 'text-[#C4122F]' },
  Locked:     { label: 'Locked', dotClass: 'bg-zinc-600', textClass: 'text-zinc-500' },
  Completed:  { label: 'Completed', dotClass: 'bg-indigo-400', textClass: 'text-[#A41034]' },
};

const RESOURCE_TYPE_COLORS: Record<string, string> = {
  Slide: 'text-[#C4122F]', PDF: 'text-red-400', 'Drive Link': 'text-green-400',
  YouTube: 'text-red-500', 'Problem Set': 'text-[#A41034]', 'Contest Link': 'text-orange-400',
  'External URL': 'text-zinc-400', Notes: 'text-[#C4122F]',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function DayCard({ day, onToggle, isToggling }: {
  day: Day; onToggle: (dayId: string) => void; isToggling: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = DAY_TYPE_CONFIG[day.type] || DAY_TYPE_CONFIG['Theory'];
  const statusConfig = STATUS_CONFIG[day.status] || STATUS_CONFIG['Upcoming'];
  const isCompleted = (day.progress?.length ?? 0) > 0;
  const isOffDay = day.type === 'Off Day';
  const isLocked = day.status === 'Locked';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass rounded-xl border transition-all ${
        isCompleted ? 'border-green-500/20 bg-green-500/3' : 'border-border hover:border-zinc-700'
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => !isOffDay && !isLocked && setExpanded(!expanded)}
      >
        {/* Completion Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); if (!isOffDay && !isLocked) onToggle(day.id); }}
          disabled={isToggling || isOffDay || isLocked}
          className={`shrink-0 transition-all ${isOffDay || isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
        >
          {isToggling ? (
            <Loader2 size={18} className="animate-spin text-[#A41034]" />
          ) : isCompleted ? (
            <CheckCircle2 size={18} className="text-green-400" />
          ) : (
            <Circle size={18} className="text-zinc-600" />
          )}
        </button>

        {/* Day Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${typeConfig.color}`}>
              Day {day.dayNumber}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeConfig.badge}`}>
              {typeConfig.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-600">
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
              <span className={statusConfig.textClass}>{statusConfig.label}</span>
            </span>
          </div>
          <p className={`text-sm font-semibold mt-0.5 truncate ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
            {day.title}
          </p>
        </div>

        {/* Date & Expand */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-zinc-600 font-mono hidden sm:block">
            {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
          {!isOffDay && !isLocked && day.resources.length > 0 && (
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={14} className="text-zinc-600" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Expanded Resources */}
      <AnimatePresence>
        {expanded && day.resources.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-border/40 space-y-2">
              {day.description && (
                <p className="text-xs text-zinc-500 leading-relaxed">{day.description}</p>
              )}
              <div className="space-y-1.5">
                {day.resources.map(res => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#26292D]/60 hover:bg-zinc-800/60 border border-border/50 hover:border-zinc-700 transition-all group"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 ${RESOURCE_TYPE_COLORS[res.resourceType] || 'text-zinc-400'}`}>
                      {res.resourceType}
                    </span>
                    <span className="text-xs text-zinc-300 font-medium group-hover:text-zinc-100 flex-1 truncate">{res.title}</span>
                    <ExternalLink size={11} className="text-zinc-600 group-hover:text-[#A41034] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WeekAccordion({ week, phaseId, onToggleDay, togglingDayId }: {
  week: Week; phaseId: string; onToggleDay: (dayId: string) => void; togglingDayId: string | null;
}) {
  const [open, setOpen] = useState(week.weekNumber <= 2);
  const completedDays = week.days.filter(d => (d.progress?.length ?? 0) > 0).length;
  const totalDays = week.days.filter(d => d.type !== 'Off Day').length;
  const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-3.5 bg-[#26292D]/50 hover:bg-[#26292D]/60 transition-colors text-left"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} className="text-zinc-500" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-zinc-200">Week {week.weekNumber}</span>
            <span className="text-[10px] font-mono text-zinc-600">
              {new Date(week.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} –{' '}
              {new Date(week.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </span>
          </div>
          {/* Week progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#A41034] to-[#C4122F]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 shrink-0">{completedDays}/{totalDays}</span>
          </div>
        </div>
        <span className={`text-sm font-bold shrink-0 ${pct === 100 ? 'text-green-400' : 'text-zinc-500'}`}>{pct}%</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2.5 bg-zinc-950/20">
              {week.days.length === 0 ? (
                <p className="text-center text-xs text-zinc-600 py-4">No sessions scheduled yet.</p>
              ) : (
                week.days.map(day => (
                  <DayCard
                    key={day.id}
                    day={day}
                    onToggle={onToggleDay}
                    isToggling={togglingDayId === day.id}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScheduleTrackerPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [togglingDayId, setTogglingDayId] = useState<string | null>(null);

  // Fetch roadmap data
  const { data: phasesData, isLoading, isError } = useQuery({
    queryKey: ['schedule-phases', search, filterType, filterStatus],
    queryFn: () => api.get('/schedule/phases', {
      params: {
        search: search || undefined,
        filterType: filterType || undefined,
        filterStatus: filterStatus || undefined,
      }
    }).then(r => r.data),
    staleTime: 30_000,
  });

  // Fetch progress summary
  const { data: progressData } = useQuery({
    queryKey: ['schedule-progress'],
    queryFn: () => api.get('/schedule/progress/summary').then(r => r.data),
    staleTime: 30_000,
  });

  // Toggle day completion
  const toggleMutation = useMutation({
    mutationFn: (dayId: string) => api.post('/schedule/progress/toggle', { dayId }),
    onMutate: (dayId) => { setTogglingDayId(dayId); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-phases'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-progress'] });
    },
    onSettled: () => { setTogglingDayId(null); },
  });

  const phases: Phase[] = phasesData?.phases || [];
  const progress = progressData || { totalDays: 0, completedDays: 0, remainingDays: 0, completionPercentage: 0, currentPhase: '—', currentWeek: 1, currentDay: 1 };

  // Initialize expanded phases
  React.useEffect(() => {
    const phaseIds = phases.map(p => p.id);
    if (phaseIds.length > 0 && Object.keys(expandedPhases).length === 0) {
      setExpandedPhases(Object.fromEntries(phaseIds.map((id, i) => [id, i === 0])));
    }
  }, [phases, expandedPhases]);

  const togglePhase = (id: string) => setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));

  const handleToggleDay = (dayId: string) => toggleMutation.mutate(dayId);

  // Flatten days for calendar/today view
  const today = new Date().toDateString();
  const todaysSessions = useMemo(() => {
    const sessions: Array<Day & { weekNumber: number; phaseTitle: string }> = [];
    phases.forEach(phase => {
      phase.weeks.forEach(week => {
        week.days.forEach(day => {
          if (new Date(day.date).toDateString() === today) {
            sessions.push({ ...day, weekNumber: week.weekNumber, phaseTitle: phase.title });
          }
        });
      });
    });
    return sessions;
  }, [phases, today]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
            <Map size={22} className="text-[#A41034]" /> Schedule Tracker
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Your CP roadmap — phases, weeks, and daily sessions</p>
        </div>
        <Link
          to="/calendar"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#33363B]/60 border border-border text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all"
        >
          <Calendar size={14} /> Calendar View
        </Link>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-border p-5 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={13} className="text-[#A41034]" /> Overall Progress
            </h2>
            <p className="text-3xl font-extrabold text-zinc-100">
              {progress.completionPercentage}<span className="text-zinc-500 text-lg">%</span>
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {[
              { label: 'Current Phase', value: progress.currentPhase || '—' },
              { label: 'Current Week', value: `Week ${progress.currentWeek || 1}` },
              { label: 'Days Completed', value: progress.completedDays },
              { label: 'Days Remaining', value: progress.remainingDays },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-zinc-900/40 border border-border/50">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-sm font-bold text-zinc-100 mt-1 truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-700 via-rose-600 to-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress.completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
            <span>{progress.completedDays} completed</span>
            <span>{progress.totalDays} total sessions</span>
          </div>
        </div>
      </motion.div>

      {/* Today's Sessions */}
      {todaysSessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-[#A41034]/20 p-5 space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={13} className="text-[#A41034]" /> Today's Sessions
          </h2>
          <div className="space-y-2">
            {todaysSessions.map(day => (
              <DayCard key={day.id} day={day} onToggle={handleToggleDay} isToggling={togglingDayId === day.id} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Search & Filters */}
      <div className="glass rounded-xl border border-border p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="schedule-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phases, days, topics, resources..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#A41034]/30 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Filter size={14} className="self-center text-zinc-600" />
          {['Theory', 'Problem Set', 'Preparation', 'Contest', 'Off Day'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? '' : t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                filterType === t
                  ? 'bg-[rgba(164,16,52,0.12)] text-[#A41034] border-[#A41034]/40'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-400'
              }`}
            >
              {t}
            </button>
          ))}
          {['Published', 'Upcoming', 'Locked', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                filterStatus === s
                  ? 'bg-[rgba(164,16,52,0.12)] text-[#A41034] border-[#A41034]/40'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#A41034]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-3 text-zinc-600">
          <AlertCircle size={40} className="opacity-40" />
          <p className="text-sm">Failed to load roadmap. Check your connection or Supabase config.</p>
        </div>
      ) : phases.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-zinc-600">
          <Map size={40} className="opacity-20" />
          <p className="text-sm">No roadmap phases found. {user?.role === 'TRAINER' || user?.role === 'ADMIN' ? 'Start by creating a Phase from the Manage Schedule page.' : 'Ask your instructor to set up the roadmap.'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {phases.map((phase, phaseIdx) => {
            const isOpen = expandedPhases[phase.id] ?? phaseIdx === 0;
            const totalPhaseDays = phase.weeks.flatMap(w => w.days).filter(d => d.type !== 'Off Day').length;
            const completedPhaseDays = phase.weeks.flatMap(w => w.days).filter(d => (d.progress?.length ?? 0) > 0 && d.type !== 'Off Day').length;
            const phasePct = totalPhaseDays > 0 ? Math.round((completedPhaseDays / totalPhaseDays) * 100) : 0;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phaseIdx * 0.06 }}
                className="glass rounded-2xl border border-border overflow-hidden"
              >
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-indigo-600/5 to-cyan-600/5 hover:from-indigo-600/10 hover:to-cyan-600/10 transition-all text-left border-b border-border"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold text-white shrink-0 bg-gradient-to-br from-[#A41034] to-[#C4122F] shadow-lg shadow-[rgba(164,16,52,0.20)]`}>
                    {phase.phaseOrder}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-zinc-100">{phase.title}</h3>
                    {phase.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{phase.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 max-w-[160px]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#A41034] to-[#C4122F]"
                          initial={{ width: 0 }}
                          animate={{ width: `${phasePct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{phasePct}% — {completedPhaseDays}/{totalPhaseDays} sessions</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-600">
                      {new Date(phase.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} →{' '}
                      {new Date(phase.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[10px] text-zinc-500">{phase.weeks.length} weeks</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={16} className="text-zinc-500" />
                  </motion.div>
                </button>

                {/* Phase Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {phase.weeks.map(week => (
                          <WeekAccordion
                            key={week.id}
                            week={week}
                            phaseId={phase.id}
                            onToggleDay={handleToggleDay}
                            togglingDayId={togglingDayId}
                          />
                        ))}
                        {phase.weeks.length === 0 && (
                          <p className="text-center text-xs text-zinc-600 py-6">No weeks scheduled in this phase yet.</p>
                        )}
                      </div>

                      {/* Phase End Banner */}
                      {phaseIdx < phases.length - 1 && (
                        <div className="mx-6 mb-5 p-3 rounded-xl bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/10 flex items-center gap-2">
                          <Trophy size={14} className="text-orange-400 shrink-0" />
                          <p className="text-xs font-semibold text-zinc-400">
                            Phase Final Contest + 1 Week Break → Phase {phase.phaseOrder + 1}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
