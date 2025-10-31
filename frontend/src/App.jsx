import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import EmailVerification from './pages/auth/EmailVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyResetOTP from './pages/auth/VerifyResetOTP';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import BecomeEducator from './pages/educator/BecomeEducator';
import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/Courses';
import CourseCreate from './pages/instructor/CourseCreate';
import CoursesRoutes from './pages/courses';
import UserProfile from './pages/profile/UserProfile';
import './App.css';
import './styles/theme-global.css';

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  React.useEffect(() => {
    // Apply theme to document element for CSS variables
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);
  
  return (
    <div className={`App theme-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Course Explorer - Public Access */}
      <Route path="/courses/*" element={<CoursesRoutes />} />
      
      {/* User Profile */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      
      {/* Student Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Educator Onboarding */}
      <Route path="/become-educator" element={
        <ProtectedRoute>
          <BecomeEducator />
        </ProtectedRoute>
      } />
      
      {/* Instructor Dashboard */}
      <Route path="/instructor/dashboard" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <InstructorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/instructor" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <InstructorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <InstructorCourses />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses/create" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <CourseCreate />
        </ProtectedRoute>
      } />
    </Routes>
  </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;