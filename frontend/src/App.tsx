import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ProblemsPage from './features/problems/ProblemsPage';
import ProblemDetailPage from './features/problems/ProblemDetailPage';
import ContestsPage from './features/contests/ContestsPage';
import ContestDetailPage from './features/contests/ContestDetailPage';
import LeaderboardPage from './features/leaderboard/LeaderboardPage';
import LearningPage from './features/learning/LearningPage';
import ChatPage from './features/chat/ChatPage';
import CalendarPage from './features/calendar/CalendarPage';
import CommunityPage from './features/community/CommunityPage';
import AdminPage from './features/admin/AdminPage';
import ScheduleTrackerPage from './features/schedule/ScheduleTrackerPage';
import InstructorSchedulePage from './features/schedule/InstructorSchedulePage';
import CourseRoadmapPage from './features/roadmap/CourseRoadmapPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute><DashboardLayout><ProblemsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/problems/:id" element={<ProtectedRoute><DashboardLayout><ProblemDetailPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/contests" element={<ProtectedRoute><DashboardLayout><ContestsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/contests/:id" element={<ProtectedRoute><DashboardLayout><ContestDetailPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><DashboardLayout><LeaderboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><DashboardLayout><LearningPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><DashboardLayout><ChatPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><DashboardLayout><CalendarPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><DashboardLayout><CommunityPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout><AdminPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><DashboardLayout><ScheduleTrackerPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/instructor/schedule" element={<ProtectedRoute roles={['ADMIN', 'TRAINER']}><DashboardLayout><InstructorSchedulePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><DashboardLayout><CourseRoadmapPage /></DashboardLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
