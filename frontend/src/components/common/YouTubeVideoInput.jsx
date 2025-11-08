import React, { useState, useEffect } from 'react';
import { 
  VideoCameraIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { validateAndFormatYouTubeUrl } from '../../utils/youtube';

const YouTubeVideoInput = ({ 
  value, 
  onChange, 
  label = "YouTube Video URL", 
  placeholder = "Paste YouTube video URL here (e.g., https://www.youtube.com/watch?v=...)",
  required = false,
  className = "",
  showPreview = true 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Initialize input value from props
  useEffect(() => {
    if (value && typeof value === 'string') {
      setInputValue(value);
      validateUrl(value);
    } else if (value && typeof value === 'object' && value.url) {
      setInputValue(value.url);
      validateUrl(value.url);
    }
  }, []);

  const validateUrl = (url) => {
    if (!url || !url.trim()) {
      setVideoData(null);
      setError('');
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = validateAndFormatYouTubeUrl(url);
      
      if (result) {
        setVideoData(result);
        setError('');
      } else {
        setVideoData(null);
        setError('Please enter a valid YouTube URL');
      }
    } catch (err) {
      setVideoData(null);
      setError('Invalid YouTube URL format');
    }

    setIsValidating(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Immediately pass the value up
    if (!newValue || !newValue.trim()) {
      setVideoData(null);
      setError('');
      onChange(null);
      return;
    }
    
    // Validate after a short delay
    setIsValidating(true);
    setTimeout(() => {
      const result = validateAndFormatYouTubeUrl(newValue);
      if (result) {
        const videoDataToSend = {
          url: newValue,
          videoId: result.videoId,
          embedUrl: result.embedUrl,
          thumbnailUrl: result.thumbnailUrl,
          watchUrl: result.watchUrl
        };
        setVideoData(result);
        setError('');
        setIsValidating(false);
        onChange(videoDataToSend);
      } else {
        setVideoData(null);
        setError('Please enter a valid YouTube URL');
        setIsValidating(false);
        // Still pass the URL so user can continue typing
        onChange({ url: newValue });
      }
    }, 800);
  };

  const openVideoInNewTab = () => {
    if (videoData && videoData.watchUrl) {
      window.open(videoData.watchUrl, '_blank');
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium theme-text-secondary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <VideoCameraIcon className="h-5 w-5 theme-text-tertiary" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          className={`
            theme-input w-full pl-10 pr-10 py-3 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            placeholder-gray-400 text-sm transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${videoData ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : ''}
          `}
        />

        {/* Status Icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isValidating && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          )}
          {!isValidating && videoData && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
          {!isValidating && error && (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {/* Success Message with Video Info */}
      {videoData && !error && (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Valid YouTube video detected
        </div>
      )}

      {/* Video Preview */}
      {showPreview && videoData && !error && (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border theme-border-primary">
          <div className="flex items-start space-x-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={videoData.thumbnailUrl}
                alt="Video thumbnail"
                className="w-24 h-18 object-cover rounded-lg border theme-border-primary"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium theme-text-primary truncate">
                  Video ID: {videoData.videoId}
                </p>
                <button
                  type="button"
                  onClick={openVideoInNewTab}
                  className="flex items-center text-xs theme-text-accent hover:opacity-80 transition-opacity"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </button>
              </div>
              <p className="text-xs theme-text-tertiary mt-1">
                This video will be embedded in your course
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs theme-text-tertiary">
        <p className="mb-1">
          <strong>Supported formats:</strong>
        </p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
          <li>https://youtu.be/VIDEO_ID</li>
          <li>https://www.youtube.com/embed/VIDEO_ID</li>
        </ul>
        <p className="mt-2 text-amber-600 dark:text-amber-400">
          <strong>Tip:</strong> Set your videos to "Unlisted" on YouTube so only people with the link can view them.
        </p>
      </div>
    </div>
  );
};

export default YouTubeVideoInput;