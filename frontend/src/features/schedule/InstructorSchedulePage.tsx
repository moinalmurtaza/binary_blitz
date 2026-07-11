import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, ChevronDown, ChevronRight, Save,
  BookOpen, Code2, Trophy, Coffee, Zap, Loader2, X,
  CalendarDays, Map, Link as LinkIcon, FileText, AlertCircle, Check
} from 'lucide-react';
import api from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Phase { id: string; title: string; description?: string; phaseOrder: number; startDate: string; endDate: string; weeks: Week[]; }
interface Week { id: string; phaseId: string; weekNumber: number; startDate: string; endDate: string; days: Day[]; }
interface Day { id: string; weekId: string; dayNumber: number; date: string; type: string; title: string; description?: string; status: string; resources: DayResource[]; }
interface DayResource { id: string; dayId: string; title: string; resourceType: string; url: string; description?: string; }

const DAY_TYPES = ['Theory', 'Problem Set', 'Preparation', 'Contest', 'Off Day'];
const DAY_STATUSES = ['Locked', 'Upcoming', 'Published', 'Completed'];
const RESOURCE_TYPES = ['Slide', 'PDF', 'Drive Link', 'YouTube', 'Problem Set', 'Contest Link', 'External URL', 'Notes'];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Theory: <BookOpen size={12} className="text-[#C4122F]" />,
  'Problem Set': <Code2 size={12} className="text-[#A41034]" />,
  Preparation: <Zap size={12} className="text-yellow-400" />,
  Contest: <Trophy size={12} className="text-orange-400" />,
  'Off Day': <Coffee size={12} className="text-zinc-500" />,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${
        type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
      }`}
    >
      {type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
      {message}
      <button onClick={onClose} className="ml-2 text-zinc-500 hover:text-zinc-300"><X size={12} /></button>
    </motion.div>
  );
}

// ─── Inline Form Fields ───────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034] focus:outline-none placeholder-zinc-600";
const selectCls = "w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034] focus:outline-none";

// ─── Phase Form Modal ─────────────────────────────────────────────────────────
function PhaseFormModal({ initial, onSave, onClose, isLoading }: {
  initial?: Partial<Phase>; onSave: (d: any) => void; onClose: () => void; isLoading: boolean;
}) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    phaseOrder: initial?.phaseOrder ?? '',
    startDate: initial?.startDate ? initial.startDate.slice(0, 10) : '',
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : '',
  });
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md glass rounded-2xl border border-border p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-zinc-100">{initial?.id ? 'Edit Phase' : 'New Phase'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>
        <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Phase 1: Basic Programming" /></Field>
        <Field label="Description"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Order"><input type="number" className={inputCls} value={form.phaseOrder} onChange={e => setForm({ ...form, phaseOrder: e.target.value })} placeholder="1" /></Field>
          <Field label="Start Date"><input type="date" className={inputCls} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field>
          <Field label="End Date"><input type="date" className={inputCls} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Field>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {initial?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Week Form Modal ──────────────────────────────────────────────────────────
function WeekFormModal({ phaseId, initial, onSave, onClose, isLoading }: {
  phaseId: string; initial?: Partial<Week>; onSave: (d: any) => void; onClose: () => void; isLoading: boolean;
}) {
  const [form, setForm] = useState({
    weekNumber: initial?.weekNumber ?? '',
    startDate: initial?.startDate ? initial.startDate.slice(0, 10) : '',
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : '',
  });
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm glass rounded-2xl border border-border p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-zinc-100">{initial?.id ? 'Edit Week' : 'New Week'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Week #"><input type="number" className={inputCls} value={form.weekNumber} onChange={e => setForm({ ...form, weekNumber: e.target.value })} placeholder="1" /></Field>
          <Field label="Start Date"><input type="date" className={inputCls} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field>
          <Field label="End Date"><input type="date" className={inputCls} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Field>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => onSave({ ...form, phaseId })} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {initial?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Day Form Modal ───────────────────────────────────────────────────────────
function DayFormModal({ weekId, initial, onSave, onClose, isLoading }: {
  weekId: string; initial?: Partial<Day>; onSave: (d: any) => void; onClose: () => void; isLoading: boolean;
}) {
  const [form, setForm] = useState({
    dayNumber: initial?.dayNumber ?? '',
    date: initial?.date ? initial.date.slice(0, 10) : '',
    type: initial?.type || 'Theory',
    title: initial?.title || '',
    description: initial?.description || '',
    status: initial?.status || 'Upcoming',
  });
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md glass rounded-2xl border border-border p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-zinc-100">{initial?.id ? 'Edit Day' : 'New Day Session'}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Day # (1–7)"><input type="number" min={1} max={7} className={inputCls} value={form.dayNumber} onChange={e => setForm({ ...form, dayNumber: e.target.value })} /></Field>
          <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Type"><select className={selectCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{DAY_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Status"><select className={selectCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{DAY_STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
        </div>
        <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Time Complexity & Big-O" /></Field>
        <Field label="Description"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What students will learn..." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => onSave({ ...form, weekId })} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {initial?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Resource Form Modal ──────────────────────────────────────────────────────
function ResourceFormModal({ dayId, onSave, onClose, isLoading }: {
  dayId: string; onSave: (d: any) => void; onClose: () => void; isLoading: boolean;
}) {
  const [form, setForm] = useState({ title: '', resourceType: 'Slide', url: '', description: '' });
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md glass rounded-2xl border border-border p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-zinc-100">Add Resource</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>
        <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Big-O Lecture Slides" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type"><select className={selectCls} value={form.resourceType} onChange={e => setForm({ ...form, resourceType: e.target.value })}>{RESOURCE_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="URL"><input className={inputCls} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
        </div>
        <Field label="Description"><input className={inputCls} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional notes..." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={() => onSave({ ...form, dayId })} disabled={isLoading} className="flex-1 py-2 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Add Resource
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InstructorSchedulePage() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });
  const closeModal = () => setModal(null);

  const { data: phasesData, isLoading } = useQuery({
    queryKey: ['instructor-phases'],
    queryFn: () => api.get('/schedule/phases').then(r => r.data),
  });

  const phases: Phase[] = phasesData?.phases || [];

  const toggleExpand = (id: string) => setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));

  // ─── Mutations ───────────────────────────────────────────────────────────
  const createPhase = useMutation({ mutationFn: (d: any) => api.post('/schedule/phases', d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Phase created!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to create phase', 'error') });
  const updatePhase = useMutation({ mutationFn: ({ id, ...d }: any) => api.put(`/schedule/phases/${id}`, d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Phase updated!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to update phase', 'error') });
  const deletePhase = useMutation({ mutationFn: (id: string) => api.delete(`/schedule/phases/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Phase deleted'); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to delete phase', 'error') });

  const createWeek = useMutation({ mutationFn: (d: any) => api.post('/schedule/weeks', d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Week created!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to create week', 'error') });
  const deleteWeek = useMutation({ mutationFn: (id: string) => api.delete(`/schedule/weeks/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Week deleted'); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to delete week', 'error') });

  const createDay = useMutation({ mutationFn: (d: any) => api.post('/schedule/days', d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Day session created!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to create day', 'error') });
  const updateDay = useMutation({ mutationFn: ({ id, ...d }: any) => api.put(`/schedule/days/${id}`, d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Day updated!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to update day', 'error') });
  const deleteDay = useMutation({ mutationFn: (id: string) => api.delete(`/schedule/days/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Day deleted'); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to delete day', 'error') });

  const createResource = useMutation({ mutationFn: (d: any) => api.post('/schedule/resources', d), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Resource added!'); closeModal(); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to add resource', 'error') });
  const deleteResource = useMutation({ mutationFn: (id: string) => api.delete(`/schedule/resources/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['instructor-phases'] }); showToast('Resource removed'); }, onError: (e: any) => showToast(e?.response?.data?.error || 'Failed to delete resource', 'error') });

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal?.type === 'phase-create' && <PhaseFormModal onSave={d => createPhase.mutate(d)} onClose={closeModal} isLoading={createPhase.isPending} />}
        {modal?.type === 'phase-edit' && <PhaseFormModal initial={modal.data} onSave={d => updatePhase.mutate({ id: modal.data.id, ...d })} onClose={closeModal} isLoading={updatePhase.isPending} />}
        {modal?.type === 'week-create' && <WeekFormModal phaseId={modal.data.phaseId} onSave={d => createWeek.mutate(d)} onClose={closeModal} isLoading={createWeek.isPending} />}
        {modal?.type === 'day-create' && <DayFormModal weekId={modal.data.weekId} onSave={d => createDay.mutate(d)} onClose={closeModal} isLoading={createDay.isPending} />}
        {modal?.type === 'day-edit' && <DayFormModal weekId={modal.data.weekId} initial={modal.data} onSave={d => updateDay.mutate({ id: modal.data.id, ...d })} onClose={closeModal} isLoading={updateDay.isPending} />}
        {modal?.type === 'resource-create' && <ResourceFormModal dayId={modal.data.dayId} onSave={d => createResource.mutate(d)} onClose={closeModal} isLoading={createResource.isPending} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
            <CalendarDays size={22} className="text-[#A41034]" /> Manage Schedule
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Create and organize CP training roadmap phases, weeks, and sessions</p>
        </div>
        <button
          onClick={() => setModal({ type: 'phase-create' })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A41034] to-[#C4122F] text-white text-xs font-bold shadow-lg shadow-[rgba(164,16,52,0.20)] hover:from-rose-600 hover:to-rose-400 transition-all"
        >
          <Plus size={14} /> New Phase
        </button>
      </div>

      {/* Phases */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#A41034]" /></div>
      ) : phases.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <Map size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No phases yet. Click "New Phase" to start building the roadmap.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {phases.map(phase => (
            <motion.div key={phase.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border overflow-hidden">
              {/* Phase Row */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600/5 to-cyan-600/5 border-b border-border">
                <button onClick={() => toggleExpand(`phase-${phase.id}`)} className="text-zinc-500">
                  <motion.div animate={{ rotate: expandedItems[`phase-${phase.id}`] ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={16} />
                  </motion.div>
                </button>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A41034] to-[#C4122F] flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {phase.phaseOrder}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-100 truncate">{phase.title}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {new Date(phase.startDate).toLocaleDateString()} → {new Date(phase.endDate).toLocaleDateString()} · {phase.weeks.length} weeks
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal({ type: 'week-create', data: { phaseId: phase.id } })} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold border border-zinc-700 transition-colors">
                    <Plus size={10} /> Week
                  </button>
                  <button onClick={() => setModal({ type: 'phase-edit', data: phase })} className="p-1.5 rounded-lg text-zinc-500 hover:text-[#A41034] hover:bg-[#C4122F]/10 transition-colors"><Edit3 size={13} /></button>
                  <button onClick={() => { if (window.confirm('Delete this phase and all its data?')) deletePhase.mutate(phase.id); }} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>

              {/* Weeks */}
              <AnimatePresence>
                {expandedItems[`phase-${phase.id}`] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 space-y-3">
                      {phase.weeks.map(week => (
                        <div key={week.id} className="rounded-xl border border-border overflow-hidden">
                          {/* Week Row */}
                          <div className="flex items-center gap-3 px-4 py-3 bg-[#26292D]/50">
                            <button onClick={() => toggleExpand(`week-${week.id}`)} className="text-zinc-600">
                              <motion.div animate={{ rotate: expandedItems[`week-${week.id}`] ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRight size={13} />
                              </motion.div>
                            </button>
                            <span className="text-xs font-bold text-zinc-300">Week {week.weekNumber}</span>
                            <span className="text-[10px] font-mono text-zinc-600">{new Date(week.startDate).toLocaleDateString()} → {new Date(week.endDate).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1 ml-auto">
                              <button onClick={() => setModal({ type: 'day-create', data: { weekId: week.id } })} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold border border-zinc-700 transition-colors">
                                <Plus size={9} /> Day
                              </button>
                              <button onClick={() => { if (window.confirm('Delete this week?')) deleteWeek.mutate(week.id); }} className="p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={12} /></button>
                            </div>
                          </div>

                          {/* Days */}
                          <AnimatePresence>
                            {expandedItems[`week-${week.id}`] && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="p-3 space-y-2">
                                  {week.days.map(day => (
                                    <div key={day.id} className="rounded-lg border border-border/60 overflow-hidden">
                                      {/* Day Row */}
                                      <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-950/30">
                                        <button onClick={() => toggleExpand(`day-${day.id}`)} className="text-zinc-700">
                                          <motion.div animate={{ rotate: expandedItems[`day-${day.id}`] ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronRight size={11} />
                                          </motion.div>
                                        </button>
                                        {TYPE_ICONS[day.type]}
                                        <span className="text-[11px] font-bold text-zinc-400">Day {day.dayNumber}</span>
                                        <span className="text-[11px] text-zinc-200 flex-1 truncate">{day.title}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${day.status === 'Published' ? 'bg-green-500/10 text-green-400' : day.status === 'Locked' ? 'bg-zinc-800 text-zinc-600' : 'bg-[rgba(164,16,52,0.10)] text-[#C4122F]'}`}>{day.status}</span>
                                        <button onClick={() => setModal({ type: 'resource-create', data: { dayId: day.id } })} className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-500 text-[9px] font-bold border border-zinc-700 transition-colors"><Plus size={8} /> Res</button>
                                        <button onClick={() => setModal({ type: 'day-edit', data: day })} className="p-1 text-zinc-600 hover:text-[#A41034] transition-colors"><Edit3 size={11} /></button>
                                        <button onClick={() => { if (window.confirm('Delete this day?')) deleteDay.mutate(day.id); }} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
                                      </div>

                                      {/* Resources */}
                                      <AnimatePresence>
                                        {expandedItems[`day-${day.id}`] && day.resources.length > 0 && (
                                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="px-3 pb-2 space-y-1.5">
                                              {day.resources.map(res => (
                                                <div key={res.id} className="flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-lg bg-[#26292D]/60 border border-border/40">
                                                  <LinkIcon size={9} className="text-zinc-500 shrink-0" />
                                                  <span className="font-bold text-zinc-500 uppercase">{res.resourceType}</span>
                                                  <a href={res.url} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-[#A41034] flex-1 truncate">{res.title}</a>
                                                  <button onClick={() => deleteResource.mutate(res.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={10} /></button>
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ))}
                                  {week.days.length === 0 && (
                                    <p className="text-center text-[10px] text-zinc-600 py-3">No days yet. Click "+ Day" to add sessions.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                      {phase.weeks.length === 0 && (
                        <p className="text-center text-xs text-zinc-600 py-4">No weeks. Click "+ Week" to add one.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
