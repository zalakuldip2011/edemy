import React, { forwardRef } from 'react';

/**
 * Beautiful Material UI-inspired Input Component
 * Supports multiple variants, sizes, validation states, and icons
 */
const Input = forwardRef(({
  label,
  type = 'text',
  variant = 'outlined',
  size = 'md',
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
    filled: 'bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600',
    standard: 'bg-transparent border-b-2 border-gray-300 dark:border-gray-600'
  };

  // State classes
  const getStateClasses = () => {
    if (error) {
      return 'border-red-500 focus:border-red-600 focus:ring-red-500/20';
    }
    if (success) {
      return 'border-green-500 focus:border-green-600 focus:ring-green-500/20';
    }
    return 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20';
  };

  // Base input classes
  const baseClasses = 'w-full rounded-lg transition-all duration-300 outline-none font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400';

  // Focus ring
  const focusClasses = 'focus:ring-4';

  // Icon padding
  const iconPaddingClasses = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';

  // Combine all classes
  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${getStateClasses()}
    ${focusClasses}
    ${iconPaddingClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {rightIcon}
          </div>
        )}

        {/* Success/Error Icon */}
        {(error || success) && !rightIcon && (
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${error ? 'text-red-500' : 'text-green-500'}`}>
            {error ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className={`mt-2 text-sm ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({
  label,
  rows = 4,
  error,
  success,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const getStateClasses = () => {
    if (error) {
      return 'border-red-500 focus:border-red-600 focus:ring-red-500/20';
    }
    if (success) {
      return 'border-green-500 focus:border-green-600 focus:ring-green-500/20';
    }
    return 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20';
  };

  const textareaClasses = `
    w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600
    transition-all duration-300 outline-none font-medium text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 resize-none
    ${getStateClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {helperText && (
        <p className={`mt-2 text-sm ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  options = [],
  error,
  success,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const getStateClasses = () => {
    if (error) {
      return 'border-red-500 focus:border-red-600 focus:ring-red-500/20';
    }
    if (success) {
      return 'border-green-500 focus:border-green-600 focus:ring-green-500/20';
    }
    return 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20';
  };

  const selectClasses = `
    w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600
    transition-all duration-300 outline-none font-medium text-gray-900 dark:text-white
    focus:ring-4 appearance-none cursor-pointer
    ${getStateClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select ref={ref} className={selectClasses} {...props}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && (
        <p className={`mt-2 text-sm ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Search Input Component
export const SearchInput = ({ placeholder = 'Search...', onSearch, className = '', ...props }) => {
  const [value, setValue] = React.useState('');

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const clearSearch = () => {
    setValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={value && (
          <button onClick={clearSearch} className="hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        className={className}
        {...props}
      />
    </div>
  );
};

// Checkbox Component
export const Checkbox = forwardRef(({ label, className = '', ...props }, ref) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        ref={ref}
        type="checkbox"
        className={`
          w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600
          text-blue-600 focus:ring-4 focus:ring-blue-500/20
          transition-all duration-300 cursor-pointer
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

// Radio Component
export const Radio = forwardRef(({ label, className = '', ...props }, ref) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        ref={ref}
        type="radio"
        className={`
          w-5 h-5 border-2 border-gray-300 dark:border-gray-600
          text-blue-600 focus:ring-4 focus:ring-blue-500/20
          transition-all duration-300 cursor-pointer
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';

export default Input;
