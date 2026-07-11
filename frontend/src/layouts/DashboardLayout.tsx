import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Menu, 
  Bell,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import Sidebar from './Sidebar';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Interactive UI states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n-1', title: 'Contest Starting Soon', desc: 'Comptron Weekly Training Contest #1 is live now.', time: '5m ago', read: false },
    { id: 'n-2', title: 'New Resource Uploaded', desc: 'Dr. John Doe uploaded "Introduction to Dynamic Programming".', time: '2h ago', read: false },
    { id: 'n-3', title: 'Mentorship Request Update', desc: 'Alumni Jane Smith accepted your mentorship connection.', time: '1d ago', read: true }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // Load theme
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('light', storedTheme === 'light');
    }

    // Keyboard listener for Cmd+K / Ctrl+K search modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync collapsible state based on screen width on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth > 1024) {
        setIsCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleShowComingSoon = (featureTitle: string) => {
    setToastMessage(`${featureTitle} section is coming soon!`);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mock global search data
  const mockSearchDb = [
    { type: 'Problem', name: 'A+B Problem', path: '/problems' },
    { type: 'Problem', name: 'Shortest Path (Dijkstra)', path: '/problems' },
    { type: 'Contest', name: 'Comptron Weekly Training Contest #1', path: '/contests' },
    { type: 'Resource', name: 'Competitive Programmer\'s Handbook', path: '/learning' },
    { type: 'Trainer', name: 'Dr. John Doe', path: '/community' },
  ];

  const searchResults = searchQuery
    ? mockSearchDb.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground select-none">
      {/* Mobile Drawer (Backdrop & Sidebar container) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden flex"
            >
              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => {}}
                onShowComingSoon={handleShowComingSoon}
                onCloseMobile={() => setMobileOpen(false)}
                onToggleSearch={() => setSearchOpen(prev => !prev)}
                onToggleNotifications={() => setNotifOpen(prev => !prev)}
                onToggleTheme={toggleTheme}
                currentTheme={theme}
                unreadNotifications={unreadCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Activity Bar + Collapsible Course Menu) */}
      <aside className="hidden md:block h-screen shrink-0 z-30 select-none">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onShowComingSoon={handleShowComingSoon}
          onToggleSearch={() => setSearchOpen(prev => !prev)}
          onToggleNotifications={() => setNotifOpen(prev => !prev)}
          onToggleTheme={toggleTheme}
          currentTheme={theme}
          unreadNotifications={unreadCount}
        />
      </aside>

      {/* Main Workspace Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar: minimalist header for content, only shows mobile menu triggers */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4 w-full">
            {/* Hamburger Button on Mobile */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-accent rounded-lg p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            
            {/* Search Input Trigger Box - only on mobile since Activity Bar covers desktop */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex md:hidden items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-zinc-900/40 text-xs text-zinc-500 hover:border-zinc-700 transition-all min-w-[150px]"
            >
              <Search size={13} />
              <span>Search...</span>
            </button>

          {/* Breadcrumb-style header — Harvard editorial */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-sans">
            <span className="text-[#9A9A9A] uppercase tracking-widest font-semibold text-[9px]">NWU PS</span>
            <span className="text-[#4B4F55] mx-1">/</span>
            <span className="text-[#F2F2F2] font-semibold capitalize tracking-wide">
              {window.location.pathname.split('/')[1] || 'Dashboard'}
            </span>
          </div>
          </div>

          {/* Right Header items (Visible on Mobile only as desktop is covered by Activity Bar) */}
          <div className="flex items-center gap-3 md:hidden relative">
            <button 
              onClick={toggleTheme}
              className="p-2 border border-border rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100 transition-colors"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 border border-border rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100 transition-colors relative"
              aria-label="Toggle notifications panel"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content + Footer wrapper */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* ── Main content area ───────────────── */}
          <main className="flex-1 p-6 md:p-8 bg-background" id="main-content">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>

          {/* ── Harvard 3-band Footer ────────────── */}
          <footer className="shrink-0 select-none">
            {/* Band 1: Harvard Crimson newsletter strip */}
            <div className="bg-[#A41034] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-serif text-base italic text-white tracking-wide">Stay in the know</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="px-4 py-2 text-xs text-black bg-white border-0 outline-none w-52 font-sans"
                />
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white border border-white hover:bg-white hover:text-[#A41034] transition-all font-sans">
                  Sign Up →
                </button>
              </div>
            </div>

            {/* Band 2: Black links */}
            <div className="bg-[#0a0a0a] px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Brand */}
              <div>
                <p className="font-serif text-white text-lg font-semibold tracking-tight">NWU PS</p>
                <p className="text-[8.5px] text-[#9A9A9A] font-sans font-normal mt-1 uppercase tracking-[0.14em]">Competitive Programming</p>
                <div className="flex items-center gap-2 mt-3 text-[#5a5a5a]">
                  {/* social dots */}
                  {['CF', 'GH', 'YT'].map(s => (
                    <span key={s} className="text-[8px] font-bold border border-[#2a2a2a] px-1.5 py-0.5 hover:text-white hover:border-[#A41034]/60 transition-colors cursor-pointer">{s}</span>
                  ))}
                </div>
              </div>
              {/* Link columns */}
              {[
                { title: 'Platform', links: ['Dashboard', 'Problems', 'Contests', 'Leaderboard'] },
                { title: 'Learning', links: ['Learning Hub', 'Schedule', 'Community', 'Calendar'] },
                { title: 'Info', links: ['About NWU PS', 'OpenCourseWare', 'Contact', 'Privacy'] },
              ].map(col => (
                <div key={col.title}>
                  <h6 className="text-white text-[9px] font-bold uppercase tracking-[0.14em] mb-3 font-sans">{col.title}</h6>
                  {col.links.map(l => (
                    <p key={l} className="text-[#6B6B6B] text-[10px] font-sans py-0.5 hover:text-white transition-colors cursor-pointer">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Band 3: Copyright strip */}
            <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] px-8 py-3 flex items-center justify-between">
              <span className="text-[9px] text-[#4a4a4a] font-sans">© 2026 NWU CP Academy</span>
              <div className="flex gap-6">
                {['Accessibility', 'Privacy', 'Sitemap'].map(l => (
                  <span key={l} className="text-[9px] text-[#4a4a4a] font-sans hover:text-white transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Notifications Dropdown Panel (Responsive positioning) */}
      <AnimatePresence>
        {notifOpen && (
          <>
            {/* Backdrop click-away trigger */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setNotifOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed md:absolute left-4 md:left-[72px] right-4 md:right-auto top-20 md:top-36 w-auto md:w-80 glass rounded-xl border border-border shadow-2xl p-4 z-50 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-zinc-300">Notifications</h4>
                <button onClick={markAllRead} className="text-[10px] text-sidebar-accent hover:underline flex items-center gap-0.5">
                  <Check size={11} /> Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2 rounded-lg text-left text-xs transition-colors ${n.read ? 'opacity-65' : 'bg-sidebar-accent/5 border-l-2 border-sidebar-accent'}`}>
                    <p className="font-semibold text-zinc-200">{n.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{n.desc}</p>
                    <span className="text-[9px] text-zinc-600 font-mono block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Cmd+K Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop click-away */}
          <div className="fixed inset-0" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass border border-border rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Search size={16} className="text-zinc-500" />
              <input
                id="global-search-input"
                type="text"
                autoFocus
                placeholder="Search problems, contests, trainers, learning books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-zinc-200 text-xs placeholder-zinc-600 font-sans"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-border text-zinc-500">Esc</button>
            </div>
            
            {/* Results pane */}
            <div className="max-h-72 overflow-y-auto p-2">
              {searchQuery === '' ? (
                <div className="p-8 text-center text-xs text-zinc-600">Type query (e.g. Dijkstra, Contest) to search the CP platform.</div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-600">No match found.</div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(item.path);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-300 font-semibold">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-border text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{item.type}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Premium Toast Coming Soon Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900/95 backdrop-blur border border-sidebar-accent/30 text-white text-xs font-bold rounded-xl shadow-2xl shadow-sidebar-accent/10"
          >
            <div className="w-5 h-5 rounded-full bg-sidebar-accent/10 border border-sidebar-accent text-sidebar-accent flex items-center justify-center font-extrabold text-[10px]">
              ℹ
            </div>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-3 text-zinc-500 hover:text-white transition-colors font-bold"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
