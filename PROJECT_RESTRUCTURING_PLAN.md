# Edemy - Complete Project Restructuring Plan

## 🎯 Overview
This document outlines the comprehensive restructuring plan to transform Edemy into a professional-level Learning Management System with proper architecture, consistent theming, and robust functionality.

---

## 📊 Current State Assessment

### ✅ What's Working
- Basic authentication (login/signup/email verification)
- Theme system infrastructure (ThemeContext, theme-aware classes)
- Course creation flow (3-step wizard)
- YouTube video integration
- Basic instructor and student views
- MongoDB models with proper validation

### ❌ Current Issues

#### 1. **Database & Backend**
- ❌ Missing Enrollment model (enrollments embedded in Course)
- ❌ No Review/Rating model (embedded in Course causes performance issues)
- ❌ Missing Payment/Transaction models
- ❌ No Progress Tracking model
- ❌ Inefficient queries (no population, indexing issues)
- ❌ Weak error handling and validation

#### 2. **Theme System**
- ❌ Many components still use hardcoded dark colors (`bg-gray-800`, `text-white`)
- ❌ Inconsistent contrast (light mode shows dark text on dark backgrounds)
- ❌ Mixed theming approach (some use `theme-bg-primary`, others use static classes)
- ❌ Auth pages not using theme system at all
- ❌ Instructor dashboard partially themed

#### 3. **Frontend Logic**
- ❌ No global loading/error state management
- ❌ API calls scattered without centralization
- ❌ Missing optimistic updates
- ❌ No caching strategy
- ❌ Inconsistent data flow patterns

#### 4. **Features Missing**
- ❌ Student dashboard (enrolled courses, progress, certificates)
- ❌ Course enrollment flow
- ❌ Payment integration
- ❌ Progress tracking
- ❌ Review submission system
- ❌ Instructor analytics
- ❌ Advanced search/filters
- ❌ Wishlist/cart functionality

#### 5. **Security & Performance**
- ❌ No rate limiting
- ❌ Missing input sanitization
- ❌ No API request/response logging
- ❌ Large bundle sizes (no code splitting)
- ❌ No lazy loading for routes/components
- ❌ Missing image optimization

---

## 🏗️ Phase 1: Database Restructuring (High Priority)

### 1.1 Create New Models

#### **Enrollment Model** (`backend/models/Enrollment.js`)
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  enrolledAt: Date,
  status: ['active', 'completed', 'cancelled', 'refunded'],
  progress: {
    percentage: Number (0-100),
    completedLectures: [ObjectId],
    lastAccessedLecture: ObjectId,
    lastAccessedAt: Date
  },
  certificate: {
    issued: Boolean,
    issuedAt: Date,
    certificateId: String,
    certificateUrl: String
  },
  payment: ObjectId (ref: Payment)
}
```

#### **Review Model** (`backend/models/Review.js`)
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String,
  likes: Number,
  dislikes: Number,
  helpful: [ObjectId] (users who marked helpful),
  isVerifiedPurchase: Boolean,
  status: ['active', 'flagged', 'removed'],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Payment Model** (`backend/models/Payment.js`)
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  amount: Number,
  currency: String,
  status: ['pending', 'completed', 'failed', 'refunded'],
  paymentMethod: String,
  transactionId: String,
  paymentProvider: String (stripe/paypal),
  receipt: String,
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **Progress Model** (`backend/models/Progress.js`)
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  section: ObjectId,
  lecture: ObjectId,
  status: ['not_started', 'in_progress', 'completed'],
  watchTime: Number (seconds),
  completedAt: Date,
  quizScore: Number,
  assignmentSubmitted: Boolean,
  notes: String
}
```

#### **Wishlist Model** (`backend/models/Wishlist.js`)
```javascript
{
  user: ObjectId (ref: User),
  courses: [ObjectId (ref: Course)],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Cart Model** (`backend/models/Cart.js`)
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    course: ObjectId (ref: Course),
    addedAt: Date,
    price: Number
  }],
  totalAmount: Number,
  couponCode: String,
  discount: Number,
  finalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 1.2 Update Course Model
- Remove embedded `enrollments` and `reviews` arrays
- Add virtual properties to reference new models
- Add aggregation methods for statistics

### 1.3 Create Backend Controllers
- `enrollmentController.js` - Enroll, get enrollments, update progress
- `reviewController.js` - Create, read, update, delete reviews
- `paymentController.js` - Process payments, handle webhooks
- `progressController.js` - Track and update course progress
- `cartController.js` - Add/remove courses, checkout
- `wishlistController.js` - Add/remove courses

### 1.4 Create API Routes
- `/api/enrollments` - Enrollment endpoints
- `/api/reviews` - Review endpoints
- `/api/payments` - Payment endpoints
- `/api/progress` - Progress tracking
- `/api/cart` - Shopping cart
- `/api/wishlist` - Wishlist

---

## 🎨 Phase 2: Complete Theme System Fix (High Priority)

### 2.1 Update Theme Global CSS
Add missing theme classes in `frontend/src/styles/theme-global.css`:

```css
/* Form inputs */
.theme-input {
  @apply transition-colors duration-300;
}

.light-theme .theme-input {
  @apply bg-white border-gray-300 text-gray-900 placeholder-gray-500;
  @apply focus:border-purple-500 focus:ring-purple-500/50;
}

.dark-theme .theme-input {
  @apply bg-slate-800/50 border-slate-600 text-white placeholder-slate-400;
  @apply focus:border-purple-400 focus:ring-purple-400/50;
}

/* Auth pages */
.theme-auth-container {
  @apply transition-colors duration-300;
}

.light-theme .theme-auth-container {
  @apply bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50;
}

.dark-theme .theme-auth-container {
  @apply bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900;
}

.theme-auth-card {
  @apply rounded-2xl p-8 shadow-2xl transition-colors duration-300;
}

.light-theme .theme-auth-card {
  @apply bg-white border border-gray-200;
}

.dark-theme .theme-auth-card {
  @apply bg-slate-800/50 backdrop-blur-sm border border-slate-700;
}

/* Status badges */
.theme-badge-success {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.light-theme .theme-badge-success {
  @apply bg-green-100 text-green-800;
}

.dark-theme .theme-badge-success {
  @apply bg-green-500/20 text-green-400;
}

/* Table styles */
.theme-table {
  @apply w-full;
}

.light-theme .theme-table {
  @apply bg-white;
}

.dark-theme .theme-table {
  @apply bg-slate-800/50;
}

.theme-table-header {
  @apply text-xs font-medium uppercase tracking-wider;
}

.light-theme .theme-table-header {
  @apply bg-gray-50 text-gray-700;
}

.dark-theme .theme-table-header {
  @apply bg-slate-900/50 text-slate-300;
}

.theme-table-row {
  @apply transition-colors;
}

.light-theme .theme-table-row:hover {
  @apply bg-gray-50;
}

.dark-theme .theme-table-row:hover {
  @apply bg-slate-700/30;
}
```

### 2.2 Components to Fix (Theme Audit)

#### Auth Pages (All need complete remake)
- ✅ `Login.jsx` - Replace gradient backgrounds, inputs, labels
- ✅ `Signup.jsx` - Replace gradient backgrounds, inputs, labels
- ✅ `EmailVerification.jsx` - Replace dark-only styling
- ✅ `ForgotPassword.jsx` - Replace dark-only styling
- ✅ `ResetPassword.jsx` - Replace dark-only styling
- ✅ `VerifyResetOTP.jsx` - Replace dark-only styling

#### Instructor Pages
- ⏳ `CourseCreate.jsx` - Fix form inputs, labels, sections
- ⏳ `Courses.jsx` - Fix table, status badges, thumbnails
- ✅ `Dashboard.jsx` - Fix cards, stats, charts
- ⏳ `CreateContent.jsx` - Fix form, video player, lecture list
- ⏳ `PlanYourCourse.jsx` - Fix sections, inputs
- ⏳ `PublishCourse.jsx` - Fix review cards, inputs

#### Student Pages  
- ⏳ `Dashboard.jsx` - Create from scratch with theme support
- ⏳ `CourseViewer.jsx` - Fix video player, sidebar, progress
- ⏳ `CourseExplorer.jsx` - Fix filters, cards, search

#### Layout Components
- ✅ `Header.jsx` - Mostly themed
- ✅ `Footer.jsx` - Needs verification
- ⏳ `CategorySection.jsx` - Fix course cards, badges
- ⏳ `HeroSection.jsx` - Verify theme support
- ⏳ `TestimonialsSection.jsx` - Verify theme support

#### Profile Pages
- ⏳ `UserProfile.jsx` - Fix forms, cards, avatar

---

## 🔧 Phase 3: Frontend Architecture Improvements

### 3.1 Create API Service Layer
Create `frontend/src/services/api.js`:
```javascript
// Centralized API service with interceptors, error handling, caching
```

### 3.2 Create Custom Hooks
- `useApi.js` - Generic API hook with loading/error states
- `useCourses.js` - Course-specific operations
- `useAuth.js` - Enhanced authentication
- `useEnrollment.js` - Enrollment operations
- `useProgress.js` - Progress tracking
- `useCart.js` - Shopping cart logic
- `useWishlist.js` - Wishlist operations

### 3.3 Add Context Providers
- `EnrollmentContext.jsx` - Manage enrolled courses
- `CartContext.jsx` - Shopping cart state
- `WishlistContext.jsx` - Wishlist state
- `NotificationContext.jsx` - Toast notifications

### 3.4 Implement Error Boundaries
- Global error boundary
- Route-level error boundaries
- Component-level error recovery

---

## 📱 Phase 4: Feature Implementation

### 4.1 Student Dashboard
**Create:** `frontend/src/pages/student/Dashboard.jsx`
- Enrolled courses grid
- Continue learning section
- Progress statistics
- Certificates section
- Recommended courses
- Learning goals/streaks

### 4.2 Course Enrollment Flow
- Course detail page with enrollment button
- Cart/direct purchase flow
- Payment integration (Stripe)
- Confirmation page
- Email notifications

### 4.3 Progress Tracking
- Lecture completion tracking
- Section progress bars
- Course completion percentage
- Certificate generation
- Learning history

### 4.4 Review System
- Submit review after completion
- Star rating + comment
- Edit/delete own reviews
- Mark reviews as helpful
- Instructor responses

### 4.5 Instructor Analytics
- Revenue dashboard
- Student statistics
- Course performance metrics
- Review management
- Engagement analytics

### 4.6 Search & Discovery
- Full-text search
- Category filters
- Price range filters
- Level filters
- Rating filters
- Sort options
- Search suggestions

---

## 🔒 Phase 5: Security & Performance

### 5.1 Security Enhancements
- Rate limiting (express-rate-limit)
- Input sanitization (express-mongo-sanitize, xss-clean)
- Helmet.js for HTTP headers
- CORS configuration
- JWT refresh tokens
- API key for sensitive operations
- Request logging

### 5.2 Performance Optimizations
- React.lazy() for route-based code splitting
- Image optimization (next/image approach)
- API response caching
- Database query optimization
- CDN for static assets
- Compression middleware
- Bundle size analysis

### 5.3 Monitoring & Logging
- Winston for backend logging
- Error tracking (Sentry)
- Performance monitoring
- API analytics

---

## 📝 Phase 6: Testing & Documentation

### 6.1 Testing
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress/Playwright)
- API documentation (Swagger)

### 6.2 Documentation
- API documentation
- Component documentation (Storybook)
- User guides
- Deployment guide
- Contributing guide

---

## 🚀 Implementation Priority

### **Immediate (Week 1)**
1. ✅ Fix all auth pages theme inconsistencies
2. ✅ Create Enrollment, Review, Payment models
3. ✅ Fix instructor Courses page completely
4. ✅ Create student Dashboard page

### **Short-term (Week 2)**
1. Implement enrollment flow
2. Add payment integration
3. Create progress tracking
4. Fix CourseViewer with progress
5. Complete theme audit for all pages

### **Medium-term (Week 3-4)**
1. Add review system
2. Implement cart/wishlist
3. Create instructor analytics
4. Add search/filters
5. Optimize performance

### **Long-term (Month 2+)**
1. Add advanced features (certificates, gamification)
2. Implement admin panel
3. Add reporting/analytics
4. Mobile app (React Native)
5. Live classes integration

---

## 📈 Success Metrics

- ✅ All pages support dark/light theme seamlessly
- ✅ No hardcoded color classes (all use theme-aware)
- ✅ Database normalized (no embedded arrays >100 items)
- ✅ API response time <200ms (95th percentile)
- ✅ Test coverage >80%
- ✅ Lighthouse score >90
- ✅ Zero critical security vulnerabilities

---

## 🛠️ Tools & Dependencies to Add

### Backend
```json
{
  "express-rate-limit": "^7.1.5",
  "express-mongo-sanitize": "^2.2.0",
  "xss-clean": "^0.1.4",
  "helmet": "^7.1.0",
  "compression": "^1.7.4",
  "morgan": "^1.10.0",
  "winston": "^3.11.0",
  "stripe": "^14.10.0",
  "node-cron": "^3.0.3"
}
```

### Frontend
```json
{
  "react-query": "^3.39.3",
  "zustand": "^4.4.7",
  "react-hot-toast": "^2.4.1",
  "recharts": "^2.10.3",
  "date-fns": "^3.0.6",
  "react-icons": "^5.0.1",
  "@stripe/stripe-js": "^2.4.0",
  "@stripe/react-stripe-js": "^2.4.0"
}
```

---

## 📞 Next Steps

1. **Review this plan** and prioritize phases
2. **Start with Phase 1.1** - Create new models
3. **Move to Phase 2.1** - Fix theme system completely
4. **Implement Phase 4.1** - Build student dashboard
5. **Continue iteratively** through each phase

---

*Last Updated: November 8, 2025*
