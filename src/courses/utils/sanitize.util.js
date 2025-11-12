/**
 * Sanitize utility to ensure all course data is safe and never null/undefined
 * Prevents "Cannot convert undefined or null to object" errors
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Sanitize a string value
 * @param {*} value - Raw value
 * @param {string} defaultValue - Default if invalid
 * @returns {string}
 */
function sanitizeString(value, defaultValue = '') {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
}

/**
 * Sanitize a number value
 * @param {*} value - Raw value
 * @param {number} defaultValue - Default if invalid
 * @returns {number}
 */
function sanitizeNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Sanitize a boolean value
 * @param {*} value - Raw value
 * @param {boolean} defaultValue - Default if invalid
 * @returns {boolean}
 */
function sanitizeBoolean(value, defaultValue = false) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return !!value;
}

/**
 * Sanitize an array, ensuring it's always an array
 * @param {*} value - Raw value
 * @param {Array} defaultValue - Default if invalid
 * @returns {Array}
 */
function sanitizeArray(value, defaultValue = []) {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) return value;
  return defaultValue;
}

/**
 * Sanitize an object, ensuring it's always an object
 * @param {*} value - Raw value
 * @param {Object} defaultValue - Default if invalid
 * @returns {Object}
 */
function sanitizeObject(value, defaultValue = {}) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  return defaultValue;
}

/**
 * Sanitize lecture data
 * @param {Object} lecture - Raw lecture
 * @returns {Object}
 */
function sanitizeLecture(lecture = {}) {
  const safe = sanitizeObject(lecture, {});
  
  return {
    title: sanitizeString(safe.title, 'Untitled Lecture'),
    description: sanitizeString(safe.description, ''),
    type: sanitizeString(safe.type, 'video'),
    duration: sanitizeNumber(safe.duration, 0),
    videoData: safe.videoData || null,
    content: sanitizeString(safe.content, ''),
    resources: sanitizeArray(safe.resources, []).map(r => ({
      type: sanitizeString(r?.type, 'file'),
      url: sanitizeString(r?.url, ''),
      name: sanitizeString(r?.name, '')
    })),
    order: sanitizeNumber(safe.order, 0),
    isFree: sanitizeBoolean(safe.isFree, false),
    isCompleted: sanitizeBoolean(safe.isCompleted, false)
  };
}

/**
 * Sanitize section data
 * @param {Object} section - Raw section
 * @returns {Object}
 */
function sanitizeSection(section = {}) {
  const safe = sanitizeObject(section, {});
  
  return {
    title: sanitizeString(safe.title, 'Untitled Section'),
    description: sanitizeString(safe.description, ''),
    lectures: sanitizeArray(safe.lectures, []).map(sanitizeLecture),
    order: sanitizeNumber(safe.order, 0)
  };
}

/**
 * Sanitize promo data
 * @param {Object} promo - Raw promo
 * @returns {Object}
 */
function sanitizePromo(promo = {}) {
  const safe = sanitizeObject(promo, {});
  
  return {
    enabled: sanitizeBoolean(safe.enabled, false),
    discountPercentage: sanitizeNumber(safe.discountPercentage, 0),
    startDate: safe.startDate || null,
    endDate: safe.endDate || null
  };
}

/**
 * Sanitize features data
 * @param {Object} features - Raw features
 * @returns {Object}
 */
function sanitizeFeatures(features = {}) {
  const safe = sanitizeObject(features, {});
  
  return {
    enableCertificate: sanitizeBoolean(safe.enableCertificate, true),
    enableQA: sanitizeBoolean(safe.enableQA, true),
    enableReviews: sanitizeBoolean(safe.enableReviews, true),
    enableDownloads: sanitizeBoolean(safe.enableDownloads, false),
    enableDiscussions: sanitizeBoolean(safe.enableDiscussions, true)
  };
}

/**
 * Main sanitization function for course payload
 * @param {Object} raw - Raw course data from request
 * @returns {Object} - Sanitized course data safe for DB
 */
function sanitizeCoursePayload(raw = {}) {
  // Ensure raw is an object
  const safe = sanitizeObject(raw, {});
  
  // Build sanitized payload with all safe defaults
  const sanitized = {
    // Basic info
    title: sanitizeString(safe.title, ''),
    subtitle: sanitizeString(safe.subtitle, ''),
    description: sanitizeString(safe.description, ''),
    
    // Categorization
    category: sanitizeString(safe.category, 'Uncategorized'),
    level: sanitizeString(safe.level, 'Beginner'),
    language: sanitizeString(safe.language, 'English'),
    
    // Media
    thumbnailUrl: sanitizeString(safe.thumbnailUrl, ''),
    videoUrl: sanitizeString(safe.videoUrl, ''),
    
    // Tags
    tags: sanitizeArray(safe.tags, []).map(t => sanitizeString(t, '')).filter(t => t.length > 0),
    
    // Visibility & Pricing
    visibility: sanitizeString(safe.visibility, 'public'),
    price: sanitizeNumber(safe.price, 0),
    currency: sanitizeString(safe.currency, 'USD'),
    
    // Promo
    promo: sanitizePromo(safe.promo),
    
    // Features
    features: sanitizeFeatures(safe.features),
    
    // Content arrays
    learningOutcomes: sanitizeArray(safe.learningOutcomes, [])
      .map(o => sanitizeString(o, ''))
      .filter(o => o.length > 0),
    prerequisites: sanitizeArray(safe.prerequisites, [])
      .map(p => sanitizeString(p, ''))
      .filter(p => p.length > 0),
    targetAudience: sanitizeArray(safe.targetAudience, [])
      .map(t => sanitizeString(t, ''))
      .filter(t => t.length > 0),
    requirements: sanitizeArray(safe.requirements, [])
      .map(r => sanitizeString(r, ''))
      .filter(r => r.length > 0),
    
    // Sections
    sections: sanitizeArray(safe.sections, []).map(sanitizeSection),
    
    // Publishing (don't allow direct setting from payload for security)
    // published: sanitizeBoolean(safe.published, false),
    // status: sanitizeString(safe.status, 'draft'),
    
    // SEO
    metaDescription: sanitizeString(safe.metaDescription, ''),
    metaKeywords: sanitizeArray(safe.metaKeywords, [])
      .map(k => sanitizeString(k, ''))
      .filter(k => k.length > 0)
  };
  
  // Log sanitization for debugging (remove in production)
  console.log('✅ Payload sanitized successfully');
  
  return sanitized;
}

/**
 * Sanitize update payload (allows partial updates)
 * @param {Object} raw - Raw update data
 * @returns {Object} - Sanitized update data
 */
function sanitizeUpdatePayload(raw = {}) {
  const safe = sanitizeObject(raw, {});
  const sanitized = {};
  
  // Only include fields that are present in the update
  if (safe.title !== undefined) sanitized.title = sanitizeString(safe.title, '');
  if (safe.subtitle !== undefined) sanitized.subtitle = sanitizeString(safe.subtitle, '');
  if (safe.description !== undefined) sanitized.description = sanitizeString(safe.description, '');
  if (safe.category !== undefined) sanitized.category = sanitizeString(safe.category, 'Uncategorized');
  if (safe.level !== undefined) sanitized.level = sanitizeString(safe.level, 'Beginner');
  if (safe.language !== undefined) sanitized.language = sanitizeString(safe.language, 'English');
  if (safe.thumbnailUrl !== undefined) sanitized.thumbnailUrl = sanitizeString(safe.thumbnailUrl, '');
  if (safe.videoUrl !== undefined) sanitized.videoUrl = sanitizeString(safe.videoUrl, '');
  if (safe.tags !== undefined) {
    sanitized.tags = sanitizeArray(safe.tags, [])
      .map(t => sanitizeString(t, ''))
      .filter(t => t.length > 0);
  }
  if (safe.visibility !== undefined) sanitized.visibility = sanitizeString(safe.visibility, 'public');
  if (safe.price !== undefined) sanitized.price = sanitizeNumber(safe.price, 0);
  if (safe.currency !== undefined) sanitized.currency = sanitizeString(safe.currency, 'USD');
  if (safe.promo !== undefined) sanitized.promo = sanitizePromo(safe.promo);
  if (safe.features !== undefined) sanitized.features = sanitizeFeatures(safe.features);
  if (safe.learningOutcomes !== undefined) {
    sanitized.learningOutcomes = sanitizeArray(safe.learningOutcomes, [])
      .map(o => sanitizeString(o, ''))
      .filter(o => o.length > 0);
  }
  if (safe.prerequisites !== undefined) {
    sanitized.prerequisites = sanitizeArray(safe.prerequisites, [])
      .map(p => sanitizeString(p, ''))
      .filter(p => p.length > 0);
  }
  if (safe.targetAudience !== undefined) {
    sanitized.targetAudience = sanitizeArray(safe.targetAudience, [])
      .map(t => sanitizeString(t, ''))
      .filter(t => t.length > 0);
  }
  if (safe.requirements !== undefined) {
    sanitized.requirements = sanitizeArray(safe.requirements, [])
      .map(r => sanitizeString(r, ''))
      .filter(r => r.length > 0);
  }
  if (safe.sections !== undefined) {
    sanitized.sections = sanitizeArray(safe.sections, []).map(sanitizeSection);
  }
  if (safe.metaDescription !== undefined) {
    sanitized.metaDescription = sanitizeString(safe.metaDescription, '');
  }
  if (safe.metaKeywords !== undefined) {
    sanitized.metaKeywords = sanitizeArray(safe.metaKeywords, [])
      .map(k => sanitizeString(k, ''))
      .filter(k => k.length > 0);
  }
  
  console.log('✅ Update payload sanitized successfully');
  
  return sanitized;
}

/**
 * Deep clean an object - remove all null/undefined recursively
 * @param {*} obj - Object to clean
 * @returns {*} - Cleaned object
 */
function deepClean(obj) {
  if (obj === null || obj === undefined) return null;
  
  if (Array.isArray(obj)) {
    return obj.map(deepClean).filter(item => item !== null && item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      const value = deepClean(obj[key]);
      if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }
  
  return obj;
}

module.exports = {
  sanitizeCoursePayload,
  sanitizeUpdatePayload,
  sanitizeString,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeArray,
  sanitizeObject,
  sanitizeLecture,
  sanitizeSection,
  sanitizePromo,
  sanitizeFeatures,
  deepClean
};
