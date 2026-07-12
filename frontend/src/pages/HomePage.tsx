import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Trophy, BookOpen, ArrowRight, Shield, ChevronRight, Facebook, MessageCircle, Zap, Heart } from 'lucide-react';

const stats = [
  { label: 'Active Members', value: '200+' },
  { label: 'Problems', value: '500+' },
  { label: 'Contests Held', value: '50+' },
  { label: 'ICPC Regionals', value: '10+' },
];

// ─── Acknowledgement Card ────────────────────────────────────────────────────
interface AcknowledgementCardProps {
  name: string;
  description: React.ReactNode;
  facebookUrl?: string;
  whatsappUrl?: string;
  avatarSeed?: string;
  bgImage: string;
  variant?: 'horizontal' | 'vertical';
  delay?: number;
}

function AcknowledgementCard({
  name,
  description,
  facebookUrl = '#',
  whatsappUrl = '#',
  avatarSeed,
  bgImage,
  variant = 'vertical',
  delay = 0,
}: AcknowledgementCardProps) {
  const seed = avatarSeed || name.replace(/\s/g, '');
  const isHorizontal = variant === 'horizontal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group flex flex-col ${isHorizontal ? 'md:flex-row' : ''} overflow-hidden rounded-xl border border-white/10 bg-[#1E222B] shadow-2xl hover:border-[#A41034]/50 transition-all duration-300 h-full`}
    >
      {/* Top/Left Image Portion */}
      <div className={`relative w-full ${isHorizontal ? 'md:w-[40%] md:aspect-auto' : 'aspect-[16/10]'} overflow-hidden bg-zinc-900`}>
        <img
          src={bgImage}
          alt={`Photo of ${name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Floating rounded avatar */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=7f1d1d,9f1239,be123c&fontFamily=Georgia&fontSize=40&fontWeight=700`}
            alt={`Profile picture of ${name}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom/Right Crimson Text Container */}
      <div className="bg-[#4A1025] p-6 flex flex-col justify-between flex-1 relative min-h-[220px]">
        <div>
          <h3 className="font-serif text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
            {name}
          </h3>
          <div className="text-sm text-zinc-200/90 leading-relaxed mb-6 font-sans">
            {description}
          </div>
        </div>

        {/* Action/Links Strip */}
        <div className="flex items-center gap-3 pr-12">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${name} on Facebook`}
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Facebook size={12} /> Facebook
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${name} on WhatsApp`}
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
        </div>

        {/* Signature circle button with white arrow */}
        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-[#A41034] group-hover:bg-[#C4122F] text-white flex items-center justify-center transition-colors shadow-lg duration-250">
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Acknowledgement Group ───────────────────────────────────────────────────
interface GroupProps {
  groupLabel: string;
  groupSubtitle: string;
  accentColor: string;
  members: AcknowledgementCardProps[];
  baseDelay?: number;
}

function AcknowledgementGroup({ groupLabel, groupSubtitle, accentColor, members, baseDelay = 0 }: GroupProps) {
  const isSingle = members.length === 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 rounded-full" style={{ background: accentColor }} />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{groupSubtitle}</p>
          <h3 className="text-sm font-bold text-zinc-200">{groupLabel}</h3>
        </div>
      </div>
      <div className={isSingle ? "grid grid-cols-1 gap-8 pt-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2"}>
        {members.map((m, i) => (
          <AcknowledgementCard 
            key={m.name} 
            {...m} 
            variant={isSingle ? 'horizontal' : 'vertical'}
            delay={baseDelay + i * 0.08} 
          />
        ))}
      </div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const GROUP_1 = {
  groupLabel: 'Foundation',
  groupSubtitle: 'The Pioneer',
  accentColor: '#A41034',
  members: [
    {
      name: 'Asif Al Fattah',
      bgImage: '/people/asif_al_fattah.jpg',
      description: (
        <>
          Dedicated with gratitude to <strong className="text-white">Asif Al Fattah</strong>, whose initiative,{' '}
          <em>Code Academia</em>, laid the foundation for Competitive Programming at North Western University, Khulna.
          His pioneering efforts inspired the vision and mission behind <strong className="text-white">Binary Blitz</strong>.
        </>
      ),
    },
  ],
};

const GROUP_2 = {
  groupLabel: 'Encouragement & Guidance',
  groupSubtitle: 'With Appreciation',
  accentColor: '#2563EB',
  members: [
    {
      name: 'Howlader Mehedi Hasan',
      bgImage: '/people/howlader_mehedi_hasan.jpg',
      description:
        'With sincere appreciation for the encouragement, guidance, and valuable contributions throughout the journey of Binary Blitz.',
    },
    {
      name: 'Sk Shiam Rahan',
      bgImage: '/people/sk_shiam_rahan.jpg',
      description:
        'With sincere appreciation for the encouragement, guidance, and valuable contributions throughout the journey of Binary Blitz.',
    },
    {
      name: 'Mamun Parvez',
      bgImage: '/people/mamun_parvez.jpg',
      description:
        'With sincere appreciation for the encouragement, guidance, and valuable contributions throughout the journey of Binary Blitz.',
    },
  ],
};

const GROUP_3 = {
  groupLabel: 'Technical Support',
  groupSubtitle: 'Special Thanks',
  accentColor: '#16A34A',
  members: [
    {
      name: 'Shimul Mandal',
      bgImage: '/people/shimul_mandal.jpg',
      description: 'Special thanks for the technical support and assistance in bringing Binary Blitz to life.',
    },
    {
      name: 'Asif Foysal',
      bgImage: '/people/asif_foysal.jpg',
      description: 'Special thanks for the technical support and assistance in bringing Binary Blitz to life.',
    },
  ],
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-white/10 bg-[#26292D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Binary Blitz home">
            <img src="/binary_blitz/logo.png" alt="Binary Blitz Logo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Binary</span>
              <span className="text-[#A41034]"> Blitz</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-sans font-semibold text-[#9A9A9A] hover:text-white transition-colors uppercase tracking-widest"
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-crimson">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
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


            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A41034] via-[#C4122F] to-[#E03050]">
                Binary Blitz
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl font-bold text-[#A41034] mb-4 tracking-wide"
            >
              Learn. Practice. Compete. Grow.
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg md:text-xl text-[#C8C8C8] mb-12 leading-relaxed font-serif max-w-2xl border-l-2 border-[#A41034]/60 pl-6"
            >
              Your journey into Competitive Programming starts here. Practice curated problem sets, compete in
              ICPC-style contests, and build the skills that matter.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link
                to="/register"
                className="btn-crimson text-base px-8 py-3.5 shadow-[0_4px_24px_rgba(164,16,52,0.45)]"
              >
                Start Competing <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/learning"
                className="btn-outline-crimson text-base px-8 py-3.5 border-white/40 text-white hover:bg-white hover:text-black"
              >
                Explore Curriculum
              </Link>
            </motion.div>
          </div>

          {/* Creator credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex items-center gap-2 text-xs text-zinc-600 font-sans"
          >
            <Heart size={11} className="text-[#A41034] shrink-0" />
            <span>
              Made with <span className="text-[#A41034]">❤️</span> and countless late-night coding by{' '}
              <strong className="text-zinc-400 font-semibold">Moinul and Team</strong>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
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

              {i !== stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-[#4B4F55]/40" />
              )}
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── In Focus Section ── */}
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
                  alt="Students coding at Binary Blitz contest"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[#A41034] text-xs font-bold uppercase tracking-widest mb-3">Upcoming Contest</p>
              <h3 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-4 group-hover:text-[#A41034] transition-colors">
                Binary Blitz Weekly Training Contest #4: Dynamic Programming
              </h3>
              <p className="font-serif text-lg text-[#4A4A4A] leading-relaxed mb-4">
                Prepare for the regional qualifiers by tackling 5 curated DP problems. Rated for all Division 2
                participants. Live editorials immediately following the contest.
              </p>
              <span className="text-xs font-sans font-semibold text-[#6B6B6B]">Oct 15, 2026 • 2:00 PM BDT</span>
            </div>

            {/* Sidebar Articles */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              {[
                { category: 'Platform Update', title: 'New LeetCode-style Problem Interface is Live', date: 'Oct 12, 2026' },
                { category: 'Alumni Spotlight', title: 'How Binary Blitz Alumni cracked Google through ICPC', date: 'Oct 08, 2026' },
                { category: 'Resource', title: 'Ultimate Guide to Graph Theory published in Learning Hub', date: 'Oct 01, 2026' },
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

      {/* ── Feature Split Section ── */}
      <section className="py-24 px-6 bg-[#33363B] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-[#A41034]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A41034] font-sans">The Platform</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 tracking-tight leading-tight">
                Everything you need to <span className="italic">excel</span>.
              </h2>
              <p className="text-[#C8C8C8] text-lg font-serif leading-relaxed mb-10">
                A comprehensive ecosystem built specifically for competitive programmers. We've combined the rigor of ICPC
                with modern learning tools to help you go from beginner to champion.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Code2, title: 'Curated Problem Set', desc: 'Hundreds of problems categorized by topics, complete with difficulty ratings and detailed editorial solutions.' },
                  { icon: BookOpen, title: 'Structured Learning Hub', desc: 'Access lecture slides, algorithm templates, and curated resources aligned with the weekly training schedule.' },
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
              <div className="aspect-[4/5] bg-[#1D2440] p-8 border border-[#4B4F55] rounded flex flex-col justify-between relative z-10">
                <Shield size={40} className="text-[#A41034] opacity-50" />
                <div>
                  <h3 className="font-serif text-3xl text-white mb-4">
                    "The only way to learn a new programming language is by writing programs in it."
                  </h3>
                  <p className="text-sm text-[#9A9A9A] uppercase tracking-widest font-bold font-sans">— Dennis Ritchie</p>
                </div>
              </div>
              <div className="absolute top-8 -right-8 bottom-8 -left-8 border border-[#A41034]/30 z-0 pointer-events-none hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-32 px-6 bg-[#1D2440] relative overflow-hidden">
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

      {/* ── With Gratitude Section ── */}
      <section className="py-24 px-6 bg-[#0D0F14] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(164,16,52,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#A41034]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A41034]">Acknowledgements</span>
              <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#A41034]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              With Gratitude
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto leading-relaxed">
              Binary Blitz stands on the shoulders of those who inspired, guided, and supported this journey.
            </p>
          </motion.div>

          {/* Groups */}
          <div className="space-y-14">
            <AcknowledgementGroup {...GROUP_1} baseDelay={0} />
            <AcknowledgementGroup {...GROUP_2} baseDelay={0.05} />
            <AcknowledgementGroup {...GROUP_3} baseDelay={0.05} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="select-none font-sans">
        {/* Band 1: newsletter strip */}
        <div className="bg-[#A41034] px-6 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-serif text-3xl italic text-white tracking-wide block mb-2">Stay in the know</span>
              <p className="text-white/80 text-sm">Subscribe to the Binary Blitz newsletter for contest updates.</p>
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

        {/* Band 2: links */}
        <div className="bg-[#000000] px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <img src="/binary_blitz/logo.png" alt="Binary Blitz Logo" className="w-8 h-8 object-contain" />
                <span className="font-serif text-white text-2xl font-semibold tracking-tight">Binary Blitz</span>
              </Link>
              <p className="text-[11px] text-[#9A9A9A] font-sans font-normal uppercase tracking-[0.15em] mb-6">Competitive Programming</p>
              <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-sm">
                Your premier platform for algorithm training, contest preparation, and programming excellence.
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Dashboard', 'Problem Set', 'Live Contests', 'Leaderboard'] },
              { title: 'Curriculum', links: ['Learning Hub', 'Training Schedule', 'Community', 'Events Calendar'] },
              { title: 'Resources', links: ['About Binary Blitz', 'Contact Support', 'Privacy Policy'] },
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

        {/* Band 3: Copyright */}
        <div className="bg-[#000000] border-t border-[#1A1A1A] px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-[#6b6b6b] font-sans font-medium uppercase tracking-widest">
              © 2026 Binary Blitz. All rights reserved.
            </span>
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
