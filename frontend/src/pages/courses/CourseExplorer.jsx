import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const CourseExplorer = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
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
        setCourses(data.data.courses);
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
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
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
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
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
            <p className="text-slate-300 text-lg">
              {pagination.totalCourses} courses found
            </p>
            
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700/50 animate-pulse">
                  <div className="w-full h-48 bg-slate-700/50 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Course Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {courses.map(course => (
                  <div key={course._id} className="bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-slate-700/50 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300 transform hover:scale-105 group">
                    {/* Course Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-purple-800 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-900/20"></div>
                      <span className="text-white text-2xl font-bold z-10">
                        {course.title.charAt(0)}
                      </span>
                    </div>

                    <div className="p-6">
                      {/* Course Title */}
                      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {course.title}
                      </h3>

                      {/* Instructor */}
                      <p className="text-slate-400 text-sm mb-3">
                        by {course.instructor?.name || 'Anonymous'}
                      </p>

                      {/* Rating */}
                      <div className="mb-4">
                        {renderStars(course.averageRating || 0)}
                      </div>

                      {/* Course Info */}
                      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                        <span className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          {course.totalDuration || '0h'}
                        </span>
                        <span className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4" />
                          {course.totalEnrollments || 0}
                        </span>
                      </div>

                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs border border-slate-600/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {course.tags.length > 3 && (
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs border border-slate-600/50">
                              +{course.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-400">
                          {formatPrice(course.price)}
                        </span>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm font-medium">
                          View Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
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