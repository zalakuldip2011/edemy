// YouTube utility functions for video handling

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;

  // Remove whitespace
  url = url.trim();

  // Regular expressions for different YouTube URL formats
  const patterns = [
    // Standard watch URLs
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // YouTube URLs with additional parameters
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    // Mobile URLs
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Gaming URLs
    /(?:gaming\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already just a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
};

/**
 * Validate if a YouTube URL is valid
 * @param {string} url - YouTube URL
 * @returns {boolean} - True if valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  return extractYouTubeVideoId(url) !== null;
};

/**
 * Generate YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {object} options - Embed options
 * @returns {string} - YouTube embed URL
 */
export const generateEmbedUrl = (videoId, options = {}) => {
  if (!videoId) return '';

  const {
    autoplay = 0,
    controls = 1,
    modestbranding = 1,
    rel = 0,
    showinfo = 0,
    fs = 1,
    cc_load_policy = 0,
    iv_load_policy = 3,
    start = null
  } = options;

  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
  
  const params = [
    `autoplay=${autoplay}`,
    `controls=${controls}`,
    `modestbranding=${modestbranding}`,
    `rel=${rel}`,
    `showinfo=${showinfo}`,
    `fs=${fs}`,
    `cc_load_policy=${cc_load_policy}`,
    `iv_load_policy=${iv_load_policy}`
  ];

  if (start) {
    params.push(`start=${start}`);
  }

  embedUrl += params.join('&');
  return embedUrl;
};

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} - YouTube thumbnail URL
 */
export const generateThumbnailUrl = (videoId, quality = 'hqdefault') => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Generate YouTube watch URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - YouTube watch URL
 */
export const generateWatchUrl = (videoId) => {
  if (!videoId) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Validate YouTube URL and return formatted data
 * @param {string} url - YouTube URL
 * @returns {object|null} - Video data object or null if invalid
 */
export const validateAndFormatYouTubeUrl = (url) => {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return null;
  }

  return {
    videoId,
    embedUrl: generateEmbedUrl(videoId),
    thumbnailUrl: generateThumbnailUrl(videoId),
    watchUrl: generateWatchUrl(videoId),
    isValid: true
  };
};

/**
 * Get video duration from YouTube API (requires API key)
 * Note: This would require YouTube Data API v3 key
 * For now, we'll rely on manual duration input
 */
export const getYouTubeVideoDuration = async (videoId, apiKey) => {
  if (!apiKey) {
    console.warn('YouTube API key not provided. Duration will need to be entered manually.');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      return parseDuration(duration);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube video duration:', error);
    return null;
  }
};

/**
 * Parse ISO 8601 duration format (PT15M33S) to minutes
 * @param {string} duration - ISO 8601 duration
 * @returns {number} - Duration in minutes
 */
const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  return hours * 60 + minutes + Math.ceil(seconds / 60);
};

export default {
  extractYouTubeVideoId,
  isValidYouTubeUrl,
  generateEmbedUrl,
  generateThumbnailUrl,
  generateWatchUrl,
  validateAndFormatYouTubeUrl,
  getYouTubeVideoDuration
};