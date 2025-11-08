import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  PlayIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await fetch(`/api/courses/public/${courseId}`);
      const courseData = await courseRes.json();
      
      if (!courseData.success) {
        throw new Error('Course not found');
      }
      
      setCourse(courseData.data);
      
      // Check enrollment status if user is logged in
      if (user && user.role === 'student') {
        const enrollmentRes = await fetch(`/api/enrollments/course/${courseId}`, {
          credentials: 'include'
        });
        const enrollmentData = await enrollmentRes.json();
        
        setIsEnrolled(enrollmentData.success && enrollmentData.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    try {
      setEnrolling(true);
      
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ courseId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsEnrolled(true);
        alert('Successfully enrolled! Redirecting to course...');
        navigate(`/courses/${courseId}/learn`);
      } else {
        alert(data.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Loading course...</p>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Course Not Found
            </h2>
            <Link 
              to="/courses" 
              className="text-purple-600 hover:text-purple-700"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Hero Section */}
        <div className={`${
          isDarkMode ? 'bg-slate-800' : 'bg-gradient-to-r from-purple-900 to-indigo-900'
        } text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Course Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500 bg-opacity-20 backdrop-blur-sm rounded-full text-sm">
                    {course.level}
                  </span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                {course.subtitle && (
                  <p className="text-xl text-gray-300 mb-6">{course.subtitle}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {course.averageRating > 0 && (
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolid
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(course.averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{course.averageRating.toFixed(1)}</span>
                      <span className="text-gray-300 ml-2">
                        ({course.totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    <span>{course.totalEnrollments || 0} students enrolled</span>
                  </div>

                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>{formatDuration(course.totalDuration)}</span>
                  </div>

                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    <span>{course.totalLectures || 0} lectures</span>
                  </div>
                </div>

                {course.instructor && (
                  <div className="flex items-center">
                    <span className="text-gray-300">Created by</span>
                    <span className="ml-2 font-semibold">{course.instructor.name}</span>
                  </div>
                )}
              </div>

              {/* Right Column - Price Card */}
              <div className="lg:col-span-1">
                <div className={`rounded-xl shadow-2xl overflow-hidden ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
                }`}>
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="mb-6">
                      {course.price === 0 ? (
                        <div className="text-3xl font-bold text-green-600">FREE</div>
                      ) : (
                        <div>
                          <div className={`text-3xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${course.price}
                          </div>
                          {course.originalPrice > course.price && (
                            <div className="flex items-center mt-2">
                              <span className={`text-lg line-through ${
                                isDarkMode ? 'text-slate-400' : 'text-gray-400'
                              }`}>
                                ${course.originalPrice}
                              </span>
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                                {course.discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isEnrolled ? (
                      <Link
                        to={`/courses/${courseId}/learn`}
                        className="block w-full py-3 px-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}

                    <div className={`mt-6 pt-6 border-t space-y-3 ${
                      isDarkMode ? 'border-slate-700' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center">
                        <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          Full lifetime access
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          Access on mobile and desktop
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          Certificate of completion
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className={`rounded-xl shadow-lg p-6 ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  About this course
                </h2>
                <p className={`whitespace-pre-wrap ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {course.description}
                </p>
              </div>

              {/* Learning Outcomes */}
              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div className={`rounded-xl shadow-lg p-6 ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
                }`}>
                  <h2 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                          isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          {outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Content */}
              <div className={`rounded-xl shadow-lg p-6 ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Course Content
                </h2>
                <div className="space-y-2">
                  {course.sections && course.sections.map((section, index) => (
                    <div 
                      key={section._id}
                      className={`border rounded-lg ${
                        isDarkMode ? 'border-slate-700' : 'border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleSection(index)}
                        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
                          isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <h3 className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {section.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-600'
                          }`}>
                            {section.lectures.length} lectures
                          </p>
                        </div>
                        {expandedSections[index] ? (
                          <ChevronUpIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-400'
                          }`} />
                        ) : (
                          <ChevronDownIcon className={`h-5 w-5 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-400'
                          }`} />
                        )}
                      </button>
                      
                      {expandedSections[index] && (
                        <div className={`border-t px-4 py-2 ${
                          isDarkMode ? 'border-slate-700 bg-slate-700/20' : 'border-gray-200 bg-gray-50'
                        }`}>
                          {section.lectures.map((lecture) => (
                            <div 
                              key={lecture._id}
                              className={`py-3 flex items-center justify-between ${
                                isDarkMode ? 'border-slate-600' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <PlayIcon className={`h-4 w-4 mr-3 ${
                                  isDarkMode ? 'text-slate-400' : 'text-gray-400'
                                }`} />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                                  {lecture.title}
                                </span>
                              </div>
                              {lecture.duration > 0 && (
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                                }`}>
                                  {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className={`rounded-xl shadow-lg p-6 ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
                }`}>
                  <h2 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li 
                        key={index}
                        className={`flex items-start ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl shadow-lg p-6 sticky top-4 ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Course Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <GlobeAltIcon className={`h-5 w-5 mr-3 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                      Language: {course.language}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className={`h-5 w-5 mr-3 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                      Level: {course.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className={`h-5 w-5 mr-3 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                      {course.totalLectures} Lectures
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className={`h-5 w-5 mr-3 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                      {formatDuration(course.totalDuration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
