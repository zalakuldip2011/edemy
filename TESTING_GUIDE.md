# Course Creation & Publishing - Testing Guide

## Overview
This guide will help you test the complete course creation flow from instructor dashboard to student landing page display.

## Prerequisites
- Backend server running on port 5000
- Frontend server running on port 3000
- MongoDB connected and running
- User account with instructor role

## Complete Test Flow

### Phase 1: Create & Publish a Course

#### Step 1: Login as Instructor
1. Navigate to `http://localhost:3000/login`
2. Login with instructor credentials
3. Verify you're redirected to instructor dashboard

#### Step 2: Start Course Creation
1. In instructor dashboard, click **"Create New Course"**
2. You should see 3-step wizard:
   - Step 1: Plan Your Course
   - Step 2: Create Your Content
   - Step 3: Publish Your Course

#### Step 3: Plan Your Course (Step 1)
**Required Fields:**
- Learning Outcomes (add at least 1, recommended 4+)
  - Example: "Build responsive websites with HTML/CSS"
  - Example: "Create interactive web apps with JavaScript"
  - Example: "Deploy websites to production"
  - Example: "Master modern web development tools"

**Optional Fields:**
- Target Audience: "Beginners who want to learn web development"
- Prerequisites: "Basic computer skills"

**Action:** Click "Continue" or "Save Progress"

✅ **Expected:** Should save and move to Step 2

#### Step 4: Create Content (Step 2)
**Add Section:**
1. Section Title: "Introduction to Web Development"
2. Section Description: "Learn the basics of web development"

**Add Lecture:**
1. Lecture Title: "What is Web Development?"
2. Lecture Description: "Overview of web development fundamentals"
3. **YouTube Video URL:** Paste any YouTube URL, for example:
   - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `https://youtu.be/dQw4w9WgXcQ`

**Verification:**
- ✅ Video thumbnail should appear after pasting URL
- ✅ "Add Lecture" button should be enabled

**Action:** Click "Add Lecture" then "Continue"

✅ **Expected:** Should save sections and move to Step 3

#### Step 5: Publish Course (Step 3)

**Basic Information (REQUIRED):**
1. **Course Title:** "Complete Web Development Bootcamp 2025"
2. **Course Description:** "Learn web development from scratch with hands-on projects. Master HTML, CSS, JavaScript, and modern frameworks."
3. **Category:** Select "Web Development"
4. **Course Level:** Select "Beginner"
5. **Language:** "English" (default)

**Publishing Settings (Optional):**
- Visibility: Public/Private
- Paid Course toggle: ON/OFF
- Price: $49.99 (if paid)
- Discount: 20% (optional)
- Course Features: Check all that apply

**Validation Check:**
The page should show either:
- ✅ Green box: "Your course is ready to be published!"
- ❌ Red box: List of missing required fields

**Actions:**
1. **Save as Draft:** Saves course but doesn't publish (no validation required)
2. **Publish Course:** Makes course live (validation required)

**Action:** Click **"Publish Course"**

✅ **Expected Results:**
- Alert: "Course published successfully!"
- Redirect to instructor courses page
- New course appears in your course list

---

### Phase 2: Verify Student Can See Course

#### Step 6: View as Student
**Option A - Logout:**
1. Logout from instructor account
2. Navigate to homepage `http://localhost:3000/`

**Option B - Incognito:**
1. Open new incognito/private window
2. Navigate to `http://localhost:3000/`

#### Step 7: Check Landing Page
**On the landing page, verify:**

1. **Category Section Appears**
   - Should see section titled "Web Development"
   - Course card should display your published course

2. **Course Card Shows:**
   - ✅ Course title: "Complete Web Development Bootcamp 2025"
   - ✅ Instructor name
   - ✅ Price: "$49.99" or "Free"
   - ✅ Rating: 0.0 (new course)
   - ✅ Enrollments: (0)
   - ✅ Course thumbnail (default if none uploaded)
   - ✅ "View Course" button

3. **Click on Course Card**
   - Should navigate to `/courses/[course-id]`
   - Course details page should load

---

## Debugging Checklist

### If Course Doesn't Appear on Landing Page:

#### 1. Check Browser Console (F12)
Look for console logs:
```
Fetching courses from /api/courses...
API Response: { success: true, data: { courses: [...] } }
Total courses fetched: X
Grouped courses: { "Web Development": [...] }
Categories array: [...]
```

**If you see "No courses found":**
- Course might not be published (check `isPublished: true`)
- Backend might not be returning the course

#### 2. Check Backend Console
Look for logs when publishing:
```
Received course data: { title: '...', ... }
Creating course with data: { ... }
Course saved successfully: [ObjectId]
```

**If you see validation errors:**
- Required fields might be missing
- Check error message for specific issues

#### 3. Verify Database
Open MongoDB and check:
```javascript
// In MongoDB shell or Compass
db.courses.find({ isPublished: true })
```

**Expected:**
- Should return your published course
- `isPublished: true`
- `status: 'published'`
- `publishedAt: [Date]`

#### 4. Test API Directly
Open browser and visit:
```
http://localhost:3000/api/courses
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "...",
        "title": "Complete Web Development Bootcamp 2025",
        "category": "Web Development",
        "isPublished": true,
        "instructor": {
          "name": "...",
          "profilePicture": "..."
        },
        ...
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Common Issues & Solutions

### Issue 1: "Error creating course"
**Cause:** Validation error or missing required fields
**Solution:** 
- Check backend console for specific error
- Ensure all required fields in Step 3 are filled
- Check that sections have `order` field

### Issue 2: Course saved but doesn't appear on landing page
**Cause:** Course saved as draft instead of published
**Solution:**
- Check database: `isPublished` should be `true`
- Re-publish the course from instructor dashboard
- Verify you clicked "Publish Course" not "Save as Draft"

### Issue 3: YouTube video not showing
**Cause:** Invalid URL or video is private
**Solution:**
- Use public or unlisted YouTube videos
- Verify URL format is correct
- Check that `videoData` object is saved in database

### Issue 4: "No Courses Available Yet" message
**Cause:** No published courses in database
**Solution:**
- Verify course was actually published (check database)
- Check that backend is running and connected to MongoDB
- Try creating another course

### Issue 5: Categories not grouping correctly
**Cause:** Category name mismatch
**Solution:**
- Ensure exact category name from dropdown is used
- Check database for category field value
- Categories are case-sensitive

---

## Test Data Examples

### Example Course 1: Web Development
```
Title: "Modern JavaScript Fundamentals"
Description: "Learn JavaScript from basics to advanced concepts"
Category: Web Development
Level: Beginner
Price: Free
YouTube: https://youtu.be/example1
```

### Example Course 2: Data Science
```
Title: "Python for Data Analysis"
Description: "Master data analysis with Python and Pandas"
Category: Data Science
Level: Intermediate
Price: $79.99
YouTube: https://youtu.be/example2
```

### Example Course 3: Design
```
Title: "UI/UX Design Masterclass"
Description: "Create beautiful user interfaces"
Category: Design
Level: All Levels
Price: $59.99
YouTube: https://youtu.be/example3
```

---

## Success Criteria

### ✅ Course Creation Successful When:
1. Can fill all 3 steps without errors
2. Course saves to database
3. Instructor can see course in their dashboard
4. Course has `isPublished: true` in database

### ✅ Student Display Successful When:
1. Course appears on landing page under correct category
2. Course card shows all correct information
3. Can click on course card to view details
4. YouTube video is embedded and playable

---

## Performance Checks

### Landing Page Load Time
- Should load within 2 seconds
- Course images should lazy load
- No console errors

### Course Creation Flow
- Each step should transition smoothly
- Auto-save to localStorage should work
- No data loss on page refresh

---

## Next Steps After Testing

1. **Create Multiple Courses** in different categories
2. **Test Filtering** in Course Explorer
3. **Test Search** functionality
4. **Test Enrollment** flow (when implemented)
5. **Test Course Viewing** with YouTube videos

---

**Last Updated:** November 7, 2025
**Status:** Ready for Testing ✅
