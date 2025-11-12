import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  BookOpenIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch enrollments
      const enrollmentsRes = await fetch('/api/enrollments', {
        credentials: 'include'
      });
      const enrollmentsData = await enrollmentsRes.json();
      
      if (enrollmentsData.success) {
        setEnrollments(enrollmentsData.enrollments || []);
        
        // Calculate stats from the enrollments
        const enrollmentsList = enrollmentsData.enrollments || [];
        const completed = enrollmentsList.filter(e => e.status === 'completed').length;
        const totalHours = enrollmentsList.reduce((sum, e) => 
          sum + (e.course?.totalDuration ? e.course.totalDuration / 3600 : 0), 0
        );
        
        setStats({
          totalCourses: enrollmentsList.length,
          completedCourses: completed,
          totalHours: Math.floor(totalHours),
          certificates: enrollmentsData.stats?.certificatesEarned || completed,
          currentStreak: 7 // TODO: Calculate from activity
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-blue-500 to-cyan-500';
    if (progress >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-purple-500 to-pink-500';
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user.name || user.username}! 👋
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Continue your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Courses */}
          <div className={`rounded-2xl p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50' 
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
              }`}>
                <BookOpenIcon className="h-6 w-6 text-blue-500" />
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {stats.totalCourses}
              </span>
            </div>
            <h3 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Enrolled Courses
            </h3>
          </div>

          {/* Completed Courses */}
          <div className={`rounded-2xl p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50' 
              : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
              }`}>
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {stats.completedCourses}
              </span>
            </div>
            <h3 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Completed
            </h3>
          </div>

          {/* Learning Hours */}
          <div className={`rounded-2xl p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50' 
              : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
              }`}>
                <ClockIcon className="h-6 w-6 text-purple-500" />
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {stats.totalHours}h
              </span>
            </div>
            <h3 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Learning Time
            </h3>
          </div>

          {/* Certificates */}
          <div className={`rounded-2xl p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/50' 
              : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-500/10'
              }`}>
                <TrophyIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {stats.certificates}
              </span>
            </div>
            <h3 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Certificates
            </h3>
          </div>

          {/* Current Streak */}
          <div className={`rounded-2xl p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-700/50' 
              : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/10'
              }`}>
                <FireIcon className="h-6 w-6 text-orange-500" />
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`}>
                {stats.currentStreak}
              </span>
            </div>
            <h3 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Day Streak 🔥
            </h3>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Continue Learning
              </h2>
              <Link
                to="/courses"
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
              >
                Browse All →
              </Link>
            </div>

            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-6 animate-pulse ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-20 bg-gray-700/50 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-700/50 rounded w-3/4" />
                        <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                        <div className="h-2 bg-gray-700/50 rounded w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              // Empty state
              <div className={`rounded-2xl p-12 text-center ${
                isDarkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <BookOpenIcon className={`h-16 w-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No enrolled courses yet
                </h3>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Start your learning journey by exploring our course catalog
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              // Enrolled courses
              <div className="space-y-4">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <Link
                    key={enrollment._id}
                    to={`/learn/${enrollment.course._id}`}
                    className={`block rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                        : 'bg-white hover:shadow-xl border border-gray-200'
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Course Thumbnail */}
                      <div className="flex-shrink-0">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {enrollment.course.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold mb-2 truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {enrollment.course.title}
                        </h3>
                        <p className={`text-sm mb-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {enrollment.course.instructor?.name || 'Unknown Instructor'}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Progress
                            </span>
                            <span className={`font-semibold ${
                              isDarkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                              {enrollment.progress || 0}%
                            </span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(enrollment.progress || 0)} transition-all duration-500`}
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Last Accessed */}
                        {enrollment.lastAccessed && (
                          <p className={`text-xs mt-2 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Last accessed {new Date(enrollment.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Continue Button */}
                      <div className="flex items-center">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                          <PlayCircleIcon className="h-5 w-5" />
                          Continue
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Activity & Quick Links */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Weekly Goal 🎯
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      5 of 7 days
                    </span>
                    <span className="text-purple-500 font-semibold">71%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                      style={{ width: '71%' }}
                    />
                  </div>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Keep going! Just 2 more days to reach your weekly goal.
                </p>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Achievements 🏆
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Course Completed
                    </h4>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FireIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      7-Day Streak
                    </h4>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Active now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl p-6 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}>
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="h-5 w-5 text-purple-500" />
                    <span>Browse Courses</span>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="h-5 w-5 text-blue-500" />
                    <span>My Profile</span>
                  </div>
                </Link>
                <Link
                  to="/certificates"
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="h-5 w-5 text-yellow-500" />
                    <span>Certificates</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;