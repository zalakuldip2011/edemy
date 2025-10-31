#!/usr/bin/env node
// Theme Update Script - Automatically updates all components with global theme classes
const fs = require('fs');
const path = require('path');

const componentsToUpdate = [
  // Layout Components
  'src/components/layout/HeroSection.jsx',
  'src/components/layout/CategorySection.jsx', 
  'src/components/layout/TestimonialsSection.jsx',
  
  // Auth Pages
  'src/pages/auth/Signup.jsx',
  'src/pages/auth/EmailVerification.jsx',
  'src/pages/auth/ForgotPassword.jsx',
  'src/pages/auth/VerifyResetOTP.jsx',
  'src/pages/auth/ResetPassword.jsx',
  
  // Dashboard Pages
  'src/pages/dashboard/Dashboard.jsx',
  'src/pages/educator/BecomeEducator.jsx',
  
  // Course Pages
  'src/pages/courses/CourseExplorer.jsx',
  'src/pages/instructor/CourseCreate.jsx',
  'src/pages/instructor/Courses.jsx',
  
  // Other Components
  'src/components/common/LoadingSpinner.jsx',
  'src/components/instructor/Stepper.jsx'
];

const themeReplacements = {
  // Background classes
  'bg-white': 'theme-bg-primary',
  'bg-gray-50': 'theme-bg-secondary', 
  'bg-gray-100': 'theme-bg-tertiary',
  'bg-slate-900': 'theme-bg-primary',
  'bg-slate-800': 'theme-bg-card',
  'bg-slate-700': 'theme-bg-secondary',
  
  // Text classes
  'text-gray-900': 'theme-text-primary',
  'text-gray-800': 'theme-text-primary',
  'text-gray-700': 'theme-text-secondary',
  'text-gray-600': 'theme-text-secondary',
  'text-gray-500': 'theme-text-tertiary',
  'text-gray-400': 'theme-text-tertiary',
  'text-white': 'theme-text-primary',
  'text-blue-600': 'theme-text-accent',
  'text-blue-500': 'theme-text-accent',
  'text-red-400': 'theme-text-accent',
  
  // Border classes
  'border-gray-300': 'theme-border-primary',
  'border-gray-200': 'theme-border-primary',
  'border-slate-700': 'theme-border-primary',
  'border-slate-600': 'theme-border-primary',
};

function updateComponent(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Add theme import if not present
  if (!content.includes("import { useTheme }") && content.includes("import React")) {
    content = content.replace(
      /import React[^;]*;/,
      "$&\nimport { useTheme } from '../../context/ThemeContext';"
    );
    modified = true;
  }
  
  // Replace static classes with theme classes
  Object.entries(themeReplacements).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, newClass);
      modified = true;
    }
  });
  
  // Replace conditional theme logic with simple theme classes
  const conditionalPatterns = [
    /className=\{`[^}]*\$\{\s*isDarkMode\s*\?[^}]*\}\s*`\}/g,
    /className=\{[^}]*isDarkMode[^}]*\}/g
  ];
  
  conditionalPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Extract base classes and convert to theme classes
        const simplified = match.replace(/\$\{[^}]*\}/g, '').replace(/className=\{`|`\}|className=\{|\}/g, '');
        const themeAware = simplified.split(' ')
          .map(cls => cls.trim())
          .filter(cls => cls && !cls.includes('transition'))
          .map(cls => themeReplacements[cls] || cls)
          .join(' ');
        
        content = content.replace(match, `className="${themeAware} theme-transition"`);
        modified = true;
      });
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

console.log('🎨 Starting theme update process...\n');

let updatedCount = 0;
componentsToUpdate.forEach(component => {
  if (updateComponent(component)) {
    updatedCount++;
  }
});

console.log(`\n🎉 Theme update complete! Updated ${updatedCount} components.`);
console.log('💡 Remember to test theme switching functionality across all pages.');