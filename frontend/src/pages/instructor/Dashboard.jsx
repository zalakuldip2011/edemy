import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import {
  PlusIcon,
  BookOpenIcon,
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChartBarIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    draftCourses: 0,
    publishedCourses: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulated API calls - replace with actual endpoints
      setTimeout(() => {
        setStats({
          totalCourses: 3,
          totalStudents: 124,
          totalRevenue: 2450,
          averageRating: 4.6,
          draftCourses: 1,
          publishedCourses: 2
        });
        
        setRecentCourses([
          {
            id: 1,
            title: "Complete Web Development Bootcamp",
            status: "Published",
            students: 89,
            rating: 4.8,
            thumbnail: "/api/placeholder/300/200"
          },
          {
            id: 2,
            title: "React.js for Beginners",
            status: "Draft",
            students: 0,
            rating: 0,
            thumbnail: "/api/placeholder/300/200"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const progressItems = [
    {
      title: "Finish your course",
      description: "Complete your course to start earning",
      progress: 75,
      action: "Continue",
      link: "/instructor/courses/create"
    }
  ];

  const quickActions = [
    {
      title: "Create Course",
      description: "Start building your course",
      icon: PlusIcon,
      link: "/instructor/courses/create",
      color: "purple"
    },
    {
      title: "Edit Curriculum",
      description: "Update your course content",
      icon: PencilIcon,
      link: "/instructor/courses",
      color: "blue"
    },
    {
      title: "View Performance",
      description: "Check your course analytics",
      icon: ChartBarIcon,
      link: "/instructor/performance",
      color: "green"
    }
  ];

  const recommendations = [
    {
      title: "Create an Engaging Course",
      description: "Learn how to create courses that students love",
      image: "/api/placeholder/80/60",
      link: "/instructor/resources"
    },
    {
      title: "Build Your Audience",
      description: "Tips to market and grow your student base",
      image: "/api/placeholder/80/60",
      link: "/instructor/resources"
    },
    {
      title: "Get Started with Video",
      description: "Best practices for recording quality videos",
      image: "/api/placeholder/80/60",
      link: "/instructor/resources"
    }
  ];

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'Instructor'}!
          </h1>
          <p className={`mt-2 transition-colors ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Here's what's happening with your courses today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className={`h-6 w-6 ${
                  isDarkMode ? 'text-red-400' : 'text-purple-600'
                }`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Total Courses</p>
                <p className={`text-2xl font-bold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className={`h-6 w-6 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Total Students</p>
                <p className={`text-2xl font-bold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow-sm border p-6 transition-colors ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className={`h-6 w-6 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium transition-colors ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Tracker */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              {progressItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <Link
                      to={item.link}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {item.action}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.progress}% complete</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className={`
                        block p-4 border-2 border-dashed rounded-lg text-center hover:border-solid transition-all
                        ${action.color === 'purple' ? 'border-purple-300 hover:border-purple-600 hover:bg-purple-50' :
                          action.color === 'blue' ? 'border-blue-300 hover:border-blue-600 hover:bg-blue-50' :
                          'border-green-300 hover:border-green-600 hover:bg-green-50'}
                      `}
                    >
                      <Icon className={`
                        h-8 w-8 mx-auto mb-2
                        ${action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'blue' ? 'text-blue-600' :
                          'text-green-600'}
                      `} />
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
                <Link 
                  to="/instructor/courses"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded bg-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{course.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${course.status === 'Published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}
                        `}>
                          {course.status}
                        </span>
                        <span className="text-sm text-gray-500">{course.students} students</span>
                        {course.rating > 0 && (
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-500 ml-1">{course.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for you</h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Link
                    key={index}
                    to={rec.link}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src={rec.image} 
                      alt={rec.title}
                      className="w-12 h-9 object-cover rounded bg-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{rec.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;