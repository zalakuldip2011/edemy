import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const YouTubeVideoPlayer = ({ 
  videoId, 
  title = "Course Lecture",
  className = "",
  autoplay = false,
  controls = true,
  onProgress = null,
  onEnded = null,
  startTime = 0,
  height = "400px",
  allowFullscreen = true 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Reset states when videoId changes
    setIsReady(false);
    setError(null);
  }, [videoId]);

  if (!videoId) {
    return (
      <div className={`bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center ${className}`} 
           style={{ height }}>
        <div className="text-center theme-text-tertiary">
          <PlayIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No video available</p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?` + new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    fs: allowFullscreen ? '1' : '0',
    cc_load_policy: '0',
    iv_load_policy: '3',
    ...(startTime > 0 && { start: startTime.toString() })
  }).toString();

  const handleIframeLoad = () => {
    setIsReady(true);
  };

  const handleIframeError = () => {
    setError('Failed to load video. Please check if the video is available.');
  };

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center p-8 ${className}`} 
           style={{ height }}>
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <SpeakerXMarkIcon className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-red-800 dark:text-red-200 font-medium mb-1">Video Unavailable</p>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <p className="text-red-500 dark:text-red-300 text-xs mt-2">
            The video may be private, deleted, or have restricted embedding.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Video Title Overlay */}
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-20">
          <h3 className="text-white font-medium text-sm truncate">{title}</h3>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="w-full"
        style={{ height }}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={allowFullscreen}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />

      {/* Custom Controls Overlay (if needed) */}
      {!controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <PlayIcon className="h-5 w-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <SpeakerWaveIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideoPlayer;