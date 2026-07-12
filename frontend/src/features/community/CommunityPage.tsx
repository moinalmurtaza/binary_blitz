import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageSquare, Award, BookOpen, Clock, Briefcase } from 'lucide-react';
import api from '../../services/api';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'trainers' | 'alumni'>('trainers');

  const { data: trainersData } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => api.get('/leaderboard?category=TRAINER').then(r => r.data),
  });

  const { data: alumniData } = useQuery({
    queryKey: ['alumni'],
    queryFn: () => api.get('/leaderboard?category=ALUMNI').then(r => r.data),
  });

  // Since we also want detailed profile attributes, we can mock/map them based on the category or seed records
  const trainers = trainersData?.leaderboard || [
    {
      id: 'trainer-1',
      name: 'Dr. John Doe',
      role: 'TRAINER',
      category: 'TRAINER',
      rating: 2150,
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Assistant Professor, CSE Dept. Passionate about graph algorithms and combinatorics. Club Trainer for Binary Blitz.',
      handleCodeforces: 'tourist',
      handleGithub: 'johndoe',
      officeHours: 'Mon/Wed 10:00 AM - 12:00 PM',
      publications: ['Efficient Shortest Path Computation, Journal of CP 2024', 'Advanced Data Structures, ICCS 2025'],
      subjects: ['Data Structures', 'Design & Analysis of Algorithms'],
    }
  ];

  const alumni = alumniData?.leaderboard || [
    {
      id: 'alumni-1',
      name: 'Jane Smith',
      role: 'ALUMNI',
      category: 'ALUMNI',
      rating: 2380,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Software Engineer at Google Munich. ICPC Dhaka Regional 2022 participant. Binary Blitz Alumni.',
      handleCodeforces: 'ecnerwala',
      handleGithub: 'janesmith',
      handleLinkedin: 'janesmith-swe',
      currentCompany: 'Google (Munich, Germany)',
      mentorshipOpen: true,
      timeline: [
        { role: 'Software Engineer', company: 'Google', start: '2023', end: 'Present' },
        { role: 'Research Assistant', company: 'Binary Blitz HQ', start: '2022', end: '2023' }
      ]
    }
  ];



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100">Club Directory</h1>
        <p className="text-sm text-zinc-500 mt-1">Connect with our dedicated trainers and alumni network</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === 'trainers' ? 'text-[#A41034] border-[#A41034]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          Trainers & Faculty
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === 'alumni' ? 'text-[#A41034] border-[#A41034]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
        >
          Alumni Network
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'trainers' && (
          trainers.map((t: any, idx: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-[#A41034]/20 transition-all glow-hover"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={t.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-border shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">{t.name}</h3>
                    <p className="text-xs text-[#A41034] font-semibold mt-0.5">Binary Blitz Faculty / Trainer</p>
                    <div className="flex gap-2 mt-2">
                      {t.handleCodeforces && (
                        <a href={`https://codeforces.com/profile/${t.handleCodeforces}`} target="_blank" rel="noreferrer" className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200">
                          CF: {t.handleCodeforces}
                        </a>
                      )}
                      {t.handleGithub && (
                        <a href={`https://github.com/${t.handleGithub}`} target="_blank" rel="noreferrer" className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                          <Github size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-4 leading-relaxed">{t.bio || 'Club Trainer specializing in competitive programming strategy, algorithms and contest preparation.'}</p>

                {/* Trainer Details */}
                <div className="mt-5 space-y-3 pt-4 border-t border-border/50">
                  {t.subjects && (
                    <div className="flex items-start gap-2 text-xs">
                      <BookOpen size={13} className="text-zinc-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">Teaching: </span>
                        <span className="text-zinc-300">{(t.subjects as string[]).join(', ')}</span>
                      </div>
                    </div>
                  )}
                  {t.officeHours && (
                    <div className="flex items-start gap-2 text-xs">
                      <Clock size={13} className="text-zinc-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">Office Hours: </span>
                        <span className="text-zinc-300">{t.officeHours}</span>
                      </div>
                    </div>
                  )}
                  {t.publications && t.publications.length > 0 && (
                    <div className="flex items-start gap-2 text-xs">
                      <Award size={13} className="text-zinc-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">Research Highlights: </span>
                        <ul className="list-disc pl-4 space-y-1 text-zinc-300 mt-1">
                          {t.publications.map((pub: string, pIdx: number) => (
                            <li key={pIdx}>{pub}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 flex justify-end">
                <a href={`mailto:${t.email || 'trainer@binaryblitz.dev'}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs font-bold transition-all">
                  <Mail size={12} /> Contact Email
                </a>
              </div>
            </motion.div>
          ))
        )}

        {activeTab === 'alumni' && (
          alumni.map((a: any, idx: number) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-[#A41034]/20 transition-all glow-hover"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={a.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                    alt={a.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-zinc-100 truncate">{a.name}</h3>
                      {a.mentorshipOpen && (
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold shrink-0 uppercase tracking-wider">
                          Mentoring
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A41034] font-semibold mt-0.5">{a.currentCompany || 'Software Engineer'}</p>
                    <div className="flex gap-2 mt-2">
                      {a.handleCodeforces && (
                        <a href={`https://codeforces.com/profile/${a.handleCodeforces}`} target="_blank" rel="noreferrer" className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200">
                          CF: {a.handleCodeforces}
                        </a>
                      )}
                      {a.handleGithub && (
                        <a href={`https://github.com/${a.handleGithub}`} target="_blank" rel="noreferrer" className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                          <Github size={12} />
                        </a>
                      )}
                      {a.handleLinkedin && (
                        <a href={`https://linkedin.com/in/${a.handleLinkedin}`} target="_blank" rel="noreferrer" className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                          <Linkedin size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-4 leading-relaxed">{a.bio || 'Binary Blitz Alumni. Specializes in Algorithms and career guidance.'}</p>

                {/* Timeline */}
                {a.timeline && (
                  <div className="mt-5 pt-4 border-t border-border/50">
                    <span className="text-zinc-600 font-semibold uppercase tracking-wider text-[10px] block mb-2">Timeline</span>
                    <div className="space-y-3 relative pl-3 border-l border-zinc-800">
                      {(a.timeline as any[]).map((job: any, jIdx: number) => (
                        <div key={jIdx} className="text-xs relative">
                          <div className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-zinc-950" />
                          <p className="font-semibold text-zinc-300">{job.role}</p>
                          <p className="text-[10px] text-zinc-500">{job.company} · {job.start} – {job.end}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  <Briefcase size={11} /> Ready to Mentor
                </span>
                <a href={a.handleLinkedin ? `https://linkedin.com/in/${a.handleLinkedin}` : '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(164,16,52,0.10)] hover:bg-[rgba(164,16,52,0.12)] text-[#A41034] text-xs font-bold transition-all border border-[#A41034]/20">
                  <MessageSquare size={12} /> Ask for Mentorship
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
