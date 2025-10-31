import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '../../components/instructor/InstructorLayout';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Simulated API call - replace with actual endpoint
      setTimeout(() => {
        setCourses([
          {
            id: 1,
            title: "Complete Web Development Bootcamp",
            subtitle: "Learn HTML, CSS, JavaScript, React, Node.js and more",
            status: "Published",
            category: "Web Development",
            totalLectures: 45,
            totalDuration: "12h 30m",
            enrollments: 89,
            rating: 4.8,
            totalReviews: 23,
            revenue: 1250,
            lastUpdated: "2025-10-20",
            thumbnail: "/api/placeholder/160/90"
          },
          {
            id: 2,
            title: "React.js for Beginners",
            subtitle: "Master the fundamentals of React.js",
            status: "Draft",
            category: "Programming",
            totalLectures: 0,
            totalDuration: "0h 0m",
            enrollments: 0,
            rating: 0,
            totalReviews: 0,
            revenue: 0,
            lastUpdated: "2025-10-22",
            thumbnail: "/api/placeholder/160/90"
          },
          {
            id: 3,
            title: "JavaScript Fundamentals",
            subtitle: "Learn JavaScript from scratch",
            status: "Published",
            category: "Programming",
            totalLectures: 32,
            totalDuration: "8h 45m",
            enrollments: 156,
            rating: 4.6,
            totalReviews: 45,
            revenue: 2200,
            lastUpdated: "2025-10-18",
            thumbnail: "/api/placeholder/160/90"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'oldest':
        return new Date(a.lastUpdated) - new Date(b.lastUpdated);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'enrollments':
        return b.enrollments - a.enrollments;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-1">Manage your course content and settings</p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Course
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="enrollments">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table/Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {sortedCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpenIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first course'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  to="/instructor/courses/create"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create your first course
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-16 h-10 object-cover rounded bg-gray-200 mr-4"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{course.subtitle}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-400">
                                {course.totalLectures} lectures
                              </span>
                              <span className="text-xs text-gray-400">
                                {course.totalDuration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(course.status)}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.enrollments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.rating > 0 ? (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{course.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({course.totalReviews})
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No ratings</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${course.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <ChartBarIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default Courses;