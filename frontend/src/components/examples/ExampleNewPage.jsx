/**
 * Example component showing how to use the theme system
 * Copy this pattern for any new components you create
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themeClasses, themeTransitions } from '../../styles/theme';

// You can also use the ThemeAware components for even easier development
import { 
  ThemePage, 
  ThemeCard, 
  ThemeButton, 
  ThemeInput, 
  ThemeHeading, 
  ThemeText 
} from '../common/ThemeAware';

const ExampleNewPage = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Method 1: Using pre-built theme classes
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <ThemePage className="p-6">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto">
        <ThemeHeading level={1} className="text-3xl mb-2">
          New Feature Page
        </ThemeHeading>
        <ThemeText variant="subheading" className="mb-8">
          This page automatically supports both light and dark themes
        </ThemeText>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Example */}
          <ThemeCard>
            <ThemeHeading level={2} className="text-xl mb-4">
              Easy Method (Using ThemeAware Components)
            </ThemeHeading>
            <ThemeText className="mb-4">
              Use pre-built ThemeAware components for instant theme support.
            </ThemeText>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <ThemeInput
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <ThemeInput
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <div className="flex space-x-3">
                <ThemeButton type="submit">
                  Submit
                </ThemeButton>
                <ThemeButton variant="secondary" type="button">
                  Cancel
                </ThemeButton>
              </div>
            </form>
          </ThemeCard>

          {/* Manual Theme Classes Example */}
          <div className={`${themeClasses.card(isDarkMode)} p-6 ${themeTransitions}`}>
            <h2 className={`${themeClasses.heading(isDarkMode)} text-xl mb-4`}>
              Manual Method (Custom Classes)
            </h2>
            <p className={`${themeClasses.bodyText(isDarkMode)} mb-4`}>
              Use manual theme classes for more control over styling.
            </p>
            
            {/* Feature list with theme-aware styling */}
            <div className="space-y-3">
              {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, index) => (
                <div 
                  key={index}
                  className={`
                    p-3 rounded-lg border ${themeTransitions}
                    ${isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className={themeClasses.subheading(isDarkMode)}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex space-x-3">
              <button className={`
                ${themeClasses.primaryButton(isDarkMode)} 
                px-4 py-2 rounded-lg font-medium ${themeTransitions}
              `}>
                Primary Action
              </button>
              <button className={`
                ${themeClasses.secondaryButton(isDarkMode)} 
                px-4 py-2 rounded-lg font-medium ${themeTransitions}
              `}>
                Secondary Action
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Example */}
        <ThemeCard className="mt-8">
          <ThemeHeading level={2} className="text-xl mb-4">
            Data Table Example
          </ThemeHeading>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <th className={`${themeClasses.subheading(isDarkMode)} text-left p-3`}>
                    Name
                  </th>
                  <th className={`${themeClasses.subheading(isDarkMode)} text-left p-3`}>
                    Email
                  </th>
                  <th className={`${themeClasses.subheading(isDarkMode)} text-left p-3`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@example.com', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
                  { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
                ].map((user, index) => (
                  <tr 
                    key={index}
                    className={`
                      border-b ${themeTransitions}
                      ${isDarkMode 
                        ? 'border-slate-700 hover:bg-slate-800/30' 
                        : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <td className={`${themeClasses.bodyText(isDarkMode)} p-3`}>
                      {user.name}
                    </td>
                    <td className={`${themeClasses.bodyText(isDarkMode)} p-3`}>
                      {user.email}
                    </td>
                    <td className="p-3">
                      <span className={`
                        px-2 py-1 text-xs rounded-full
                        ${user.status === 'Active' 
                          ? (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800')
                          : (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800')
                        }
                      `}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ThemeCard>

        {/* Alert/Notification Example */}
        <div className={`
          mt-8 p-4 rounded-lg border-l-4 ${themeTransitions}
          ${isDarkMode 
            ? 'bg-blue-500/10 border-blue-400 text-blue-300' 
            : 'bg-blue-50 border-blue-500 text-blue-700'
          }
        `}>
          <h3 className={`font-semibold mb-1 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>
            Theme Integration Complete!
          </h3>
          <p className={isDarkMode ? 'text-blue-400' : 'text-blue-700'}>
            This component automatically adapts to your theme preference. 
            All new components you create can follow this same pattern.
          </p>
        </div>
      </div>
    </ThemePage>
  );
};

export default ExampleNewPage;