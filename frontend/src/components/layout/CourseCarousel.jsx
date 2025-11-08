import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon
} from '@heroicons/react/24/solid';

const CourseCarousel = () => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Smith',
      rating: 4.8,
      reviews: 12450,
      students: 45200,
      duration: '42 hours',
      lectures: 320,
      price: 89.99,
      originalPrice: 149.99,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Web Development',
      level: 'Beginner',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'Python for Data Science and Machine Learning',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      reviews: 8920,
      students: 32100,
      duration: '38 hours',
      lectures: 285,
      price: 94.99,
      originalPrice: 159.99,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Data Science',
      level: 'Intermediate',
      badge: 'Hot'
    },
    {
      id: 3,
      title: 'React - The Complete Guide 2024',
      instructor: 'Mike Davis',
      rating: 4.7,
      reviews: 15630,
      students: 58900,
      duration: '48 hours',
      lectures: 410,
      price: 79.99,
      originalPrice: 139.99,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Frontend',
      level: 'All Levels',
      badge: 'Bestseller'
    },
    {
      id: 4,
      title: 'Digital Marketing Masterclass',
      instructor: 'Emma Wilson',
      rating: 4.6,
      reviews: 7240,
      students: 28300,
      duration: '32 hours',
      lectures: 245,
      price: 84.99,
      originalPrice: 144.99,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Marketing',
      level: 'Beginner',
      badge: 'New'
    },
    {
      id: 5,
      title: 'AWS Certified Solutions Architect',
      instructor: 'David Brown',
      rating: 4.8,
      reviews: 9870,
      students: 35600,
      duration: '45 hours',
      lectures: 340,
      price: 99.99,
      originalPrice: 169.99,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Cloud Computing',
      level: 'Advanced',
      badge: 'Hot'
    },
    {
      id: 6,
      title: 'UI/UX Design Complete Course',
      instructor: 'Lisa Anderson',
      rating: 4.9,
      reviews: 6540,
      students: 24800,
      duration: '28 hours',
      lectures: 195,
      price: 74.99,
      originalPrice: 129.99,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Design',
      level: 'Beginner',
      badge: 'Bestseller'
    }
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, courses.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-yellow-500';
      case 'Hot':
        return 'bg-red-500';
      case 'New':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Featured Courses
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Explore our most popular courses
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-110'
              } ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ChevronLeftIcon className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentIndex === maxIndex
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-110'
              } ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ChevronRightIcon className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                className="w-full md:w-1/3 flex-shrink-0 px-3"
              >
                <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-800 shadow-lg shadow-gray-900/50'
                    : 'bg-white shadow-lg hover:shadow-2xl'
                }`}>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge */}
                    <div className={`absolute top-3 left-3 ${getBadgeColor(course.badge)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {course.badge}
                    </div>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <PlayIcon className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category */}
                    <div className={`text-xs font-semibold mb-2 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {course.category}
                    </div>

                    {/* Title */}
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {course.instructor}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-500 font-bold mr-1">{course.rating}</span>
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(course.rating)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({course.reviews.toLocaleString()})
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className={`flex items-center space-x-4 text-xs mb-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {(course.students / 1000).toFixed(1)}K
                      </div>
                      <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                        {course.level}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <span className={`text-2xl font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${course.price}
                        </span>
                        <span className={`text-sm line-through ml-2 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          ${course.originalPrice}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-8 md:hidden space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-600 w-8'
                  : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCarousel;
