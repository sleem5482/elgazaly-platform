import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import FreeExamPage from './pages/public/FreeExamPage';
import StudentDashboard from './pages/student/StudentDashboard';
import GradePage from './pages/student/GradePage';
import MonthPage from './pages/student/MonthPage';
import WeekPage from './pages/student/WeekPage';
import LessonPage from './pages/student/LessonPage';
import PaymentPage from './pages/student/PaymentPage';
import ExamsPage from './pages/student/ExamsPage';
import CertificatesPage from './pages/student/CertificatesPage';
import SettingsPage from './pages/student/SettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminContent from './pages/admin/AdminContent';
import AdminExams from './pages/admin/AdminExams';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGrades from './pages/admin/AdminGrades';
import AdminSections from './pages/admin/AdminSections';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  useEffect(() => {
    // Disable right click
    // const handleContextMenu = (e) => {
    //   e.preventDefault();
    // };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are disabled');
        return false;
      }

      // Prevent Ctrl+P, Ctrl+S, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C
      if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || (e.shiftKey && (e.key === 'i' || e.key === 'c')))) {
        e.preventDefault();
        return false;
      }
    };

    // document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right select-none" dir="rtl">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/free-exam/:examId" element={<FreeExamPage />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/grade/:gradeId" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <GradePage />
          </ProtectedRoute>
        } />
        <Route path="/month/:monthId" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <MonthPage />
          </ProtectedRoute>
        } />
        <Route path="/week/:weekId" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <WeekPage />
          </ProtectedRoute>
        } />
        <Route path="/lesson/:lessonId" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <LessonPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/exams" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <ExamsPage />
          </ProtectedRoute>
        } />
        <Route path="/certificates" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <CertificatesPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCourses />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSubscriptions />
          </ProtectedRoute>
        } />
        <Route path="/admin/content" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminContent />
          </ProtectedRoute>
        } />
        <Route path="/admin/exams" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminExams />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/grades" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminGrades />
          </ProtectedRoute>
        } />
        <Route path="/admin/sections" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSections />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
