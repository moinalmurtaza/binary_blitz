import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Book, FileText, Film, Download, ExternalLink, Loader2, BookOpen } from 'lucide-react';
import api from '../../services/api';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  BOOK:         <Book size={18} className="text-yellow-400" />,
  SLIDES:       <FileText size={18} className="text-[#C4122F]" />,
  LECTURE_NOTE: <FileText size={18} className="text-[#C4122F]" />,
  VIDEO:        <Film size={18} className="text-pink-400" />,
  TEMPLATE:     <FileText size={18} className="text-green-400" />,
  ALGORITHM:    <FileText size={18} className="text-[#A41034]" />,
};

const TYPE_LABELS: Record<string, string> = {
  BOOK: 'Book', SLIDES: 'Slides', LECTURE_NOTE: 'Lecture Note',
  VIDEO: 'Video', TEMPLATE: 'Template', ALGORITHM: 'Algorithm',
};

const TYPE_COLORS: Record<string, string> = {
  BOOK:         'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  SLIDES:       'bg-[rgba(164,16,52,0.10)] text-[#C4122F] border-[#A41034]/25',
  LECTURE_NOTE: 'bg-[rgba(164,16,52,0.10)] text-[#C4122F] border-[#A41034]/25',
  VIDEO:        'bg-pink-500/10 text-pink-400 border-pink-500/20',
  TEMPLATE:     'bg-green-500/10 text-green-400 border-green-500/20',
  ALGORITHM:    'bg-[rgba(164,16,52,0.10)] text-[#A41034] border-[#A41034]/20',
};

export default function LearningPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['resources', search, filterType],
    queryFn: () => api.get('/resources', { params: { search: search || undefined, type: filterType || undefined } }).then(r => r.data),
  });

  const resources = data?.resources || [];

  const handleDownload = async (id: string, fileUrl: string | null, _title: string) => {
    await api.post(`/resources/${id}/download`).catch(() => {});
    if (fileUrl) window.open(fileUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100">Learning Hub</h1>
        <p className="text-sm text-zinc-500 mt-1">Books, lecture notes, slides, templates, and more</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl border border-border p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="resource-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#33363B]/60 border border-border text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#A41034]/30 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterType === '' ? 'bg-[rgba(164,16,52,0.12)] text-[#A41034] border-[#A41034]/40' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-400'}`}
          >
            All
          </button>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setFilterType(type === filterType ? '' : type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterType === type ? TYPE_COLORS[type] : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-400'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#A41034]" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No resources match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resources.map((res: any, i: number) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-xl border border-border p-5 glow-hover hover:border-[#A41034]/30 transition-all flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-[#33363B]/60 border border-border shrink-0">
                  {TYPE_ICONS[res.type] || <FileText size={18} className="text-zinc-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${TYPE_COLORS[res.type] || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                    {TYPE_LABELS[res.type] || res.type}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-snug">{res.title}</h3>
                </div>
              </div>

              {res.markdownContent && (
                <p className="text-xs text-zinc-500 line-clamp-3 flex-1 leading-relaxed mb-3">
                  {/* eslint-disable-next-line no-useless-escape */}
                  {res.markdownContent.replace(/[#*`\[\]]/g, '').slice(0, 140)}...
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {res.tags.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-500 border border-zinc-700">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                <div className="text-[10px] text-zinc-600">
                  By <span className="text-zinc-400 font-semibold">{res.author?.name}</span>
                  <span className="mx-1.5">·</span>
                  <Download size={9} className="inline" /> {res.downloads}
                </div>
                <button
                  onClick={() => handleDownload(res.id, res.fileUrl, res.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(164,16,52,0.12)] text-[#A41034] text-xs font-bold border border-[#A41034]/30 hover:bg-[#7A0C24]/30 transition-colors"
                >
                  {res.fileUrl ? <><Download size={12} /> Download</> : <><ExternalLink size={12} /> View</>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
