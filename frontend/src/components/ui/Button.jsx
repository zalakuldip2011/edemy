import React from 'react';
import { designSystem } from '../../styles/designSystem';

/**
 * Beautiful Material UI-inspired Button Component
 * Supports multiple variants, sizes, loading states, and icons
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 ease-out cursor-pointer border-none outline-none relative overflow-hidden';

  // Size classes
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Variant classes with beautiful gradients and effects
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
    success: 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-transparent border-2 border-current hover:bg-current hover:text-white transition-all',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
    gradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 animate-gradient bg-[length:200%_200%]',
    text: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-current'
  };

  // Disabled styles
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none';

  // Full width
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || loading ? disabledClasses : ''}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Ripple effect on click
  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple element
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);

    // Call onClick handler
    if (onClick) {
      onClick(e);
    }

    // Remove ripple after animation
    setTimeout(() => circle.remove(), 600);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Shimmer effect for gradient buttons */}
      {variant === 'gradient' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500" />
      )}

      {/* Loading spinner */}
      {loading && <LoadingSpinner />}

      {/* Icon on left */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}

      {/* Button text */}
      <span className="relative z-10">{children}</span>

      {/* Icon on right */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};

// Icon Button - circular button with just icon
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-current',
    outline: 'bg-transparent border-2 border-current hover:bg-current hover:text-white'
  };

  const buttonClasses = `
    inline-flex items-center justify-center rounded-full transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon}
    </button>
  );
};

// Button Group - for grouping related buttons
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!child) return null;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${!isFirst ? '-ml-px' : ''}
            ${!isFirst && !isLast ? 'rounded-none' : ''}
            ${isFirst ? 'rounded-r-none' : ''}
            ${isLast ? 'rounded-l-none' : ''}
          `.trim().replace(/\s+/g, ' ')
        });
      })}
    </div>
  );
};

export default Button;

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
