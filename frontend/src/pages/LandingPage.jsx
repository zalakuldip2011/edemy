import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
import InterestsBanner from '../components/common/InterestsBanner';
import InterestsModal from '../components/common/InterestsModal';
import PersonalizedCoursesSection from '../components/layout/PersonalizedCoursesSection';

const LandingPage = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  
  // Check if user needs to complete interests
  const needsInterests = isAuthenticated && user && !user.interests?.hasCompletedInterests;

  const handleSetupInterests = () => {
    setShowInterestsModal(true);
  };

  const handleInterestsComplete = () => {
    setShowInterestsModal(false);
  };
  
  return (
    <motion.div 
      className="theme-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      {/* Interests Banner - Shows only if authenticated and interests not completed */}
      {needsInterests && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <InterestsBanner 
            onSetupClick={handleSetupInterests}
            username={user?.username || user?.email?.split('@')[0]}
          />
        </div>
      )}
      
      <HeroSection />
      <PersonalizedCoursesSection />
      <FeaturesSection />
      <StatsSection />
      <CategorySection />
      <CourseCarousel />
      <TestimonialsSection />
      <FAQSection />
      <TrustBadgesSection />
      <Footer />

      {/* Interests Modal */}
      <InterestsModal
        isOpen={showInterestsModal}
        onClose={() => setShowInterestsModal(false)}
        onComplete={handleInterestsComplete}
      />
    </motion.div>
  );
};

export default LandingPage;