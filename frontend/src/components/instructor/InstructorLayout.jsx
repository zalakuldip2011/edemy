import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';

const InstructorLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;