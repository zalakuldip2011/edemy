const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  type: { type: String, enum: ['video', 'article', 'quiz', 'resource'], default: 'video' },
  duration: { type: Number, default: 0 }, // in seconds
  videoData: { 
    type: mongoose.Schema.Types.Mixed, 
    default: null // YouTube data or video URL
  },
  content: { type: String, default: '' }, // for articles
  resources: [{ 
    type: { type: String, default: 'file' },
    url: { type: String, default: '' },
    name: { type: String, default: '' }
  }],
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  lectures: { type: [lectureSchema], default: [] },
  order: { type: Number, default: 0 }
}, { _id: true, timestamps: true });

const courseSchema = new mongoose.Schema({
  // Instructor reference
  instructorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  
  // Basic info
  title: { 
    type: String, 
    required: [true, 'Course title is required'], 
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: { type: String, default: '', trim: true, maxlength: 300 },
  description: { 
    type: String, 
    default: '', 
    trim: true,
    minlength: [0, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // Categorization
  category: { 
    type: String, 
    default: 'Uncategorized',
    enum: [
      'Web Development', 'Mobile Development', 'Programming Languages',
      'Data Science', 'Machine Learning', 'Artificial Intelligence',
      'Design', 'Business', 'Marketing', 'Personal Development',
      'Photography', 'Music', 'Health & Fitness', 'Uncategorized'
    ]
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  language: { type: String, default: 'English' },
  
  // Media
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' }, // intro video
  
  // Tags for search
  tags: { type: [String], default: [] },
  
  // Visibility & Pricing
  visibility: { 
    type: String, 
    enum: ['public', 'private', 'unlisted'], 
    default: 'public' 
  },
  price: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' },
  
  // Promo/Discounts
  promo: {
    enabled: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }
  },
  
  // Features
  features: {
    enableCertificate: { type: Boolean, default: true },
    enableQA: { type: Boolean, default: true },
    enableReviews: { type: Boolean, default: true },
    enableDownloads: { type: Boolean, default: false },
    enableDiscussions: { type: Boolean, default: true }
  },
  
  // Course content structure
  learningOutcomes: { type: [String], default: [] },
  prerequisites: { type: [String], default: [] },
  targetAudience: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  
  // Course content
  sections: { type: [sectionSchema], default: [] },
  
  // Publishing status
  published: { type: Boolean, default: false, index: true },
  publishedAt: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived', 'pending'], 
    default: 'draft',
    index: true
  },
  
  // Stats (computed/cached)
  totalLectures: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 }, // in seconds
  totalSections: { type: Number, default: 0 },
  enrollmentCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  
  // SEO & metadata
  slug: { type: String, unique: true, sparse: true },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: [String], default: [] },
  
  // Admin
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true, transform: removeVersion },
  toObject: { virtuals: true }
});

// Remove __v and transform _id
function removeVersion(doc, ret) {
  delete ret.__v;
  ret.id = ret._id;
  return ret;
}

// Indexes for performance
courseSchema.index({ instructorId: 1, status: 1 });
courseSchema.index({ published: 1, status: 1 });
courseSchema.index({ category: 1, published: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ averageRating: -1 });

// Virtual for total course duration in readable format
courseSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.totalDuration / 3600);
  const minutes = Math.floor((this.totalDuration % 3600) / 60);
  return `${hours}h ${minutes}m`;
});

// Pre-save hook to calculate stats
courseSchema.pre('save', function(next) {
  // Calculate total sections
  this.totalSections = this.sections ? this.sections.length : 0;
  
  // Calculate total lectures and duration
  let totalLectures = 0;
  let totalDuration = 0;
  
  if (this.sections && Array.isArray(this.sections)) {
    this.sections.forEach(section => {
      if (section.lectures && Array.isArray(section.lectures)) {
        totalLectures += section.lectures.length;
        section.lectures.forEach(lecture => {
          totalDuration += lecture.duration || 0;
        });
      }
    });
  }
  
  this.totalLectures = totalLectures;
  this.totalDuration = totalDuration;
  
  // Generate slug from title if not exists
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();
  }
  
  next();
});

// Static method to find published courses
courseSchema.statics.findPublished = function(filters = {}) {
  return this.find({ 
    published: true, 
    status: 'published',
    isDeleted: false,
    ...filters 
  });
};

// Static method to find instructor courses
courseSchema.statics.findByInstructor = function(instructorId, includeDeleted = false) {
  const query = { instructorId };
  if (!includeDeleted) {
    query.isDeleted = false;
  }
  return this.find(query).sort({ updatedAt: -1 });
};

// Instance method to check if ready to publish
courseSchema.methods.isReadyToPublish = function() {
  const errors = [];
  
  // Required fields
  if (!this.title || this.title.trim().length < 3) {
    errors.push('title_required');
  }
  
  if (!this.description || this.description.trim().length < 10) {
    errors.push('description_required');
  }
  
  if (!this.category || this.category === 'Uncategorized') {
    errors.push('category_required');
  }
  
  // Learning outcomes (minimum 3)
  if (!this.learningOutcomes || this.learningOutcomes.length < 3) {
    errors.push('learning_outcomes_required');
  }
  
  // Sections (minimum 1)
  if (!this.sections || this.sections.length < 1) {
    errors.push('sections_required');
  }
  
  // Each section must have at least 1 lecture
  if (this.sections && this.sections.length > 0) {
    const sectionsWithoutLectures = this.sections.filter(s => 
      !s.lectures || s.lectures.length === 0
    );
    if (sectionsWithoutLectures.length > 0) {
      errors.push('all_sections_need_lectures');
    }
  }
  
  // Thumbnail recommended
  if (!this.thumbnailUrl) {
    errors.push('thumbnail_recommended');
  }
  
  return {
    ready: errors.length === 0,
    errors
  };
};

// Instance method to publish
courseSchema.methods.publishCourse = function() {
  const readiness = this.isReadyToPublish();
  
  if (!readiness.ready) {
    throw new Error(`Course not ready to publish: ${readiness.errors.join(', ')}`);
  }
  
  this.published = true;
  this.status = 'published';
  this.publishedAt = new Date();
  
  return this.save();
};

// Instance method to unpublish
courseSchema.methods.unpublishCourse = function() {
  this.published = false;
  this.status = 'draft';
  this.publishedAt = null;
  
  return this.save();
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
