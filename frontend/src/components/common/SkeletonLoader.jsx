import React from 'react';

const SkeletonLoader = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="w-full h-48 bg-slate-700/50" />
          
          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Category */}
            <div className="h-4 w-24 bg-slate-700/50 rounded" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-slate-700/50 rounded w-full" />
              <div className="h-5 bg-slate-700/50 rounded w-3/4" />
            </div>
            
            {/* Instructor */}
            <div className="h-4 w-32 bg-slate-700/50 rounded" />
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="h-4 w-20 bg-slate-700/50 rounded" />
              <div className="h-4 w-16 bg-slate-700/50 rounded" />
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="h-5 w-20 bg-slate-700/50 rounded" />
              <div className="h-9 w-24 bg-slate-700/50 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
