/**
 * Simple logger utility
 * Uses winston if available, falls back to console
 */

const winston = require('winston');

// Create winston logger with console transport
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'course-service' },
  transports: [
    // Console transport with colorized output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      )
    })
  ]
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log' 
  }));
}

// Helper methods
const log = {
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },
  
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },
  
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },
  
  // Log HTTP requests
  request: (req, message = 'Request received') => {
    logger.info(message, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    });
  },
  
  // Log sanitized payloads (remove sensitive data)
  payload: (data, message = 'Payload') => {
    const sanitized = { ...data };
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    
    logger.info(message, { payload: sanitized });
  },
  
  // Log database operations
  db: (operation, model, data = {}) => {
    logger.info(`Database ${operation}`, { 
      model, 
      ...data 
    });
  }
};

module.exports = log;
