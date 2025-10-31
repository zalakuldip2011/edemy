// Theme configuration and utility functions for consistent theming across the entire application

export const themeConfig = {
  // Light Mode Colors (Default)
  light: {
    // Backgrounds
    bg: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      card: 'bg-white',
      overlay: 'bg-white/95',
      gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600'
    },
    
    // Text Colors
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-600',
      muted: 'text-gray-500',
      white: 'text-white',
      accent: 'text-blue-600'
    },
    
    // Borders
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
      light: 'border-gray-100',
      accent: 'border-blue-500'
    },
    
    // Interactive States
    hover: {
      bg: 'hover:bg-gray-100',
      text: 'hover:text-gray-900',
      border: 'hover:border-gray-300'
    },
    
    // Focus States
    focus: {
      ring: 'focus:ring-blue-500',
      border: 'focus:border-blue-500'
    },
    
    // Buttons
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }
  },
  
  // Dark Mode Colors
  dark: {
    // Backgrounds
    bg: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      tertiary: 'bg-slate-700',
      card: 'bg-slate-800/50',
      overlay: 'bg-slate-900/95',
      gradient: 'bg-gradient-to-r from-red-500 to-orange-500'
    },
    
    // Text Colors
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
      tertiary: 'text-slate-400',
      muted: 'text-slate-500',
      white: 'text-white',
      accent: 'text-red-400'
    },
    
    // Borders
    border: {
      primary: 'border-slate-700',
      secondary: 'border-slate-600',
      light: 'border-slate-800',
      accent: 'border-red-500'
    },
    
    // Interactive States
    hover: {
      bg: 'hover:bg-slate-800/50',
      text: 'hover:text-white',
      border: 'hover:border-slate-600'
    },
    
    // Focus States
    focus: {
      ring: 'focus:ring-red-500',
      border: 'focus:border-red-500'
    },
    
    // Buttons
    button: {
      primary: 'bg-red-600 hover:bg-red-700 text-white',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-300',
      ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
    }
  }
};

// Utility function to get theme-aware classes
export const getThemeClasses = (isDarkMode, lightClass, darkClass) => {
  return isDarkMode ? darkClass : lightClass;
};

// Pre-built theme-aware class combinations for common UI patterns
export const themeClasses = {
  // Page containers
  pageContainer: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'min-h-screen bg-white text-gray-900',
    'min-h-screen bg-slate-900 text-white'
  ),
  
  // Cards
  card: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-white border border-gray-200 rounded-lg shadow-sm',
    'bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm'
  ),
  
  // Form inputs
  input: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
    'bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:ring-red-500 focus:border-red-500'
  ),
  
  // Buttons
  primaryButton: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-blue-600 hover:bg-blue-700 text-white',
    'bg-red-600 hover:bg-red-700 text-white'
  ),
  
  secondaryButton: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-gray-200 hover:bg-gray-300 text-gray-900',
    'bg-slate-700 hover:bg-slate-600 text-slate-300'
  ),
  
  // Navigation
  navLink: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
    'text-slate-300 hover:text-white hover:bg-slate-800/50'
  ),
  
  // Text elements
  heading: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'text-gray-900',
    'text-white'
  ),
  
  subheading: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'text-gray-700',
    'text-slate-300'
  ),
  
  bodyText: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'text-gray-600',
    'text-slate-400'
  ),
  
  // Modals and overlays
  modal: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-white border border-gray-200 shadow-xl',
    'bg-slate-800 border border-slate-700 shadow-xl'
  ),
  
  overlay: (isDarkMode) => getThemeClasses(
    isDarkMode,
    'bg-black/50',
    'bg-black/70'
  )
};

// Theme transition classes for smooth animations
export const themeTransitions = 'transition-colors duration-300';

export default themeConfig;