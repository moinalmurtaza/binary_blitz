import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Trophy,
  BookOpen,
  Folder,
  FileText,
  Flag,
  Clock,
  Code2,
  Layers,
  Zap,
} from 'lucide-react';

interface Lecture {
  id: string;
  number: number;
  title: string;
  topics: string[];
}

interface WeeklyContest {
  id: string;
  number: number;
  title: string;
}

interface Week {
  number: number;
  lectures: Lecture[];
  contest: WeeklyContest;
}

interface Phase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  lecturesCount: number;
  weeksCount: number;
  weeks: Week[];
  phaseContest: { id: string; title: string };
}

const CURRICULUM_DATA: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Introduction to C Programming',
    subtitle: 'Foundations of programming, syntax, logic, and problem-solving in C.',
    icon: Code2,
    lecturesCount: 12,
    weeksCount: 6,
    phaseContest: { id: 'pc-1', title: 'Introduction to C Programming Contest' },
    weeks: [
      {
        number: 1,
        contest: { id: 'wc-1', number: 1, title: 'Weekly Contest 1' },
        lectures: [
          { id: 'lec-1', number: 1, title: 'Introduction & Setup', topics: ['What is Programming?', 'Why C?', 'Installing VS Code', 'Installing GCC', 'Compilation Process', 'First C Program'] },
          { id: 'lec-2', number: 2, title: 'Basic Syntax & Variables', topics: ['Keywords', 'Identifiers', 'Data Types', 'Variables', 'printf()', 'scanf()'] }
        ]
      },
      {
        number: 2,
        contest: { id: 'wc-2', number: 2, title: 'Weekly Contest 2' },
        lectures: [
          { id: 'lec-3', number: 3, title: 'Operators & Expressions', topics: ['Arithmetic', 'Relational', 'Logical', 'Bitwise', 'Assignment', 'Ternary'] },
          { id: 'lec-4', number: 4, title: 'Control Flow', topics: ['if / else if / else', 'Nested if', 'switch-case', 'while loop', 'do-while loop', 'for loop'] }
        ]
      },
      {
        number: 3,
        contest: { id: 'wc-3', number: 3, title: 'Weekly Contest 3' },
        lectures: [
          { id: 'lec-5', number: 5, title: 'Functions', topics: ['Declaring Functions', 'Calling Functions', 'Return Types', 'Parameters', 'Scope & Lifetime', 'Recursion Intro'] },
          { id: 'lec-6', number: 6, title: 'Arrays & Strings', topics: ['1D Arrays', '2D Arrays', 'String as Char Array', 'strlen/strcpy/strcmp', 'String Input/Output'] }
        ]
      },
      {
        number: 4,
        contest: { id: 'wc-4', number: 4, title: 'Weekly Contest 4' },
        lectures: [
          { id: 'lec-7', number: 7, title: 'Pointers', topics: ['Memory Address', 'Pointer Variable', 'Dereferencing', 'Pointer Arithmetic', 'Arrays & Pointers'] },
          { id: 'lec-8', number: 8, title: 'Structures & Enums', topics: ['struct Definition', 'Accessing Members', 'Nested Struct', 'enum Basics', 'typedef'] }
        ]
      },
      {
        number: 5,
        contest: { id: 'wc-5', number: 5, title: 'Weekly Contest 5' },
        lectures: [
          { id: 'lec-9', number: 9, title: 'File I/O', topics: ['fopen/fclose', 'fread/fwrite', 'fprintf/fscanf', 'Text vs Binary Mode'] },
          { id: 'lec-10', number: 10, title: 'Dynamic Memory', topics: ['Heap vs Stack', 'malloc/calloc', 'realloc', 'free()', 'Memory Leaks'] }
        ]
      },
      {
        number: 6,
        contest: { id: 'wc-6', number: 6, title: 'Weekly Contest 6' },
        lectures: [
          { id: 'lec-11', number: 11, title: 'Recursion Deep Dive', topics: ['Call Stack', 'Base Case', 'Factorial', 'Fibonacci', 'Tower of Hanoi'] },
          { id: 'lec-12', number: 12, title: 'Practice & Review', topics: ['Problem-solving patterns', 'Debugging in C', 'Common Pitfalls', 'Phase 1 Review'] }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'C++ & STL for Competitive Programming',
    subtitle: 'Modern C++ features, the Standard Template Library, and CP-specific patterns.',
    icon: Zap,
    lecturesCount: 14,
    weeksCount: 7,
    phaseContest: { id: 'pc-2', title: 'C++ & STL Phase Contest' },
    weeks: [
      {
        number: 7,
        contest: { id: 'wc-7', number: 7, title: 'Weekly Contest 7' },
        lectures: [
          { id: 'lec-13', number: 13, title: 'C++ vs C Differences', topics: ['cin/cout', 'References', 'Default Arguments', 'Function Overloading', 'Namespaces'] },
          { id: 'lec-14', number: 14, title: 'OOP in C++', topics: ['Classes & Objects', 'Constructors', 'Destructors', 'Access Specifiers', 'this Pointer'] }
        ]
      },
      {
        number: 8,
        contest: { id: 'wc-8', number: 8, title: 'Weekly Contest 8' },
        lectures: [
          { id: 'lec-15', number: 15, title: 'Templates & Generics', topics: ['Function Templates', 'Class Templates', 'Template Specialization'] },
          { id: 'lec-16', number: 16, title: 'STL Containers I', topics: ['vector', 'list', 'deque', 'stack', 'queue', 'priority_queue'] }
        ]
      },
      {
        number: 9,
        contest: { id: 'wc-9', number: 9, title: 'Weekly Contest 9' },
        lectures: [
          { id: 'lec-17', number: 17, title: 'STL Containers II', topics: ['set', 'multiset', 'map', 'multimap', 'unordered_set', 'unordered_map'] },
          { id: 'lec-18', number: 18, title: 'STL Algorithms I', topics: ['sort()', 'binary_search()', 'lower_bound()', 'upper_bound()', 'reverse()'] }
        ]
      },
      {
        number: 10,
        contest: { id: 'wc-10', number: 10, title: 'Weekly Contest 10' },
        lectures: [
          { id: 'lec-19', number: 19, title: 'STL Algorithms II', topics: ['find()', 'count()', 'max_element()', 'min_element()', 'accumulate()', 'next_permutation()'] },
          { id: 'lec-20', number: 20, title: 'Lambda & Iterators', topics: ['Lambda Expressions', 'Capture Lists', 'Custom Comparators', 'Iterator Types'] }
        ]
      },
      {
        number: 11,
        contest: { id: 'wc-11', number: 11, title: 'Weekly Contest 11' },
        lectures: [
          { id: 'lec-21', number: 21, title: 'Strings in C++', topics: ['std::string', 'substr()', 'find()', 'stoi()/stod()', 'stringstream'] },
          { id: 'lec-22', number: 22, title: 'Bitwise Tricks for CP', topics: ['Bit Masking', 'Set/Clear/Toggle Bit', 'Power of 2', 'Bit Counting', 'XOR Tricks'] }
        ]
      },
      {
        number: 12,
        contest: { id: 'wc-12', number: 12, title: 'Weekly Contest 12' },
        lectures: [
          { id: 'lec-23', number: 23, title: 'Math for CP', topics: ['Modular Arithmetic', 'GCD/LCM', 'Sieve of Eratosthenes', 'Fast Exponentiation', 'Combinatorics Basics'] },
          { id: 'lec-24', number: 24, title: 'Greedy Algorithms Intro', topics: ['Greedy Paradigm', 'Activity Selection', 'Fractional Knapsack', 'Interval Scheduling'] }
        ]
      },
      {
        number: 13,
        contest: { id: 'wc-13', number: 13, title: 'Weekly Contest 13' },
        lectures: [
          { id: 'lec-25', number: 25, title: 'Recursion & Backtracking', topics: ['Backtracking Paradigm', 'N-Queens', 'Subset Generation', 'Permutations', 'Pruning'] },
          { id: 'lec-26', number: 26, title: 'Divide & Conquer', topics: ['Merge Sort', 'Quick Sort', 'Binary Search Problems', 'Matrix Exponentiation Intro'] }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Introduction to Data Structures & Algorithms',
    subtitle: 'Foundational DSA concepts: arrays, linked lists, trees, graphs, and dynamic programming.',
    icon: Layers,
    lecturesCount: 8,
    weeksCount: 4,
    phaseContest: { id: 'pc-3', title: 'DSA Phase Contest' },
    weeks: [
      {
        number: 14,
        contest: { id: 'wc-14', number: 14, title: 'Weekly Contest 14' },
        lectures: [
          { id: 'lec-27', number: 27, title: 'Linked Lists', topics: ['Singly Linked List', 'Doubly Linked List', 'Insertion/Deletion', 'Reverse a List', 'Cycle Detection'] },
          { id: 'lec-28', number: 28, title: 'Stacks & Queues (DSA)', topics: ['Stack using Array/LL', 'Queue using Array/LL', 'Monotonic Stack', 'Deque Applications'] }
        ]
      },
      {
        number: 15,
        contest: { id: 'wc-15', number: 15, title: 'Weekly Contest 15' },
        lectures: [
          { id: 'lec-29', number: 29, title: 'Binary Trees', topics: ['Tree Terminology', 'Traversals (Inorder, Preorder, Postorder)', 'Height/Depth', 'BFS on Trees', 'Binary Search Tree'] },
          { id: 'lec-30', number: 30, title: 'Heaps & Priority Queues', topics: ['Min/Max Heap', 'Heapify', 'Heap Sort', 'K-th Largest', 'Median of Stream'] }
        ]
      },
      {
        number: 16,
        contest: { id: 'wc-16', number: 16, title: 'Weekly Contest 16' },
        lectures: [
          { id: 'lec-31', number: 31, title: 'Graph Basics', topics: ['Graph Representations', 'BFS', 'DFS', 'Connected Components', 'Cycle Detection', 'Bipartite Check'] },
          { id: 'lec-32', number: 32, title: 'Shortest Paths', topics: ['Dijkstra\'s Algorithm', 'Bellman-Ford', 'Floyd-Warshall', 'BFS for Unweighted'] }
        ]
      },
      {
        number: 17,
        contest: { id: 'wc-17', number: 17, title: 'Weekly Contest 17' },
        lectures: [
          { id: 'lec-33', number: 33, title: 'Dynamic Programming Intro', topics: ['Memoization', 'Tabulation', 'Fibonacci DP', '0/1 Knapsack', 'Longest Common Subsequence', 'Coin Change'] },
          { id: 'lec-34', number: 34, title: 'Advanced DP & Review', topics: ['Matrix Chain Multiplication', 'Edit Distance', 'DP on Trees', 'Phase 3 Review & Strategy'] }
        ]
      }
    ]
  }
];

const phaseColors: Record<number, { accent: string; bg: string; border: string; badge: string }> = {
  1: { accent: '#A41034', bg: 'rgba(164,16,52,0.06)', border: 'rgba(164,16,52,0.25)', badge: '#A41034' },
  2: { accent: '#2563EB', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.25)', badge: '#2563EB' },
  3: { accent: '#16A34A', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.25)', badge: '#16A34A' },
};

export default function CourseRoadmapPage() {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ 'phase-1': true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });
  const [expandedLectures, setExpandedLectures] = useState<Record<string, boolean>>({});

  const togglePhase = (id: string) =>
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleWeek = (n: number) =>
    setExpandedWeeks(prev => ({ ...prev, [n]: !prev[n] }));

  const toggleLecture = (id: string) =>
    setExpandedLectures(prev => ({ ...prev, [id]: !prev[id] }));

  const totalLectures = CURRICULUM_DATA.reduce((s, p) => s + p.lecturesCount, 0);
  const totalWeeks = CURRICULUM_DATA.reduce((s, p) => s + p.weeksCount, 0);

  return (
    <div className="min-h-screen bg-[#1a1c1f] text-[#F2F2F2]">
      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden bg-[#0a0a0a] border-b border-zinc-800/60 px-8 py-10">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(164,16,52,0.12) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-[#A41034]" />
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#A41034]">Binary Blitz</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white leading-tight mb-2">
            Course Roadmap
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed mb-6">
            A comprehensive 17-week curriculum taking you from absolute beginner to competitive programmer,
            through structured phases, weekly lectures, and timed contests.
          </p>
          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Phases', value: '3', icon: Layers },
              { label: 'Weeks', value: String(totalWeeks), icon: Clock },
              { label: 'Lectures', value: String(totalLectures), icon: FileText },
              { label: 'Contests', value: `${totalWeeks + 3 + 1}`, icon: Trophy },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-zinc-800/60">
                <Icon size={14} className="text-[#A41034]" />
                <span className="text-lg font-bold text-white">{value}</span>
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Phases ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {CURRICULUM_DATA.map((phase) => {
          const colors = phaseColors[phase.number];
          const isPhaseOpen = !!expandedPhases[phase.id];
          const PhaseIcon = phase.icon;

          return (
            <div key={phase.id}
              className="rounded-xl border overflow-hidden transition-all duration-200"
              style={{ borderColor: isPhaseOpen ? colors.border : 'rgba(255,255,255,0.06)', background: '#13141699' }}>

              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.03]">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                  <PhaseIcon size={18} style={{ color: colors.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest"
                      style={{ color: colors.accent, background: colors.bg, border: `1px solid ${colors.border}` }}>
                      Phase {phase.number}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-semibold">{phase.lecturesCount} Lectures · {phase.weeksCount} Weeks</span>
                  </div>
                  <h2 className="font-serif text-base font-bold text-white">{phase.title}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5 hidden sm:block">{phase.subtitle}</p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isPhaseOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Phase Body */}
              {isPhaseOpen && (
                <div className="px-6 pb-6 space-y-3 border-t border-zinc-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                    {phase.weeks.map((week) => {
                      const isWeekOpen = !!expandedWeeks[week.number];
                      return (
                        <div key={week.number}
                          className={`rounded-lg border transition-all duration-200 ${isWeekOpen ? 'border-zinc-700/60 bg-[#0d0e10]' : 'border-zinc-800/40 bg-[#0d0e10]/50'}`}>

                          {/* Week Header */}
                          <button
                            onClick={() => toggleWeek(week.number)}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-left">
                            <Folder size={14} style={{ color: isWeekOpen ? colors.accent : '#52525b' }} />
                            <span className={`text-xs font-bold flex-1 ${isWeekOpen ? 'text-white' : 'text-zinc-400'}`}>
                              Week {week.number}
                            </span>
                            <ChevronRight size={12} className={`text-zinc-600 transition-transform duration-200 ${isWeekOpen ? 'rotate-90' : ''}`} />
                          </button>

                          {/* Week Content */}
                          {isWeekOpen && (
                            <div className="px-3 pb-3 space-y-1.5 border-t border-zinc-800/30">
                              {week.lectures.map((lec) => {
                                const isLecOpen = !!expandedLectures[lec.id];
                                return (
                                  <div key={lec.id} className="rounded overflow-hidden">
                                    <button
                                      onClick={() => toggleLecture(lec.id)}
                                      className={`w-full flex items-center gap-2 px-3 py-2 mt-1.5 rounded text-left text-xs transition-colors ${isLecOpen ? 'bg-zinc-800/60 text-white' : 'hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200'}`}>
                                      <FileText size={11} className="shrink-0 text-zinc-600" />
                                      <span className="flex-1 font-medium">L{lec.number}: {lec.title}</span>
                                      <ChevronDown size={10} className={`shrink-0 text-zinc-600 transition-transform ${isLecOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isLecOpen && (
                                      <ul className="pl-6 py-1.5 space-y-0.5 border-l-2 ml-3 mt-0.5"
                                        style={{ borderColor: colors.border }}>
                                        {lec.topics.map((topic, i) => (
                                          <li key={i} className="text-[10px] text-zinc-500 leading-relaxed list-disc list-inside">
                                            {topic}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}

                              {/* Weekly Contest */}
                              <div className="mt-2 px-3 py-2 rounded flex items-center gap-2"
                                style={{ background: `${colors.bg}`, border: `1px solid ${colors.border}` }}>
                                <Trophy size={11} style={{ color: colors.accent }} className="shrink-0" />
                                <span className="text-[10px] font-bold" style={{ color: colors.accent }}>
                                  {week.contest.title}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Phase Contest */}
                  <div className="mt-2 rounded-lg px-5 py-3 flex items-center justify-between"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-2.5">
                      <Trophy size={14} style={{ color: colors.accent }} />
                      <span className="text-sm font-bold text-white">{phase.phaseContest.title}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ color: colors.accent, border: `1px solid ${colors.border}` }}>
                      Phase Contest
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Grand Final ── */}
        <div className="rounded-xl border border-[#A41034]/30 bg-gradient-to-br from-[#A41034]/10 via-[#0d0e10] to-[#0d0e10] p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#A41034]/15 border border-[#A41034]/30">
                <Flag size={18} className="text-[#A41034]" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#A41034]">Final Event</span>
                <h3 className="font-serif text-lg font-bold text-white">Grand Final</h3>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#A41034]/40 text-[#A41034] bg-[#A41034]/10 animate-pulse">
              Live
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Duration', value: '3–5 Hours' },
              { label: 'Problems', value: '7–12' },
              { label: 'Difficulty', value: 'Easy → Medium' },
              { label: 'Format', value: 'ICPC Style' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-white/[0.03] border border-zinc-800/50 px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800/50 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Topics Covered</p>
            <div className="flex flex-wrap gap-1.5">
              {['C Programming', 'C++', 'STL', 'Sorting & Searching', 'Time Complexity',
                'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking'].map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-700/40 text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
