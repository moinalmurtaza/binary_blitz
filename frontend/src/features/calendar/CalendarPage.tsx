import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const EVENT_COLORS: Record<string, { badge: string; border: string }> = {
  CONTEST: { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', border: 'border-l-yellow-500' },
  LECTURE: { badge: 'bg-[rgba(164,16,52,0.10)] text-[#C4122F] border-[#A41034]/25', border: 'border-l-cyan-500' },
  MEETING: { badge: 'bg-[rgba(164,16,52,0.10)] text-[#A41034] border-[#A41034]/20', border: 'border-l-indigo-500' },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // In a full production system, events would load from an API (e.g. GET /events?month=...)
  // We seeded one event: 'CSE Orientation & CP Intro Session' (type: LECTURE)
  // Let's mock a set of events for the current month view
  const events = [
    {
      id: 'evt-1',
      title: 'Binary Blitz Weekly Training Round #1',
      description: 'Main weekly selection round for beginner and intermediate groups.',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12, 18, 0).toISOString(),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12, 21, 0).toISOString(),
      type: 'CONTEST',
      meetLink: null,
    },
    {
      id: 'evt-2',
      title: 'Graph Theory: Bridges & Articulation Points',
      description: 'Intermediate lecture covering bridges, articulation points, and biconnected components by Dr. John Doe.',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 14, 30).toISOString(),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 16, 30).toISOString(),
      type: 'LECTURE',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: 'evt-3',
      title: 'Alumni Q&A Mentorship Session',
      description: 'Q&A session with Jane Smith on Google hiring cycles and ICPC preparation patterns.',
      startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24, 20, 0).toISOString(),
      endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24, 21, 30).toISOString(),
      type: 'MEETING',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    }
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Generate date array
  const calendarCells = [];
  // Empty blocks before the first day
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const eDate = new Date(e.startTime);
      return eDate.getDate() === date.getDate() &&
             eDate.getMonth() === date.getMonth() &&
             eDate.getFullYear() === date.getFullYear();
    });
  };

  const currentMonthEvents = events.filter(e => {
    const eDate = new Date(e.startTime);
    return eDate.getMonth() === currentDate.getMonth() &&
           eDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100">Event Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">Binary Blitz class, contests and selection milestones schedule</p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 bg-[#33363B]/60 border border-border px-3 py-1.5 rounded-xl shrink-0">
          <button onClick={prevMonth} className="p-1 hover:text-[#A41034] transition-colors text-zinc-500"><ChevronLeft size={16} /></button>
          <span className="text-xs font-bold text-zinc-300 min-w-[100px] text-center font-mono">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 hover:text-[#A41034] transition-colors text-zinc-500"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid View */}
        <div className="lg:col-span-2 glass rounded-2xl border border-border p-5">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (cell === null) {
                return <div key={`empty-${idx}`} className="h-12 bg-zinc-950/20 border border-transparent rounded-lg" />;
              }

              const dayEvents = getEventsForDate(cell);
              const isToday = new Date().toDateString() === cell.toDateString();

              return (
                <div
                  key={`day-${cell.getDate()}`}
                  className={`h-12 p-1.5 border rounded-lg flex flex-col justify-between transition-colors ${
                    isToday 
                      ? 'border-[#A41034] bg-[rgba(164,16,52,0.06)]' 
                      : 'border-border/60 bg-zinc-900/10 hover:border-zinc-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isToday ? 'text-[#A41034]' : 'text-zinc-500'}`}>{cell.getDate()}</span>
                  <div className="flex gap-0.5 mt-1 overflow-hidden">
                    {dayEvents.map(e => (
                      <div key={e.id} className="group relative flex-1">
                        <div
                          className={`w-full h-1.5 rounded-full ${
                            e.type === 'CONTEST' ? 'bg-yellow-500' : e.type === 'LECTURE' ? 'bg-[#A41034]' : 'bg-indigo-500'
                          }`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 bg-zinc-950 border border-border px-2 py-1 rounded text-[9px] font-bold text-white whitespace-nowrap shadow-xl">
                          {e.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Listing Pane */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarIcon size={14} className="text-[#A41034]" /> Events in {monthNames[currentDate.getMonth()]}
          </h2>

          <div className="space-y-3">
            {currentMonthEvents.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 text-xs border border-border/40 rounded-xl bg-zinc-900/10">
                No events scheduled for this month.
              </div>
            ) : (
              currentMonthEvents.map((evt, idx) => {
                const cfg = EVENT_COLORS[evt.type] || { badge: 'text-zinc-400 bg-zinc-800 border-zinc-700', border: 'border-l-zinc-700' };
                const start = new Date(evt.startTime);
                const startFmt = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                const timeFmt = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`glass rounded-xl border border-border border-l-4 ${cfg.border} p-4 space-y-3 glow-hover`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${cfg.badge}`}>
                          {evt.type}
                        </span>
                        <span className="text-[10px] font-bold text-[#A41034] flex items-center gap-1 font-mono">
                          <Clock size={10} /> {startFmt} @ {timeFmt}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-zinc-200 line-clamp-1">{evt.title}</h3>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{evt.description}</p>
                    </div>

                    {evt.meetLink && (
                      <a
                        href={evt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#A41034] hover:text-[#C4122F] transition-colors"
                      >
                        <LinkIcon size={10} /> Google Meet Link
                      </a>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
