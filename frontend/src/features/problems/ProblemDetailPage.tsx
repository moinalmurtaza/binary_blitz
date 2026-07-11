import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { Send, Clock, Cpu, Tag, CheckCircle2, XCircle, Loader2, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const LANGUAGES = [
  { value: 'cpp', label: 'C++ 17' },
  { value: 'java', label: 'Java 21' },
  { value: 'python', label: 'Python 3' },
];

const STARTER_CODE: Record<string, string> = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
  python: `import sys
input = sys.stdin.readline

def main():
    # Your code here
    pass

main()`,
};

const STATUS_STYLES: Record<string, { text: string; icon: React.ReactNode; color: string }> = {
  ACCEPTED:            { text: 'Accepted',             icon: <CheckCircle2 size={14} />, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  WRONG_ANSWER:        { text: 'Wrong Answer',         icon: <XCircle size={14} />,     color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  TIME_LIMIT_EXCEEDED: { text: 'Time Limit Exceeded',  icon: <Clock size={14} />,       color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  MEMORY_LIMIT_EXCEEDED:{ text:'Memory Limit Exceeded',icon: <Cpu size={14} />,         color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  RUNTIME_ERROR:       { text: 'Runtime Error',        icon: <XCircle size={14} />,     color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  COMPILATION_ERROR:   { text: 'Compilation Error',    icon: <XCircle size={14} />,     color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  PENDING:             { text: 'Pending',              icon: <Loader2 size={14} className="animate-spin" />, color: 'text-zinc-400 bg-zinc-800 border-zinc-700' },
  RUNNING:             { text: 'Running',              icon: <Loader2 size={14} className="animate-spin" />, color: 'text-[#C4122F] bg-[rgba(164,16,52,0.10)] border-[#A41034]/30' },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || { text: status, icon: null, color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style.color}`}>
      {style.icon} {style.text}
    </span>
  );
}

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(STARTER_CODE['cpp']);
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'editorial'>('problem');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const { data: problemData, isLoading } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => api.get(`/problems/${id}`).then(r => r.data),
  });

  const { data: submissionsData, refetch: refetchSubmissions } = useQuery({
    queryKey: ['problem-submissions', id],
    queryFn: () => api.get(`/problems/${id}/submissions`).then(r => r.data),
    enabled: activeTab === 'submissions',
  });

  const submitMutation = useMutation({
    mutationFn: () => api.post(`/problems/${id}/submit`, { language, code }),
    onSuccess: (res) => {
      setSubmittedId(res.data.submissionId);
      setActiveTab('submissions');
      // Poll for result
      const interval = setInterval(async () => {
        await refetchSubmissions();
        const latest = submissionsData?.submissions?.[0];
        if (latest && latest.status !== 'PENDING' && latest.status !== 'RUNNING') {
          clearInterval(interval);
        }
      }, 2000);
      setTimeout(() => clearInterval(interval), 30000);
    },
  });

  const problem = problemData?.problem;
  const submissions = submissionsData?.submissions || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#A41034]" />
      </div>
    );
  }

  if (!problem) {
    return <div className="text-center py-20 text-zinc-500">Problem not found.</div>;
  }

  const testCases: any[] = Array.isArray(problem.testCases) ? problem.testCases : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* LEFT: Problem Panel */}
      <div className="lg:w-[48%] flex flex-col gap-0">
        {/* Problem Header */}
        <div className="glass rounded-t-xl border border-border px-6 py-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${problem.difficulty >= '1600' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : problem.difficulty >= '1200' ? 'text-[#C4122F] bg-[rgba(164,16,52,0.10)] border-[#A41034]/25' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>
              {problem.difficulty}
            </span>
            {problem.tags.map((t: string) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-500 border border-zinc-700 flex items-center gap-1">
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
          <h1 className="text-xl font-extrabold text-zinc-100 leading-snug">{problem.title}</h1>
          <div className="flex gap-4 mt-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Clock size={11} /> Time: {problem.timeLimitMs}ms</span>
            <span className="flex items-center gap-1"><Cpu size={11} /> Memory: {problem.memoryLimitMb}MB</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={11} /> Solved: {problem.solvedCount}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-x border-border bg-[#26292D]/60">
          {(['problem', 'submissions', 'editorial'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'text-[#A41034] border-[#A41034]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-b-xl border border-t-0 border-border flex-1 p-6 overflow-y-auto max-h-[600px]">
          {activeTab === 'problem' && (
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="mb-5">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Problem Statement</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.statement}</ReactMarkdown>
              </div>
              <div className="mb-5 p-4 rounded-xl bg-[#33363B]/60 border border-border">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Constraints</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.constraints}</ReactMarkdown>
              </div>

              {testCases.map((tc, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Example {i + 1}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1 font-semibold uppercase">Input</p>
                      <pre className="p-3 rounded-lg bg-zinc-950 border border-border text-xs font-mono text-zinc-300 overflow-auto">{tc.input}</pre>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1 font-semibold uppercase">Output</p>
                      <pre className="p-3 rounded-lg bg-zinc-950 border border-border text-xs font-mono text-zinc-300 overflow-auto">{tc.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-zinc-600 text-sm">No submissions yet. Write your solution and submit!</div>
              ) : (
                submissions.map((sub: any) => (
                  <div key={sub.id} className={`p-4 rounded-xl border ${submittedId === sub.id ? 'border-[#A41034]/40 bg-[rgba(164,16,52,0.06)]' : 'border-border bg-[#26292D]/50'}`}>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={sub.status} />
                      <span className="text-xs text-zinc-600 font-mono">{sub.language.toUpperCase()}</span>
                    </div>
                    {sub.runTimeMs && (
                      <p className="text-xs text-zinc-600 mt-2 flex gap-3">
                        <span><Clock size={10} className="inline" /> {sub.runTimeMs}ms</span>
                        <span><Cpu size={10} className="inline" /> {(sub.memoryUsedKb / 1024).toFixed(1)}MB</span>
                      </p>
                    )}
                    {sub.errorFeedback && (
                      <pre className="mt-2 p-2 rounded bg-red-500/5 border border-red-500/20 text-[10px] text-red-400 font-mono overflow-auto">{sub.errorFeedback}</pre>
                    )}
                    <p className="text-[10px] text-zinc-700 mt-2">{new Date(sub.submittedAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'editorial' && (
            <div className="prose prose-invert prose-sm max-w-none">
              {problem.editorial ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.editorial}</ReactMarkdown>
              ) : (
                <div className="text-center py-12 text-zinc-600 text-sm">Editorial not available yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Editor Panel */}
      <div className="lg:w-[52%] flex flex-col gap-0">
        {/* Editor Toolbar */}
        <div className="glass rounded-t-xl border border-border px-4 py-3 flex items-center justify-between gap-4">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(STARTER_CODE[e.target.value]);
              }}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-zinc-800 border border-border text-zinc-300 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          <button
            id="submit-code"
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#A41034] to-[#C4122F] text-white text-xs font-bold hover:from-rose-600 hover:to-rose-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-[rgba(164,16,52,0.20)] active:scale-95"
          >
            {submitMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {submitMutation.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="border-x border-border flex-1">
          <Editor
            height="520px"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'gutter',
              padding: { top: 16, bottom: 16 },
              tabSize: 4,
            }}
          />
        </div>

        {/* Submit feedback */}
        {submitMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-b-xl border border-t-0 border-green-500/30 bg-green-500/5 px-5 py-3 text-xs text-green-400 font-semibold flex items-center gap-2"
          >
            <CheckCircle2 size={14} /> Submitted! Check the Submissions tab for your verdict.
          </motion.div>
        )}
        {submitMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-b-xl border border-t-0 border-red-500/30 bg-red-500/5 px-5 py-3 text-xs text-red-400 font-semibold flex items-center gap-2"
          >
            <XCircle size={14} /> Submission failed. Please try again.
          </motion.div>
        )}
        {!submitMutation.isSuccess && !submitMutation.isError && (
          <div className="rounded-b-xl border border-t-0 border-border bg-zinc-950/40 px-5 py-3 text-[11px] text-zinc-700">
            Code is auto-saved locally. Press Submit when ready.
          </div>
        )}
      </div>
    </div>
  );
}
