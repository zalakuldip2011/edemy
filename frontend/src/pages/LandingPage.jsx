import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import CategorySection from '../components/layout/CategorySection';
import TestimonialsSection from '../components/layout/TestimonialsSection';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="theme-page">
      <Header />
      <HeroSection />
      <CategorySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;