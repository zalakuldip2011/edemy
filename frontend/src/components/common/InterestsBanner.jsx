import React from 'react';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const InterestsBanner = ({ onSetupClick, username }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl mb-8 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 border border-blue-500/20' 
        : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-30 ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl opacity-30 ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-400'
        }`} />
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <SparklesIcon className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Welcome, {username}!
              </span>
            </div>
            
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to continue your learning journey?
            </h2>
            
            <p className={`text-base md:text-lg mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Help us personalize your experience by selecting your interests and learning goals.
            </p>

            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                isDarkMode ? 'bg-white/10' : 'bg-white/60'
              }`}>
                <span className="text-lg">🎯</span>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Personalized recommendations
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                isDarkMode ? 'bg-white/10' : 'bg-white/60'
              }`}>
                <span className="text-lg">📚</span>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Curated courses
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                isDarkMode ? 'bg-white/10' : 'bg-white/60'
              }`}>
                <span className="text-lg">⚡</span>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Faster learning path
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onSetupClick}
              className="group relative px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Set Up My Interests</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className={`text-xs text-center mt-2 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Only takes 2 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsBanner;
