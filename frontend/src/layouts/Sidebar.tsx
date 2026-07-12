import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Code2,
  Trophy,
  BookOpen,
  MessageSquare,
  Calendar as CalendarIcon,
  Shield,
  Layers,
  Search,
  Bell,
  Sun,
  Moon,
  Mail,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Users,
  Award,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onShowComingSoon: (title: string) => void;
  onCloseMobile?: () => void;
  onToggleSearch: () => void;
  onToggleNotifications: () => void;
  onToggleTheme: () => void;
  currentTheme: 'dark' | 'light';
  unreadNotifications: number;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  onShowComingSoon,
  onCloseMobile,
  onToggleSearch,
  onToggleNotifications,
  onToggleTheme,
  currentTheme,
  unreadNotifications
}: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogoutClick = async () => {
    if (onCloseMobile) onCloseMobile();
    await logout();
  };

  return (
    <div className="h-full flex bg-sidebar-bg text-sidebar-text z-30 select-none border-r border-sidebar-border" aria-label="Sidebar Navigation">
      {/* ── Activity Bar (icon strip) ── */}
      <div className="w-[58px] bg-sidebar-activityBg border-r border-sidebar-border flex flex-col justify-between items-center py-4 shrink-0">
        <div className="flex flex-col items-center gap-6 w-full">
          <Link to="/dashboard" onClick={onCloseMobile} className="w-10 h-10 rounded-xl hover:border-sidebar-accent/50 transition-all flex items-center justify-center focus-visible:outline-none">
            <img src="/binary_blitz/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </Link>
          <div className="w-8 h-px bg-sidebar-border" />
          <div className="flex flex-col items-center gap-4 w-full">
            <button onClick={onToggleSearch} className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-muted hover:text-white hover:bg-sidebar-hover transition-all group relative focus:outline-none" title="Global Search (Ctrl+K)">
              <Search size={18} />
              <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">Search (Ctrl+K)</div>
            </button>
            <button onClick={onToggleTheme} className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-muted hover:text-white hover:bg-sidebar-hover transition-all group relative focus:outline-none" title="Toggle Visual Theme">
              {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">Toggle Theme</div>
            </button>
            <button onClick={onToggleNotifications} className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-muted hover:text-white hover:bg-sidebar-hover transition-all group relative focus:outline-none" title="Notifications">
              <div className="relative">
                <Bell size={18} />
                {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </div>
              <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">Notifications ({unreadNotifications})</div>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          {user && (
            <button onClick={() => onShowComingSoon('Profile')} className="w-9 h-9 rounded-full overflow-hidden border border-sidebar-border hover:border-sidebar-accent/50 transition-all group relative focus:outline-none" title="View Profile">
              <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80'} alt={user.name} className="w-full h-full object-cover" />
              <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2.5 py-1.5 rounded-lg text-left shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <p className="text-[10px] font-bold text-white leading-none">{user.name}</p>
                <p className="text-[8px] text-sidebar-accent font-extrabold uppercase mt-1 leading-none">Rating: {user.rating}</p>
              </div>
            </button>
          )}
          <button onClick={() => onShowComingSoon('Settings')} className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-muted hover:text-white hover:bg-sidebar-hover transition-all group relative focus:outline-none" title="Settings">
            <Settings size={18} />
            <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">Settings</div>
          </button>
          <button onClick={handleLogoutClick} className="w-10 h-10 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group relative focus:outline-none" title="Logout">
            <LogOut size={18} />
            <div className="absolute left-[54px] z-50 bg-zinc-950 border border-sidebar-border px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">Logout</div>
          </button>
        </div>
      </div>

      {/* ── Main Panel ── */}
      <div className={`h-full bg-sidebar-bg flex flex-col transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0' : 'w-64'}`}>
        {/* Header */}
        <div className="p-5 border-b border-sidebar-border flex flex-col justify-between gap-4 select-none">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <img src="/binary_blitz/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="font-serif font-semibold text-[20px] text-white tracking-tight leading-none">Binary Blitz</span>
              </div>
              <span className="text-[9px] text-sidebar-muted font-sans font-semibold mt-1.5 uppercase tracking-[0.12em]">Competitive Programming</span>
            </div>
            <button onClick={() => setIsCollapsed(true)} className="hidden md:flex w-6 h-6 rounded items-center justify-center hover:bg-sidebar-hover text-sidebar-muted hover:text-white transition-colors" title="Hide Sidebar">
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-sidebar-border/50 text-[11px] text-sidebar-muted">
            <div className="flex flex-col mt-2 pt-1 border-t border-sidebar-border/30 text-[10px]">
              <span className="font-semibold text-zinc-400">{user?.name || 'David J. Malan'} ({user?.role || 'Lead'})</span>
              <a href={`mailto:${user?.email || 'malan@harvard.edu'}`} className="hover:underline text-sidebar-accent/80 hover:text-sidebar-accent flex items-center gap-1 mt-0.5"><Mail size={9} /> {user?.email || 'malan@harvard.edu'}</a>
            </div>
          </div>
        </div>

        {/* Nav Sections */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar py-4 px-3 space-y-6">

          {/* Course Navigation */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 pb-1.5 pt-1">
              <div className="h-px flex-1 bg-[#2a2c30]" />
              <h5 className="text-[9px] font-bold tracking-[0.14em] text-[#A41034] uppercase select-none shrink-0">Course Navigation</h5>
              <div className="h-px flex-1 bg-[#2a2c30]" />
            </div>
            <div className="space-y-0.5">
              {[
                { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                { title: 'Schedule Tracker', icon: Map, href: '/schedule' },
                { title: 'Problem Sets', icon: Code2, href: '/problems' },
                { title: 'Contests', icon: Trophy, href: '/contests' },
                { title: 'Leaderboard', icon: Award, href: '/leaderboard' },
                { title: 'Learning Hub', icon: BookOpen, href: '/learning' },
                { title: 'Club Directory', icon: Users, href: '/community' },
              ].map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link key={item.title} to={item.href} onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-2 transition-all duration-150 rounded border-l-2 text-sm ${active ? 'border-l-[#A41034] text-white font-semibold bg-[rgba(164,16,52,0.07)]' : 'border-l-transparent text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1a1c1f]'}`}>
                    <item.icon size={16} className={active ? 'text-[#A41034]' : 'text-zinc-500'} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Course Roadmap — single link to dedicated page */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 pb-1.5 pt-1">
              <div className="h-px flex-1 bg-[#2a2c30]" />
              <h5 className="text-[9px] font-bold tracking-[0.14em] text-[#A41034] uppercase select-none shrink-0">Course Roadmap</h5>
              <div className="h-px flex-1 bg-[#2a2c30]" />
            </div>
            <div className="space-y-0.5">
              {(() => {
                const active = location.pathname === '/roadmap';
                return (
                  <Link to="/roadmap" onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-2 transition-all duration-150 rounded border-l-2 text-sm ${active ? 'border-l-[#A41034] text-white font-semibold bg-[rgba(164,16,52,0.07)]' : 'border-l-transparent text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1a1c1f]'}`}>
                    <Layers size={16} className={active ? 'text-[#A41034]' : 'text-zinc-500'} />
                    <span>View Full Roadmap</span>
                  </Link>
                );
              })()}
            </div>
          </div>

          {/* Community */}
          <div className="space-y-1 pt-2 border-t border-[#1a1c1f]">
            <div className="flex items-center gap-2 px-2 pb-1.5">
              <div className="h-px flex-1 bg-[#2a2c30]" />
              <h5 className="text-[9px] font-bold tracking-[0.14em] text-[#A41034] uppercase select-none shrink-0">Community</h5>
              <div className="h-px flex-1 bg-[#2a2c30]" />
            </div>
            <div className="space-y-0.5">
              {[
                { title: 'Discussions & Chat', icon: MessageSquare, href: '/chat' },
                { title: 'Events Calendar', icon: CalendarIcon, href: '/calendar' },
                { title: 'Announcements', icon: MessageSquare, href: '/chat', isComingSoon: true },
              ].map((item) => {
                const active = location.pathname === item.href && !item.isComingSoon;
                const handleClick = (e: React.MouseEvent) => {
                  if (item.isComingSoon) { e.preventDefault(); onShowComingSoon(item.title); }
                  if (onCloseMobile) onCloseMobile();
                };
                return (
                  <Link key={item.title} to={item.isComingSoon ? '#' : item.href} onClick={handleClick}
                    className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${active ? 'text-white font-semibold bg-[rgba(164,16,52,0.07)] border-l-2 border-l-[#A41034]' : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1a1c1f] border-l-2 border-l-transparent'}`}>
                    <div className="flex items-center gap-2.5">
                      <item.icon size={16} className={active ? 'text-[#A41034]' : 'text-zinc-500'} />
                      <span>{item.title}</span>
                    </div>
                    {item.isComingSoon && <span className="text-[7.5px] font-bold border border-[#A41034]/40 text-[#A41034]/70 px-1 rounded uppercase tracking-wider shrink-0">Soon</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Management */}
          <div className="space-y-1 pt-2 border-t border-[#1a1c1f]">
            <div className="flex items-center gap-2 px-2 pb-1.5">
              <div className="h-px flex-1 bg-[#2a2c30]" />
              <h5 className="text-[9px] font-bold tracking-[0.14em] text-[#A41034] uppercase select-none shrink-0">Management</h5>
              <div className="h-px flex-1 bg-[#2a2c30]" />
            </div>
            <div className="space-y-0.5">
              {[
                { title: 'Admin Control Panel', icon: Shield, href: '/admin', roles: ['ADMIN'] },
                { title: 'Manage Schedule', icon: CalendarIcon, href: '/instructor/schedule', roles: ['ADMIN', 'TRAINER'] },
              ]
                .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                .map((item) => {
                  const active = location.pathname === item.href;
                  return (
                    <Link key={item.title} to={item.href} onClick={onCloseMobile}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all ${active ? 'text-white font-semibold bg-[rgba(164,16,52,0.07)] border-l-2 border-l-[#A41034]' : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1a1c1f] border-l-2 border-l-transparent'}`}>
                      <item.icon size={16} className={active ? 'text-[#A41034]' : 'text-zinc-500'} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1a1c1f] select-none bg-sidebar-activityBg shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-sans font-bold uppercase tracking-[0.12em] text-[#A41034]/70">Binary Blitz</span>
            <span className="text-[8.5px] font-sans text-[#4a4c50]">© 2026</span>
          </div>
        </div>
      </div>

      {/* Collapsed expander */}
      {isCollapsed && (
        <div className="hidden md:flex w-6 bg-sidebar-bg/15 hover:bg-sidebar-bg/30 border-r border-sidebar-border flex-col items-center pt-5 cursor-pointer transition-colors" onClick={() => setIsCollapsed(false)} title="Open Sidebar">
          <ChevronRight size={13} className="text-sidebar-muted hover:text-white" />
        </div>
      )}
    </div>
  );
}
