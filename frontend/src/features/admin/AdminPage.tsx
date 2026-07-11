import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, FileCode2, CalendarRange, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ROLES = ['ADMIN', 'TRAINER', 'STUDENT', 'ALUMNI'];
const CATEGORIES = [
  'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ICPC_TEAM',
  'TRAINER', 'ALUMNI', 'EXECUTIVE_MEMBER', 'CLUB_MEMBER',
  'TOP_PERFORMER', 'PROBLEM_SETTER', 'VOLUNTEER'
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'problems' | 'contests'>('users');
  const queryClient = useQueryClient();

  // State for problem creation
  const [problemForm, setProblemForm] = useState({
    title: '', statement: '', constraints: '',
    timeLimitMs: 1000, memoryLimitMb: 256,
    difficulty: '800', tags: '', testCaseInput: '', testCaseOutput: ''
  });

  // State for contest scheduling
  const [contestForm, setContestForm] = useState({
    title: '', description: '', startTime: '', endTime: '', durationSeconds: 18000
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
    enabled: activeTab === 'users',
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role, category }: { userId: string; role: string; category: string }) =>
      api.put(`/admin/users/${userId}/role`, { role, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('User updated successfully!');
    },
  });

  const createProblemMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/problems', data),
    onSuccess: () => {
      alert('Problem challenge created successfully!');
      setProblemForm({
        title: '', statement: '', constraints: '',
        timeLimitMs: 1000, memoryLimitMb: 256,
        difficulty: '800', tags: '', testCaseInput: '', testCaseOutput: ''
      });
    },
  });

  const createContestMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/contests', data),
    onSuccess: () => {
      alert('Contest scheduled successfully!');
      setContestForm({ title: '', description: '', startTime: '', endTime: '', durationSeconds: 18000 });
    },
  });

  const handleUpdateUser = (userId: string, role: string, category: string) => {
    updateRoleMutation.mutate({ userId, role, category });
  };

  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = problemForm.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const testCases = [{ input: problemForm.testCaseInput, output: problemForm.testCaseOutput }];

    createProblemMutation.mutate({
      ...problemForm,
      tags: tagsArr,
      testCases
    });
  };

  const handleContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContestMutation.mutate(contestForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100">Club Administration</h1>
        <p className="text-sm text-zinc-500 mt-1">Configure role permissions, compose coding challenges, and schedule upcoming contests</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1 bg-zinc-900/20 rounded-xl p-1 max-w-md">
        {[
          { id: 'users', label: 'User Manager', icon: Users },
          { id: 'problems', label: 'Create Problem', icon: FileCode2 },
          { id: 'contests', label: 'Schedule Contest', icon: CalendarRange }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#7A0C24] text-white shadow-lg shadow-indigo-600/10'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* User Manager Tab */}
      {activeTab === 'users' && (
        <div className="glass rounded-xl border border-border overflow-hidden">
          {usersLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-zinc-900/40 text-zinc-500 uppercase font-bold">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Current Role</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(usersData?.users || []).map((u: any) => (
                  <tr key={u.id} className="border-b border-border/40 hover:bg-zinc-900/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-zinc-200">{u.name}</div>
                      <div className="text-[10px] text-zinc-500">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUser(u.id, e.target.value, u.category)}
                        className="bg-zinc-800 border border-border text-zinc-300 rounded px-2 py-1 focus:outline-none"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={u.category}
                        onChange={(e) => handleUpdateUser(u.id, u.role, e.target.value)}
                        className="bg-zinc-800 border border-border text-zinc-300 rounded px-2 py-1 focus:outline-none"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-[10px] text-zinc-500 font-mono">Rating: {u.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Challenge Creator Tab */}
      {activeTab === 'problems' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl border border-border p-6 max-w-2xl">
          <form onSubmit={handleProblemSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Problem Title</label>
                <input
                  id="admin-prob-title"
                  type="text"
                  required
                  value={problemForm.title}
                  onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                  placeholder="e.g. Sum of Two Digits"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Problem Statement (supports LaTeX)</label>
                <textarea
                  id="admin-prob-statement"
                  rows={4}
                  required
                  value={problemForm.statement}
                  onChange={(e) => setProblemForm({ ...problemForm, statement: e.target.value })}
                  placeholder="Write statement here. Use $A+B$ for math expressions."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Constraints</label>
                <input
                  id="admin-prob-constraints"
                  type="text"
                  value={problemForm.constraints}
                  onChange={(e) => setProblemForm({ ...problemForm, constraints: e.target.value })}
                  placeholder="e.g. -100 <= N <= 100"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Time Limit (ms)</label>
                <input
                  id="admin-prob-timelimit"
                  type="number"
                  value={problemForm.timeLimitMs}
                  onChange={(e) => setProblemForm({ ...problemForm, timeLimitMs: parseInt(e.target.value) || 1000 })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Memory Limit (MB)</label>
                <input
                  id="admin-prob-memlimit"
                  type="number"
                  value={problemForm.memoryLimitMb}
                  onChange={(e) => setProblemForm({ ...problemForm, memoryLimitMb: parseInt(e.target.value) || 256 })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Difficulty (e.g. 800 - 3500)</label>
                <input
                  id="admin-prob-difficulty"
                  type="text"
                  value={problemForm.difficulty}
                  onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Tags (comma separated)</label>
                <input
                  id="admin-prob-tags"
                  type="text"
                  value={problemForm.tags}
                  onChange={(e) => setProblemForm({ ...problemForm, tags: e.target.value })}
                  placeholder="e.g. math, implementation, dp"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Sample Input</label>
                <textarea
                  id="admin-prob-sampleinput"
                  rows={2}
                  required
                  value={problemForm.testCaseInput}
                  onChange={(e) => setProblemForm({ ...problemForm, testCaseInput: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs font-mono focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Sample Output</label>
                <textarea
                  id="admin-prob-sampleoutput"
                  rows={2}
                  required
                  value={problemForm.testCaseOutput}
                  onChange={(e) => setProblemForm({ ...problemForm, testCaseOutput: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs font-mono focus:ring-1 focus:ring-[#A41034]"
                />
              </div>
            </div>

            <button
              id="admin-prob-submit"
              type="submit"
              disabled={createProblemMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {createProblemMutation.isPending && <Loader2 size={12} className="animate-spin" />}
              Publish Challenge
            </button>
          </form>
        </motion.div>
      )}

      {/* Contest Scheduler Tab */}
      {activeTab === 'contests' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl border border-border p-6 max-w-xl">
          <form onSubmit={handleContestSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Contest Title</label>
              <input
                id="admin-contest-title"
                type="text"
                required
                value={contestForm.title}
                onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                placeholder="e.g. NWU Weekly Round #4"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Description</label>
              <textarea
                id="admin-contest-desc"
                rows={2}
                value={contestForm.description}
                onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                placeholder="Brief guidelines..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Start Time</label>
                <input
                  id="admin-contest-start"
                  type="datetime-local"
                  required
                  value={contestForm.startTime}
                  onChange={(e) => setContestForm({ ...contestForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">End Time</label>
                <input
                  id="admin-contest-end"
                  type="datetime-local"
                  required
                  value={contestForm.endTime}
                  onChange={(e) => setContestForm({ ...contestForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Duration (Seconds)</label>
                <input
                  id="admin-contest-duration"
                  type="number"
                  value={contestForm.durationSeconds}
                  onChange={(e) => setContestForm({ ...contestForm, durationSeconds: parseInt(e.target.value) || 18000 })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-border text-zinc-200 text-xs focus:ring-1 focus:ring-[#A41034]"
                />
              </div>
            </div>

            <button
              id="admin-contest-submit"
              type="submit"
              disabled={createContestMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-[#7A0C24] hover:bg-[#C4122F] text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {createContestMutation.isPending && <Loader2 size={12} className="animate-spin" />}
              Schedule Round
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
