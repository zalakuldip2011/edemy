import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import FeaturesSection from '../components/layout/FeaturesSection';
import StatsSection from '../components/layout/StatsSection';
import CategorySection from '../components/layout/CategorySection';
import CourseCarousel from '../components/layout/CourseCarousel';
import TestimonialsSection from '../components/layout/TestimonialsSection';
import FAQSection from '../components/layout/FAQSection';
import TrustBadgesSection from '../components/layout/TrustBadgesSection';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div 
      className="theme-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CategorySection />
      <CourseCarousel />
      <TestimonialsSection />
      <FAQSection />
      <TrustBadgesSection />
      <Footer />
    </motion.div>
  );
};

export default LandingPage;