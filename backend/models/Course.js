const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Course subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [5000, 'Course description cannot exceed 5000 characters']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: [
      'Web Development',
      'Data Science',
      'Design',
      'Business',
      'Marketing',
      'Photography',
      'Music',
      'Health & Fitness',
      'Programming',
      'Technology',
      'Language',
      'Academic',
      'Personal Development'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  },
  language: {
    type: String,
    default: 'English'
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  previewVideo: {
    type: String,
    default: ''
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    lectures: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        default: ''
      },
      videoUrl: {
        type: String,
        default: ''
      },
      duration: {
        type: Number, // Duration in seconds
        default: 0
      },
      resources: [{
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['pdf', 'link', 'image', 'document'],
          default: 'link'
        }
      }],
      isPreview: {
        type: Boolean,
        default: false
      },
      order: {
        type: Number,
        required: true
      }
    }],
    order: {
      type: Number,
      required: true
    }
  }],
  learningOutcomes: [{
    type: String,
    required: true,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  targetAudience: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  totalDuration: {
    type: Number, // Total duration in seconds
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  enrollments: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLectures: [{
      lecture: mongoose.Schema.ObjectId,
      completedAt: Date
    }],
    lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reviews: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ subcategory: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ totalEnrollments: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ bestseller: 1 });

// Text search index
courseSchema.index({
  title: 'text',
  subtitle: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for course URL/slug
courseSchema.virtual('slug').get(function() {
  return this.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
});

// Virtual for effective price (considering discount)
courseSchema.virtual('effectivePrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Methods
courseSchema.methods.calculateTotals = function() {
  let totalDuration = 0;
  let totalLectures = 0;

  this.sections.forEach(section => {
    section.lectures.forEach(lecture => {
      totalDuration += lecture.duration || 0;
      totalLectures += 1;
    });
  });

  this.totalDuration = totalDuration;
  this.totalLectures = totalLectures;
};

courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

courseSchema.methods.publish = function() {
  this.status = 'published';
  this.isPublished = true;
  this.publishedAt = new Date();
};

courseSchema.methods.unpublish = function() {
  this.status = 'draft';
  this.isPublished = false;
  this.publishedAt = undefined;
};

courseSchema.methods.getSimilarCourses = async function() {
  // Find courses with similar tags or in the same category
  const similarCourses = await this.constructor
    .find({
      _id: { $ne: this._id },
      isPublished: true,
      $or: [
        { tags: { $in: this.tags } },
        { category: this.category }
      ]
    })
    .limit(6)
    .populate('instructor', 'name profilePicture')
    .sort({ averageRating: -1, totalEnrollments: -1 });

  return similarCourses;
};

// Static methods
courseSchema.statics.getPopularTags = async function() {
  const pipeline = [
    { $match: { isPublished: true } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ];
  
  const result = await this.aggregate(pipeline);
  return result.map(item => ({ tag: item._id, count: item.count }));
};

courseSchema.statics.getCoursesByCategory = async function(category, limit = 10) {
  return this.find({
    category: category,
    isPublished: true
  })
  .populate('instructor', 'name profilePicture')
  .sort({ averageRating: -1, totalEnrollments: -1 })
  .limit(limit);
};

courseSchema.statics.searchCourses = async function(query, filters = {}) {
  const searchQuery = {
    isPublished: true,
    ...(query && { $text: { $search: query } }),
    ...(filters.category && { category: filters.category }),
    ...(filters.level && { level: filters.level }),
    ...(filters.minPrice !== undefined && { price: { $gte: filters.minPrice } }),
    ...(filters.maxPrice !== undefined && { price: { $lte: filters.maxPrice } }),
    ...(filters.rating && { averageRating: { $gte: filters.rating } }),
    ...(filters.tags && { tags: { $in: filters.tags } })
  };

  let sortQuery = {};
  switch (filters.sortBy) {
    case 'popular':
      sortQuery = { totalEnrollments: -1 };
      break;
    case 'rating':
      sortQuery = { averageRating: -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    case 'price_low':
      sortQuery = { price: 1 };
      break;
    case 'price_high':
      sortQuery = { price: -1 };
      break;
    default:
      sortQuery = query ? { score: { $meta: 'textScore' } } : { averageRating: -1 };
  }

  return this.find(searchQuery)
    .populate('instructor', 'name profilePicture')
    .sort(sortQuery)
    .limit(filters.limit || 20)
    .skip(filters.skip || 0);
};

// Pre-save middleware
courseSchema.pre('save', function(next) {
  this.calculateTotals();
  this.calculateAverageRating();
  this.totalEnrollments = this.enrollments.length;
  
  // Auto-generate tags from title and description if tags are empty
  if (this.tags.length === 0) {
    const text = `${this.title} ${this.description}`.toLowerCase();
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'learn', 'course', 'tutorial'];
    const words = text.match(/\b\w{3,}\b/g) || [];
    this.tags = [...new Set(words.filter(word => !commonWords.includes(word)))].slice(0, 10);
  }
  
  next();
});

module.exports = mongoose.model('Course', courseSchema);