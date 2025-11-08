# 🎓 Edemy - Complete Enrollment System Quick Reference

## 🌐 URL Routes

### Student Routes
| URL | Component | Purpose |
|-----|-----------|---------|
| `/courses` | CourseExplorer | Browse all published courses |
| `/courses/:courseId` | CourseDetails | View course details & enroll |
| `/courses/:courseId/learn` | CourseViewer | Watch lectures & track progress |
| `/dashboard` | Dashboard | Student dashboard (view enrolled courses) |

### Instructor Routes
| URL | Component | Purpose |
|-----|-----------|---------|
| `/instructor/courses` | Courses | View all created courses |
| `/instructor/courses/create` | CourseCreate | 3-step course creation wizard |
| `/instructor/dashboard` | Dashboard | Instructor analytics & stats |

---

## 🔌 API Endpoints

### Courses API
```javascript
// Public - No Auth Required
GET    /api/courses                    // List all published courses
GET    /api/courses/public/:id         // Get single course details
GET    /api/courses/featured           // Get featured courses
GET    /api/courses/categories         // Get all categories
GET    /api/courses/category/:category // Get courses by category

// Instructor - Auth + Role Required
GET    /api/courses/instructor         // Get instructor's courses
POST   /api/courses/instructor         // Create new course
GET    /api/courses/instructor/:id     // Get single instructor course
PUT    /api/courses/instructor/:id     // Update course
DELETE /api/courses/instructor/:id     // Delete course
PATCH  /api/courses/instructor/:id/status // Toggle course status
```

### Enrollments API
```javascript
// Student - Auth + Role Required
POST   /api/enrollments                     // Enroll in course
GET    /api/enrollments                     // Get my enrollments
GET    /api/enrollments/course/:courseId    // Check if enrolled
PUT    /api/enrollments/:id/progress        // Update progress
DELETE /api/enrollments/:id                 // Unenroll from course
```

---

## 📦 Request/Response Examples

### 1. Create Course (Instructor)
```javascript
POST /api/courses/instructor
Headers: { Cookie: 'auth token' }
Body: {
  "title": "Complete Web Development",
  "description": "Learn web development from scratch",
  "category": "Web Development",
  "price": 0,
  "level": "Beginner",
  "language": "English",
  "tags": ["html", "css", "javascript"],
  "learningOutcomes": [
    "Build responsive websites",
    "Understand JavaScript fundamentals"
  ],
  "prerequisites": ["Basic computer knowledge"],
  "sections": [
    {
      "title": "Introduction",
      "lectures": [
        {
          "title": "Welcome Video",
          "type": "video",
          "videoData": {
            "videoId": "dQw4w9WgXcQ",
            "platform": "youtube"
          },
          "duration": 10,
          "description": "Course overview"
        }
      ]
    }
  ]
}

Response: {
  "success": true,
  "message": "Course created successfully",
  "data": { /* course object */ }
}
```

### 2. Browse Courses (Student)
```javascript
GET /api/courses?category=Web Development&search=react&page=1&limit=12

Response: {
  "success": true,
  "data": [
    {
      "_id": "course123",
      "title": "React Complete Guide",
      "instructor": {
        "name": "John Doe",
        "avatar": "url"
      },
      "price": 0,
      "averageRating": 4.5,
      "totalEnrollments": 150,
      "status": "published"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get Course Details (Student)
```javascript
GET /api/courses/public/course123

Response: {
  "success": true,
  "data": {
    "_id": "course123",
    "title": "React Complete Guide",
    "description": "Full course description...",
    "instructor": { "name": "John Doe", "_id": "inst123" },
    "price": 0,
    "sections": [
      {
        "title": "Getting Started",
        "lectures": [
          {
            "title": "Introduction to React",
            "type": "video",
            "videoData": { "videoId": "xyz123", "platform": "youtube" },
            "duration": 15
          }
        ]
      }
    ],
    "learningOutcomes": ["Build React apps", "Use hooks"],
    "prerequisites": ["JavaScript knowledge"],
    "status": "published",
    "studentCount": 150
  }
}
```

### 4. Enroll in Course (Student)
```javascript
POST /api/enrollments
Headers: { Cookie: 'auth token', Content-Type: 'application/json' }
Body: { "courseId": "course123" }

Response: {
  "success": true,
  "message": "Successfully enrolled in the course",
  "enrollment": {
    "_id": "enroll123",
    "student": "student456",
    "course": "course123",
    "instructor": "inst123",
    "enrolledAt": "2024-01-15T10:30:00Z",
    "status": "active"
  }
}
```

### 5. Check Enrollment Status (Student)
```javascript
GET /api/enrollments/course/course123
Headers: { Cookie: 'auth token' }

Response: {
  "success": true,
  "data": {
    "_id": "enroll123",
    "student": "student456",
    "course": "course123",
    "progress": 25.5,
    "status": "active"
  }
}
// Or if not enrolled:
Response: {
  "success": true,
  "data": null
}
```

---

## 🔐 Authentication Flow

### Login
```javascript
POST /api/auth/login
Body: {
  "email": "student@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "student@example.com",
    "role": "student"
  }
}
// Token stored in httpOnly cookie
```

### Protected Routes
All enrollment and instructor routes require:
1. Valid JWT token in cookie
2. Correct user role (student for enrollments, instructor for course management)

---

## 💾 Data Flow

### Course Creation Flow
```
Instructor Form Input
      ↓
Step 1 & 2: saveProgress() → localStorage
      ↓
Step 3: saveCourse() → POST /api/courses/instructor
      ↓
courseController.createCourse()
      ↓
Save to MongoDB (Course collection)
      ↓
Redirect to /instructor/courses
```

### Enrollment Flow
```
Student Clicks "Enroll Now"
      ↓
Check Authentication → Redirect to /login if not logged in
      ↓
POST /api/enrollments { courseId }
      ↓
enrollmentController.enrollCourse()
      ↓
Validate:
  - Course exists & published
  - Not already enrolled
  - Student is not instructor
  - Free course or payment valid
      ↓
Create Enrollment Record in MongoDB
      ↓
Increment course.studentCount
      ↓
Redirect to /courses/:courseId/learn
```

### Learning Flow
```
CourseViewer Loads
      ↓
Fetch Course from GET /api/courses/public/:id
      ↓
Load Progress from localStorage
      ↓
Display First Lecture
      ↓
Student Watches Video (YouTubeVideoPlayer)
      ↓
Click "Mark Complete"
      ↓
Add to completedLectures Set
      ↓
Save to localStorage
      ↓
Update Progress Bar
      ↓
Click "Next" → Load Next Lecture
```

---

## 🎨 Component Hierarchy

```
App.jsx
├── AuthContext (user, role, isAuthenticated)
├── ThemeContext (isDarkMode, toggleTheme)
└── Routes
    ├── / → LandingPage
    ├── /login → Login
    ├── /signup → Signup
    ├── /dashboard → Dashboard (role-based redirect)
    │
    ├── /courses → CourseExplorer
    │   ├── Header
    │   ├── Search & Filters
    │   ├── Course Cards (Link to /courses/:id)
    │   └── Footer
    │
    ├── /courses/:courseId → CourseDetails
    │   ├── Header
    │   ├── Hero Section (title, instructor, rating)
    │   ├── Sticky Price Card
    │   │   └── Enroll Button → handleEnroll()
    │   ├── Course Content
    │   │   ├── Description
    │   │   ├── Learning Outcomes
    │   │   ├── Curriculum (collapsible sections)
    │   │   └── Requirements
    │   └── Footer
    │
    ├── /courses/:courseId/learn → CourseViewer
    │   ├── Header
    │   ├── Sidebar (toggleable)
    │   │   ├── Course Title
    │   │   ├── Progress Bar
    │   │   └── Section List
    │   │       └── Lecture List (with completion icons)
    │   └── Main Content
    │       ├── YouTubeVideoPlayer
    │       └── Lecture Info
    │           ├── Title & Description
    │           └── Navigation (Prev, Mark Complete, Next)
    │
    ├── /instructor/courses → Courses
    │   ├── Header
    │   ├── Course Table
    │   │   ├── Thumbnail
    │   │   ├── Title
    │   │   ├── Status Badge
    │   │   ├── Stats (students, revenue)
    │   │   └── Actions (View, Edit, Delete)
    │   └── "Create New Course" Button
    │
    └── /instructor/courses/create → CourseCreate
        ├── Header
        ├── Stepper (3 steps)
        └── Step Content
            ├── Step 1: Outcomes & Prerequisites
            ├── Step 2: Sections & Lectures
            └── Step 3: Course Details & Publish
```

---

## 🗄️ MongoDB Collections

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (enum: student, instructor, admin),
  avatar: String,
  createdAt: Date
}
```

### courses
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructor: ObjectId (ref: User),
  category: String,
  price: Number,
  isFree: Boolean,
  level: String,
  language: String,
  tags: [String],
  learningOutcomes: [String],
  prerequisites: [String],
  sections: [{
    title: String,
    lectures: [{
      title: String,
      type: String,
      videoData: { videoId: String, platform: String },
      duration: Number,
      description: String
    }]
  }],
  status: String (enum: draft, published, archived),
  studentCount: Number,
  averageRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### enrollments
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  instructor: ObjectId (ref: User),
  enrolledAt: Date,
  completedAt: Date,
  progress: Number (0-100),
  status: String (enum: active, completed, dropped),
  lastAccessedAt: Date
}
```

---

## 🎯 Key Features

### ✅ Implemented
- [x] Course creation wizard (3 steps)
- [x] Local progress save (Steps 1-2)
- [x] Backend course save (Step 3)
- [x] Instructor courses list
- [x] Course explorer with filters
- [x] Course details page
- [x] Free course enrollment
- [x] Course viewer with YouTube player
- [x] Progress tracking (localStorage)
- [x] Mark lectures complete
- [x] Navigate between lectures
- [x] Dark theme throughout
- [x] Responsive design

### 🚧 Future Enhancements
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Student dashboard with enrolled courses
- [ ] Progress saved to backend (not just localStorage)
- [ ] Course reviews & ratings
- [ ] Course certificates
- [ ] Video resume from last position
- [ ] Quiz/assessment integration
- [ ] Discussion forum per course
- [ ] Instructor analytics dashboard

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Course not showing in explorer | Ensure status is "published" in MongoDB |
| Can't enroll in course | Verify user is logged in as student |
| Video not loading | Check YouTube video ID, ensure video is public/embeddable |
| Progress not saving | Check localStorage is enabled, verify courseId |
| Enrollment fails | Ensure course exists and user is not already enrolled |
| API 404 errors | Verify backend routes are registered in server.js |

---

## 📚 File Structure Summary

```
backend/
├── controllers/
│   ├── courseController.js (17 methods)
│   └── enrollmentController.js (6 methods)
├── routes/
│   ├── courses.js (9 endpoints)
│   └── enrollments.js (5 endpoints) ✅ NEW
├── models/
│   ├── Course.js
│   ├── Enrollment.js
│   └── User.js
└── server.js (routes registered) ✅ UPDATED

frontend/src/
├── pages/
│   ├── courses/
│   │   ├── CourseExplorer.jsx ✅ UPDATED (Link added)
│   │   ├── CourseDetails.jsx ✅ NEW (534 lines)
│   │   ├── CourseViewer.jsx ✅ UPDATED (API endpoint)
│   │   └── index.jsx ✅ UPDATED (route added)
│   └── instructor/
│       ├── Courses.jsx (instructor course list)
│       └── CourseCreate.jsx (3-step wizard)
└── components/
    └── common/
        └── YouTubeVideoPlayer.jsx ✅ VERIFIED
```

---

## 🚀 Quick Start Testing

1. **Start MongoDB**: `mongod`
2. **Start Backend**: `cd backend && npm start`
3. **Start Frontend**: `cd frontend && npm start`
4. **Create Test Course**:
   - Login as instructor
   - Go to `/instructor/courses/create`
   - Add outcomes, sections, lectures
   - Publish course
5. **Test Enrollment**:
   - Login as student
   - Go to `/courses`
   - Click course card
   - Click "Enroll Now"
   - Redirected to `/courses/:id/learn`
6. **Watch Lectures**:
   - Video loads automatically
   - Click "Mark Complete"
   - Navigate to next lecture
   - See progress bar update

---

## 📞 Support

For detailed testing scenarios, see **ENROLLMENT_FLOW_COMPLETE.md**

**System Status**: ✅ Fully Implemented & Ready to Test

**Last Updated**: January 2024
