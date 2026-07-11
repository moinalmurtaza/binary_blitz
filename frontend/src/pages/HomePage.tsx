import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Trophy, BookOpen, Users, ArrowRight, Zap, Shield, Globe, ChevronRight } from 'lucide-react';

const stats = [
  { label: 'Active Members', value: '200+' },
  { label: 'Problems', value: '500+' },
  { label: 'Contests Held', value: '50+' },
  { label: 'ICPC Regionals', value: '10+' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar - Transparent to solid on scroll (using glass for now) */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-white/10 bg-[#26292D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold tracking-tight">
            <span className="text-white">NWU</span>
            <span className="text-[#A41034]">PS</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-sans font-semibold text-[#9A9A9A] hover:text-white transition-colors uppercase tracking-widest">Sign In</Link>
            <Link to="/register" className="btn-crimson">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Harvard Editorial Style (Full Bleed Image with Gradient Overlay) */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 px-6 overflow-hidden flex items-center min-h-[90vh]">
        {/* Background Image & Overlays */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1D2440]/95 via-[#1D2440]/80 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#26292D]/40 to-[#26292D]" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-[#A41034]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A41034] font-sans">
                  North Western University
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05] mb-8 text-white"
            >
              Master the Art of <br />
              <span className="italic text-[#C8C8C8]">Algorithms.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-[#C8C8C8] mb-12 leading-relaxed font-serif max-w-2xl border-l-2 border-[#A41034] pl-6"
            >
              Join Comptron Club's premier platform. Practice curated problem sets, compete in rigorous ICPC-style contests, and elevate your competitive programming journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link
                to="/register"
                className="btn-crimson text-base px-8 py-3.5 shadow-[0_4px_20px_rgba(164,16,52,0.4)]"
              >
                Start Competing <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/learning"
                className="btn-outline-crimson text-base px-8 py-3.5 border-white text-white hover:bg-white hover:text-black"
              >
                Explore Curriculum
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Elegant Editorial Style */}
      <section className="py-20 px-6 relative bg-[#26292D] z-10 border-b border-[#4B4F55]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center flex flex-col items-center justify-center relative"
            >
              <p className="font-serif text-5xl md:text-6xl font-medium text-white mb-3 tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-sans text-[#A41034] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
              
              {/* Subtle right divider for desktop */}
              {i !== stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-[#4B4F55]/40" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* In Focus / Latest News section - Editorial Grid */}
      <section className="py-24 px-6 bg-[#FAF7F2] text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-[#1A1A1A] pb-4">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A1A1A]">In Focus</h2>
            </div>
            <Link to="/contests" className="text-[#A41034] text-sm font-bold uppercase tracking-widest mt-4 md:mt-0 hover:text-[#7A0C24] flex items-center gap-1">
              All Contests <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Featured Article */}
            <div className="lg:col-span-7 group cursor-pointer">
              <div className="overflow-hidden mb-6 h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop" 
                  alt="Students coding" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[#A41034] text-xs font-bold uppercase tracking-widest mb-3">Upcoming Contest</p>
              <h3 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-4 group-hover:text-[#A41034] transition-colors">
                Comptron Weekly Training Contest #4: Dynamic Programming
              </h3>
              <p className="font-serif text-lg text-[#4A4A4A] leading-relaxed mb-4">
                Prepare for the regional qualifiers by tackling 5 curated DP problems. Rated for all Division 2 participants. Live editorials immediately following the contest.
              </p>
              <span className="text-xs font-sans font-semibold text-[#6B6B6B]">Oct 15, 2026 • 2:00 PM BDT</span>
            </div>

            {/* Sidebar Articles */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              {[
                { category: 'Platform Update', title: 'New LeetCode-style Problem Interface is Live', date: 'Oct 12, 2026' },
                { category: 'Alumni Spotlight', title: 'How NWU Alumni cracked Google through ICPC', date: 'Oct 08, 2026' },
                { category: 'Resource', title: 'Ultimate Guide to Graph Theory published in Learning Hub', date: 'Oct 01, 2026' }
              ].map((article, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col border-b border-[#D9D0C4] pb-6 last:border-0 last:pb-0">
                  <p className="text-[#A41034] text-[10px] font-bold uppercase tracking-widest mb-2">{article.category}</p>
                  <h4 className="font-serif text-xl font-medium leading-snug mb-2 group-hover:text-[#A41034] transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-[11px] font-sans font-semibold text-[#6B6B6B]">{article.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Split Layout (Dark surface) */}
      <section className="py-24 px-6 bg-[#33363B] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-[#A41034]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A41034] font-sans">
                  The Platform
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 tracking-tight leading-tight">
                Everything you need to <span className="italic">excel</span>.
              </h2>
              <p className="text-[#C8C8C8] text-lg font-serif leading-relaxed mb-10">
                A comprehensive ecosystem built specifically for competitive programmers at North Western University. We've combined the rigor of ICPC with modern learning tools.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Code2, title: 'Curated Problem Set', desc: 'Hundreds of problems categorized by topics, complete with difficulty ratings and detailed editorial solutions.' },
                  { icon: BookOpen, title: 'Structured Learning Hub', desc: 'Access lecture slides, algorithm templates, and curated resources aligned with the weekly training schedule.' }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-[#A41034]/10 flex items-center justify-center border border-[#A41034]/20">
                        <feat.icon size={18} className="text-[#A41034]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-sans text-base font-bold text-white mb-1">{feat.title}</h4>
                      <p className="text-sm text-[#9A9A9A] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Abstract editorial graphic/card stack */}
              <div className="aspect-[4/5] bg-[#1D2440] p-8 border border-[#4B4F55] rounded flex flex-col justify-between relative z-10">
                <Shield size={40} className="text-[#A41034] opacity-50" />
                <div>
                  <h3 className="font-serif text-3xl text-white mb-4">"The only way to learn a new programming language is by writing programs in it."</h3>
                  <p className="text-sm text-[#9A9A9A] uppercase tracking-widest font-bold font-sans">— Dennis Ritchie</p>
                </div>
              </div>
              {/* Decorative offset box */}
              <div className="absolute top-8 -right-8 bottom-8 -left-8 border border-[#A41034]/30 z-0 pointer-events-none hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-[#1D2440] relative overflow-hidden">
        {/* Subtle patterned overlay could go here */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-5xl md:text-6xl font-medium text-white mb-6">Begin your training.</h2>
          <p className="text-[#B9C5ED] text-xl mb-10 font-serif max-w-2xl mx-auto">
            Join hundreds of students currently training for the upcoming regional programming contests.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn-crimson text-base px-10 py-4 shadow-[0_4px_20px_0_rgba(164,16,52,0.4)]"
            >
              Create Free Account <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Harvard Style */}
      <footer className="select-none font-sans">
        {/* Band 1: Harvard Crimson newsletter strip */}
        <div className="bg-[#A41034] px-6 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-serif text-3xl italic text-white tracking-wide block mb-2">Stay in the know</span>
              <p className="text-white/80 text-sm">Subscribe to the Comptron Club newsletter for contest updates.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Email address"
                className="px-5 py-3 text-sm text-black bg-white border-0 outline-none w-full md:w-72 font-sans"
              />
              <button className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white border border-white hover:bg-white hover:text-[#A41034] transition-all font-sans shrink-0">
                Sign Up →
              </button>
            </div>
          </div>
        </div>

        {/* Band 2: Black links */}
        <div className="bg-[#000000] px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <span className="font-serif text-white text-3xl font-semibold tracking-tight">NWU PS</span>
              </Link>
              <p className="text-[11px] text-[#9A9A9A] font-sans font-normal uppercase tracking-[0.15em] mb-6">Competitive Programming</p>
              <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-sm">
                North Western University's official platform for algorithm training, contest preparation, and programming excellence.
              </p>
            </div>
            
            {[
              { title: 'Platform', links: ['Dashboard', 'Problem Set', 'Live Contests', 'Leaderboard'] },
              { title: 'Curriculum', links: ['Learning Hub', 'Training Schedule', 'Community', 'Events Calendar'] },
              { title: 'Resources', links: ['About NWU PS', 'OpenCourseWare', 'Contact Support', 'Privacy Policy'] },
            ].map(col => (
              <div key={col.title}>
                <h6 className="text-white text-[11px] font-bold uppercase tracking-[0.14em] mb-6 font-sans flex items-center gap-2">
                  <div className="w-2 h-[2px] bg-[#A41034]" /> {col.title}
                </h6>
                <div className="space-y-3">
                  {col.links.map(l => (
                    <p key={l} className="text-[#9A9A9A] text-[13px] font-sans hover:text-white transition-colors cursor-pointer w-fit">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Band 3: Copyright strip */}
        <div className="bg-[#000000] border-t border-[#1A1A1A] px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-[#6b6b6b] font-sans font-medium uppercase tracking-widest">© 2026 NWU CP Academy</span>
            <div className="flex gap-8">
              {['Accessibility', 'Privacy', 'Sitemap'].map(l => (
                <span key={l} className="text-[11px] text-[#6b6b6b] font-sans font-medium uppercase tracking-widest hover:text-white transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
