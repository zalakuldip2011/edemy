import React from 'react';

/**
 * Beautiful Material UI-inspired Badge Component
 * Perfect for status indicators, notifications, and labels
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs',
    md: dot ? 'w-2.5 h-2.5' : 'px-3 py-1 text-sm',
    lg: dot ? 'w-3 h-3' : 'px-4 py-1.5 text-base'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
  };

  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  // Dot badge
  if (dot) {
    return (
      <span
        className={`
          inline-block rounded-full
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
    );
  }

  // Regular badge
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${roundedClasses[rounded]}
        ${removable ? 'pr-1.5' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Notification Badge - shows a number (like notifications counter)
export const NotificationBadge = ({ count, max = 99, className = '', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <span
      className={`
        absolute -top-1 -right-1 inline-flex items-center justify-center
        px-2 py-1 text-xs font-bold leading-none text-white
        bg-gradient-to-r from-red-500 to-pink-500
        rounded-full transform scale-100 hover:scale-110 transition-transform
        shadow-lg
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {displayCount}
    </span>
  );
};

// Status Badge - with dot indicator
export const StatusBadge = ({ status = 'online', label, size = 'md', className = '' }) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: label || 'Online'
    },
    offline: {
      color: 'bg-gray-500',
      label: label || 'Offline'
    },
    away: {
      color: 'bg-yellow-500',
      label: label || 'Away'
    },
    busy: {
      color: 'bg-red-500',
      label: label || 'Busy'
    }
  };

  const config = statusConfig[status] || statusConfig.online;

  const sizeClasses = {
    sm: { dot: 'w-2 h-2', text: 'text-xs' },
    md: { dot: 'w-2.5 h-2.5', text: 'text-sm' },
    lg: { dot: 'w-3 h-3', text: 'text-base' }
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${config.color} ${sizeClasses[size].dot} rounded-full animate-pulse`} />
      <span className={`${sizeClasses[size].text} font-medium text-gray-700 dark:text-gray-300`}>
        {config.label}
      </span>
    </span>
  );
};

// Achievement Badge - with icon
export const AchievementBadge = ({ icon, label, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600',
    gold: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    silver: 'bg-gradient-to-br from-gray-400 to-gray-500',
    bronze: 'bg-gradient-to-br from-orange-700 to-orange-800'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`${variantClasses[variant]} p-3 rounded-xl shadow-lg`}>
        <div className="text-white text-2xl">{icon}</div>
      </div>
      {label && (
        <span className="font-semibold text-gray-900 dark:text-white">
          {label}
        </span>
      )}
    </div>
  );
};

// Chip Component - similar to Material UI Chip
export const Chip = ({
  label,
  avatar,
  icon,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  clickable = false,
  deletable = false,
  onDelete,
  onClick,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-6 text-xs',
    md: 'h-8 text-sm',
    lg: 'h-10 text-base'
  };

  const colorClasses = {
    primary: variant === 'filled'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    secondary: variant === 'filled'
      ? 'bg-purple-500 text-white hover:bg-purple-600'
      : 'border-2 border-purple-500 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    success: variant === 'filled'
      ? 'bg-green-500 text-white hover:bg-green-600'
      : 'border-2 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 rounded-full font-medium
        transition-all duration-300
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${clickable ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {avatar && (
        <img
          src={avatar}
          alt=""
          className="w-6 h-6 rounded-full border-2 border-white"
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {deletable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ml-1"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Badge;
