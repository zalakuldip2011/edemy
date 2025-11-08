# MongoDB Local Setup Guide for Edemy

## ✅ Your Current Setup

Your Edemy backend is **already configured** to use MongoDB locally:

- **MongoDB URI**: `mongodb://localhost:27017/edemy`
- **Database Name**: `edemy`
- **Models**: Course, User, Enrollment, Review, Payment (all set up)

## 🚀 Steps to Run

### 1. **Make Sure MongoDB is Running Locally**

#### Windows:
```bash
# Check if MongoDB service is running
net start MongoDB

# If not running, start it
mongod --dbpath="C:\Program Files\MongoDB\Server\<version>\data"
```

#### Mac/Linux:
```bash
# Start MongoDB
brew services start mongodb-community

# Or manually:
mongod --dbpath=/usr/local/var/mongodb
```

### 2. **Start the Backend Server**

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### 3. **Verify Connection**

Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "success": true,
  "status": "OK",
  "database": "connected"
}
```

## 📊 MongoDB Models Already Created

### 1. **Course Model** (`backend/models/Course.js`)
```javascript
- title, subtitle, description
- instructor (ref to User)
- category, level, language
- price, discount
- sections[] with lectures[]
- learningOutcomes[], requirements[]
- enrollments[], reviews[]
- averageRating, totalEnrollments
- status: 'draft' | 'published' | 'archived'
```

### 2. **User Model** (`backend/models/User.js`)
```javascript
- name, email, password
- role: 'student' | 'instructor' | 'admin'
- enrolledCourses[]
- instructorProfile {}
```

### 3. **Enrollment Model** (`backend/models/Enrollment.js`)
```javascript
- student (ref to User)
- course (ref to Course)
- progress, completedLectures[]
- enrolledAt, lastAccessedAt
```

### 4. **Review Model** (`backend/models/Review.js`)
```javascript
- student (ref to User)
- course (ref to Course)
- rating (1-5)
- comment
```

### 5. **Payment Model** (`backend/models/Payment.js`)
```javascript
- user (ref to User)
- course (ref to Course)
- amount, currency
- status: 'pending' | 'completed' | 'failed'
- paymentMethod
```

## 🔧 API Endpoints Ready to Use

### **Course Creation** (What you're using now)
```
POST /api/courses/instructor
Headers: Cookie with JWT token
Body: {
  title, subtitle, description,
  category, level, language,
  learningOutcomes[], requirements[],
  sections[], status: 'draft' | 'published'
}
```

### **Other Course Endpoints**
```
GET    /api/courses              - Get all published courses
GET    /api/courses/:id          - Get single course
GET    /api/courses/instructor   - Get instructor's courses
PUT    /api/courses/:id          - Update course
DELETE /api/courses/:id          - Delete course
```

## 🗄️ View Your Data in MongoDB

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `edemy`
4. Collections: `courses`, `users`, `enrollments`, etc.

### Using Mongo Shell:
```bash
# Connect to MongoDB
mongosh

# Switch to edemy database
use edemy

# View all courses
db.courses.find().pretty()

# View all users
db.users.find().pretty()

# Count documents
db.courses.countDocuments()

# Find courses by instructor
db.courses.find({ instructor: ObjectId("your-user-id") }).pretty()
```

## 🧪 Test Course Creation

### From the Frontend:
1. Go to: `http://localhost:3000/instructor/courses/create`
2. Fill in Step 1 (Plan Your Course)
3. Fill in Step 2 (Create Content)
4. Fill in Step 3 (Publish Course)
5. Click "Save Draft" or "Publish"

### Verify in MongoDB:
```bash
mongosh
use edemy
db.courses.find().pretty()
```

## 📝 What Happens When You Create a Course

1. **Frontend** sends POST request to `/api/courses/instructor`
2. **Backend** receives data in `courseController.createCourse()`
3. **Mongoose** validates data against `Course` model schema
4. **MongoDB** stores the course document in `edemy.courses` collection
5. **Response** sent back with created course data

## 🛠️ Troubleshooting

### Error: "MongoDB connection failed"
```bash
# Make sure MongoDB is running
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

### Error: "Path `title` is required"
- ✅ Already fixed! Step 1 & 2 now save locally only
- Step 3 saves to MongoDB with all required fields

### Can't see data in MongoDB?
```bash
# Check database name
mongosh
show dbs
use edemy
show collections
db.courses.find()
```

## 🎯 Your Data is Being Saved To:

```
Computer: Your local machine
Database: MongoDB running on localhost:27017
Database Name: edemy
Collections:
  ├── courses
  ├── users
  ├── enrollments
  ├── reviews
  └── payments
```

## ✨ Everything is Ready!

Your Edemy backend is properly configured to:
- ✅ Connect to local MongoDB
- ✅ Use Mongoose models for data structure
- ✅ Validate data before saving
- ✅ Store all course data persistently
- ✅ Handle errors gracefully

Just make sure MongoDB is running, and you're good to go! 🚀
