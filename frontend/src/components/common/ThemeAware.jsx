import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themeClasses, themeTransitions } from '../../styles/theme';

/**
 * ThemeAware Component - A wrapper component that automatically applies theme-aware styling
 * Use this for quick theme integration without manual class management
 */
const ThemeAware = ({ 
  children, 
  variant = 'container',
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'container':
        return themeClasses.pageContainer(isDarkMode);
      case 'card':
        return themeClasses.card(isDarkMode);
      case 'modal':
        return themeClasses.modal(isDarkMode);
      case 'button-primary':
        return themeClasses.primaryButton(isDarkMode);
      case 'button-secondary':
        return themeClasses.secondaryButton(isDarkMode);
      case 'input':
        return themeClasses.input(isDarkMode);
      case 'nav-link':
        return themeClasses.navLink(isDarkMode);
      case 'heading':
        return themeClasses.heading(isDarkMode);
      case 'subheading':
        return themeClasses.subheading(isDarkMode);
      case 'body':
        return themeClasses.bodyText(isDarkMode);
      default:
        return '';
    }
  };

  const combinedClassName = `${getVariantClasses()} ${themeTransitions} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

/**
 * Quick theme-aware components for common use cases
 */

// Page container
export const ThemePage = ({ children, className = '', ...props }) => (
  <ThemeAware variant="container" className={className} {...props}>
    {children}
  </ThemeAware>
);

// Card container
export const ThemeCard = ({ children, className = '', ...props }) => (
  <ThemeAware variant="card" className={`p-6 ${className}`} {...props}>
    {children}
  </ThemeAware>
);

// Buttons
export const ThemeButton = ({ children, variant = 'primary', className = '', ...props }) => (
  <ThemeAware 
    as="button" 
    variant={`button-${variant}`} 
    className={`px-4 py-2 rounded-lg font-medium ${className}`} 
    {...props}
  >
    {children}
  </ThemeAware>
);

// Input
export const ThemeInput = ({ className = '', ...props }) => (
  <ThemeAware 
    as="input" 
    variant="input" 
    className={`w-full p-3 rounded-lg border ${className}`} 
    {...props}
  />
);

// Typography
export const ThemeHeading = ({ children, level = 1, className = '', ...props }) => {
  const Component = `h${level}`;
  return (
    <ThemeAware 
      as={Component} 
      variant="heading" 
      className={`font-bold ${className}`} 
      {...props}
    >
      {children}
    </ThemeAware>
  );
};

export const ThemeText = ({ children, variant = 'body', className = '', ...props }) => (
  <ThemeAware 
    as="p" 
    variant={variant} 
    className={className} 
    {...props}
  >
    {children}
  </ThemeAware>
);

// Navigation link
export const ThemeNavLink = ({ children, className = '', ...props }) => (
  <ThemeAware 
    as="a" 
    variant="nav-link" 
    className={`px-3 py-2 rounded-lg ${className}`} 
    {...props}
  >
    {children}
  </ThemeAware>
);

export default ThemeAware;