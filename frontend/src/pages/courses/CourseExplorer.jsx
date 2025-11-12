import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  ChevronDownIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const CourseExplorer = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchInput, setSearchInput] = useState(''); // For immediate UI update
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    tags: [],
    sortBy: 'popularity'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0
  });

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => {
        // ✅ SAFE: Validate prev before spreading
        const safePrev = prev && typeof prev === 'object' ? prev : {};
        return { ...safePrev, search: searchInput };
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch courses with filters
  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => 
            value !== '' && (Array.isArray(value) ? value.length > 0 : true)
          )
        ),
        ...(filters.tags.length > 0 && { tags: filters.tags.join(',') })
      });

      const response = await fetch(`/api/courses?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        const allCourses = data.data.courses;
        
        // Limit courses for non-authenticated users (show 6 courses)
        if (!isAuthenticated) {
          const limitedCourses = allCourses.slice(0, 6);
          setCourses(limitedCourses);
          
          // Show login prompt if there are more than 6 courses available
          if (allCourses.length > 6) {
            setShowLoginPrompt(true);
          }
        } else {
          setCourses(allCourses);
          setShowLoginPrompt(false);
        }
        
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and popular tags
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/courses/categories'),
          fetch('/api/courses/tags/popular')
        ]);

        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        if (categoriesData.success) setCategories(categoriesData.data);
        if (tagsData.success) setPopularTags(tagsData.data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => {
      // ✅ SAFE: Validate prev and tags before spreading
      const safePrev = prev && typeof prev === 'object' ? prev : { tags: [] };
      const safeTags = Array.isArray(safePrev.tags) ? safePrev.tags : [];
      
      return {
        ...safePrev,
        tags: safeTags.includes(tag)
          ? safeTags.filter(t => t !== tag)
          : [...safeTags, tag]
      };
    });
  };

  const clearFilters = () => {
    setSearchInput(''); // Clear search input immediately
    setFilters({
      search: '',
      category: '',
      level: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      tags: [],
      sortBy: 'popularity'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < Math.floor(rating) ? (
              <StarSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-slate-500" />
            )}
          </span>
        ))}
        <span className="ml-2 text-sm text-slate-400">({rating})</span>
      </div>
    );
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Main Content */}
      <div className="pt-8">
        {/* Header Section */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-8">Explore Courses</h1>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for courses, instructors..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800/70 transition-all duration-200 shadow-lg focus:shadow-xl text-lg"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-6 py-4 bg-purple-600/90 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <FunnelIcon className="h-6 w-6" />
                Filters
                {Object.values(filters).some(value => 
                  Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'popularity'
                ) && (
                  <span className="bg-purple-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 shadow-lg"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-8 p-8 bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    >
                      <option value="" className="bg-slate-800">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.category} value={cat.category} className="bg-slate-800">
                          {cat.category} ({cat.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Level
                    </label>
                    <select
                      value={filters.level}
                      onChange={(e) => handleFilterChange('level', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    >
                      <option value="" className="bg-slate-800">All Levels</option>
                      {levels.map(level => (
                        <option key={level} value={level} className="bg-slate-800">
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    >
                      <option value="" className="bg-slate-800">Any Rating</option>
                      <option value="4.5" className="bg-slate-800">4.5+ Stars</option>
                      <option value="4.0" className="bg-slate-800">4.0+ Stars</option>
                      <option value="3.5" className="bg-slate-800">3.5+ Stars</option>
                      <option value="3.0" className="bg-slate-800">3.0+ Stars</option>
                    </select>
                  </div>
                </div>

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <div className="mt-8">
                    <label className="block text-sm font-medium text-slate-300 mb-4">
                      Popular Tags
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {popularTags.map(tag => (
                        <button
                          key={tag.tag}
                          onClick={() => handleTagToggle(tag.tag)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            filters.tags.includes(tag.tag)
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                          }`}
                        >
                          {tag.tag} ({tag.count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <p className="text-slate-300 text-lg">
                {!isAuthenticated && showLoginPrompt 
                  ? `Showing 6 of ${pagination.totalCourses} courses` 
                  : `${pagination.totalCourses} courses found`
                }
              </p>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Active Filters */}
            {filters.tags.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Active tags:</span>
                {filters.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:text-purple-100 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <SkeletonLoader count={12} />
          ) : (
            <>
              {/* Course Cards */}
              <div className={`mb-8 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }`}>
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/courses/${course._id}`}
                      className={`block bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-slate-700/50 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300 group ${
                        viewMode === 'grid'
                          ? 'transform hover:scale-105'
                          : 'flex gap-6 hover:bg-slate-800/70'
                      }`}
                    >
                    {/* Course Image */}
                    <div className={`bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center relative overflow-hidden ${
                      viewMode === 'grid'
                        ? 'w-full h-48 rounded-t-xl'
                        : 'w-64 h-40 rounded-l-xl flex-shrink-0'
                    }`}>
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-900/20"></div>
                          <span className="text-white text-2xl font-bold z-10">
                            {course.title?.charAt(0) || 'C'}
                          </span>
                        </>
                      )}
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      {/* Category Badge */}
                      {course.category && (
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-purple-300 bg-purple-600/20 rounded-full border border-purple-500/30">
                          {course.category}
                        </span>
                      )}

                      {/* Course Title */}
                      <h3 className={`font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors ${
                        viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl line-clamp-1'
                      }`}>
                        {course.title}
                      </h3>

                      {/* Description (List View Only) */}
                      {viewMode === 'list' && course.description && (
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      {/* Instructor */}
                      <p className="text-slate-400 text-sm mb-3">
                        {course.instructor?.name || 'Unknown Instructor'}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        {renderStars(course.averageRating || 0)}
                        {course.enrollmentCount > 0 && (
                          <span className="ml-2 text-sm text-slate-400">
                            ({course.enrollmentCount} students)
                          </span>
                        )}
                      </div>

                      {/* Course Meta */}
                      <div className={`flex items-center gap-4 text-sm text-slate-400 mb-4 ${
                        viewMode === 'list' ? 'mb-0' : ''
                      }`}>
                        {course.totalDuration && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{Math.floor(course.totalDuration / 3600)}h</span>
                          </div>
                        )}
                        {course.totalLectures && (
                          <div className="flex items-center gap-1">
                            <UsersIcon className="h-4 w-4" />
                            <span>{course.totalLectures} lectures</span>
                          </div>
                        )}
                        {course.level && (
                          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">
                            {course.level}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className={`flex items-center justify-between ${
                        viewMode === 'grid' ? 'pt-4 border-t border-slate-700/50' : ''
                      }`}>
                        <span className="text-2xl font-bold text-white">
                          {formatPrice(course.price)}
                        </span>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                          Enroll
                        </button>
                      </div>
                    </div>
                  </Link>
                  </motion.div>
                ))}
              </div>

              {/* Login Prompt for Non-Authenticated Users */}
              {showLoginPrompt && !isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg border-2 border-purple-500/50 rounded-2xl p-8 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-purple-600/30 mb-6 border-4 border-purple-500/50">
                      <LockClosedIcon className="h-10 w-10 text-purple-300" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Want to See More Courses?
                    </h3>
                    
                    <p className="text-slate-300 text-lg mb-2 max-w-2xl mx-auto">
                      You're viewing a limited selection. Create an account or login to explore our full catalog of courses!
                    </p>
                    
                    <p className="text-purple-300 text-base mb-8 max-w-xl mx-auto font-medium">
                      🎓 Access thousands of courses • 📚 Track your progress • ⭐ Get personalized recommendations
                    </p>
                    
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        Create Free Account
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-slate-700/50 border-2 border-slate-600/50 text-white rounded-xl font-bold text-lg hover:bg-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
                      >
                        Login
                      </button>
                    </div>
                    
                    <p className="text-slate-400 text-sm mt-6">
                      Join over 10,000+ students learning on Edemy
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Pagination */}
              {isAuthenticated && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => fetchCourses(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-6 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-all duration-200"
                  >
                    Previous
                  </button>
                  
                  <span className="px-6 py-3 text-slate-300 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => fetchCourses(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-6 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Results */}
              {courses.length === 0 && !loading && (
                <div className="text-center py-16">
                  <MagnifyingGlassIcon className="h-20 w-20 text-slate-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    No courses found
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Try adjusting your search criteria or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseExplorer;