import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching courses from /api/courses...');
        
        // Fetch featured courses grouped by category
        const response = await fetch('/api/courses?limit=100');
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success && data.data.courses) {
          console.log('Total courses fetched:', data.data.courses.length);
          
          // Group courses by category
          const groupedCourses = data.data.courses.reduce((acc, course) => {
            if (!acc[course.category]) {
              acc[course.category] = [];
            }
            if (acc[course.category].length < 4) {
              acc[course.category].push(course);
            }
            return acc;
          }, {});

          console.log('Grouped courses:', groupedCourses);

          // Convert to array format
          const categoriesArray = Object.keys(groupedCourses).map(category => ({
            name: category,
            courses: groupedCourses[category]
          }));

          console.log('Categories array:', categoriesArray);
          setCategories(categoriesArray);
        } else {
          console.log('No courses found or API error');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const CourseCard = ({ course }) => (
    <Link 
      to={`/courses/${course._id}`}
      className="theme-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group block"
    >
      <div className="relative">
        <img
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-black">
            Featured
          </span>
        )}
        {course.discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
            {course.discount}% OFF
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold theme-text-primary mb-2 line-clamp-2 group-hover:theme-text-accent transition-colors">
          {course.title}
        </h3>
        <p className="theme-text-secondary text-sm mb-3">
          {course.instructor?.name || 'Instructor'}
        </p>
        
        <div className="flex items-center mb-3">
          <span className="text-yellow-400 font-semibold mr-1">
            {course.averageRating ? course.averageRating.toFixed(1) : '0.0'}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(course.averageRating || 0) ? 'text-yellow-400' : 'theme-text-tertiary opacity-30'
                }`}
              />
            ))}
          </div>
          <span className="theme-text-tertiary text-sm ml-2">
            ({course.totalEnrollments || 0})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold theme-text-primary">
              {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm theme-text-tertiary line-through">
                ${course.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="theme-button-primary px-4 py-2 text-white text-sm font-medium rounded-lg">
            View Course
          </span>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <section className="py-20 theme-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center theme-text-primary">Loading courses...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 theme-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold theme-text-primary mb-4">No Courses Available Yet</h2>
            <p className="theme-text-secondary mb-6">
              Be the first to create a course and share your knowledge!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 theme-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold theme-text-primary">{category.name}</h2>
              <Link 
                to={`/courses?category=${encodeURIComponent(category.name)}`}
                className="theme-text-accent hover:opacity-80 font-medium transition-opacity"
              >
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        ))}
        
        {/* Explore All Categories Button */}
        <div className="text-center mt-12">
          <Link 
            to="/courses"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore All Courses
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;