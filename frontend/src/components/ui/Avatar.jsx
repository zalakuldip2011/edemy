import React from 'react';

/**
 * Beautiful Material UI-inspired Avatar Component
 * Supports images, initials, icons, status indicators, and groups
 */
const Avatar = ({
  src,
  alt = '',
  name,
  size = 'md',
  variant = 'circular',
  status,
  statusPosition = 'bottom-right',
  fallbackIcon,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-4xl'
  };

  // Variant classes
  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };

  // Status indicator size
  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6'
  };

  // Status position classes
  const statusPositionClasses = {
    'top-left': '-top-0.5 -left-0.5',
    'top-right': '-top-0.5 -right-0.5',
    'bottom-left': '-bottom-0.5 -left-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5'
  };

  // Status colors
  const statusColors = {
    online: 'bg-green-500 ring-green-100',
    offline: 'bg-gray-500 ring-gray-100',
    away: 'bg-yellow-500 ring-yellow-100',
    busy: 'bg-red-500 ring-red-100'
  };

  // Get initials from name
  const getInitials = () => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate gradient based on name
  const getGradient = () => {
    if (!name) return 'from-blue-500 to-purple-600';
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-pink-500 to-red-600',
      'from-green-500 to-teal-600',
      'from-yellow-500 to-orange-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-pink-600'
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          overflow-hidden
          flex items-center justify-center
          font-semibold
          transition-all duration-300
          ${src ? 'bg-gray-200 dark:bg-gray-700' : `bg-gradient-to-br ${getGradient()} text-white`}
        `.trim().replace(/\s+/g, ' ')}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : name ? (
          <span>{getInitials()}</span>
        ) : fallbackIcon ? (
          <span className="text-gray-500 dark:text-gray-400">{fallbackIcon}</span>
        ) : (
          <svg className="w-2/3 h-2/3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute ${statusPositionClasses[statusPosition]}
            ${statusSizeClasses[size]}
            ${statusColors[status]}
            rounded-full border-2 border-white dark:border-gray-800
            ring-2
          `.trim().replace(/\s+/g, ' ')}
          aria-label={status}
        />
      )}
    </div>
  );
};

// Avatar Group - for displaying multiple avatars
export const AvatarGroup = ({
  avatars = [],
  max = 3,
  size = 'md',
  spacing = 'normal',
  className = '',
  ...props
}) => {
  const spacingClasses = {
    tight: '-space-x-2',
    normal: '-space-x-3',
    loose: '-space-x-4'
  };

  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div
      className={`flex items-center ${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-white dark:ring-gray-800"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar size={size} {...avatar} />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="ring-2 ring-white dark:ring-gray-800"
          style={{ zIndex: 0 }}
        >
          <Avatar
            size={size}
            name={`+${remainingCount}`}
            className="cursor-pointer hover:z-50 transition-all"
          />
        </div>
      )}
    </div>
  );
};

// Avatar with Badge - for notifications or status
export const AvatarWithBadge = ({
  badge,
  badgePosition = 'top-right',
  ...avatarProps
}) => {
  const badgePositionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  return (
    <div className="relative inline-block">
      <Avatar {...avatarProps} />
      {badge && (
        <div className={`absolute ${badgePositionClasses[badgePosition]}`}>
          {badge}
        </div>
      )}
    </div>
  );
};

export default Avatar;
