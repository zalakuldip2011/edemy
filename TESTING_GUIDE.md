# 🧪 Testing Guide - Cart & Wishlist Features

## 📋 Pre-Testing Setup

### 1. Start Backend Server
```cmd
cd backend
npm run dev
```
Should see: `✅ Server running on port 5000`

### 2. Start Frontend Server
```cmd
cd frontend
npm start
```
Should open browser at: `http://localhost:3000`

### 3. Login/Signup
- Make sure you're logged in
- Have a valid JWT token in localStorage

---

## 🧪 Test Cases

### ✅ Test 1: Full Name Display
**Location:** Dashboard (`/dashboard`)

**Steps:**
1. Navigate to dashboard
2. Look at welcome message

**Expected Result:**
- Shows: `Welcome back, [First Name] [Last Name]!`
- If only first name available: `Welcome back, [First Name]!`
- Fallback: `Welcome back, [Username]!`

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 2: Wishlist Icon on Course Cards
**Location:** Homepage (`/`) - Personalized Courses Section

**Steps:**
1. Scroll to "Recommended for You" section
2. Find heart icon on course thumbnail (top-left)
3. Click heart icon

**Expected Result:**
- **Before click:** Empty heart outline (gray/white)
- **After click:** Solid red heart ❤️
- Alert/notification: "Added to wishlist!"
- **On re-click:** Heart becomes empty outline again
- Alert/notification: "Removed from wishlist!"

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 3: FREE Badge Display
**Location:** Homepage (`/`) - Personalized Courses Section

**Steps:**
1. Find a course with `price: 0`
2. Look at bottom-right of thumbnail

**Expected Result:**
- Green badge with "FREE" text visible
- No price shown in button area
- Single button: "Enroll Now - FREE" (green)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 4: Paid Course Buttons
**Location:** Homepage (`/`) - Personalized Courses Section

**Steps:**
1. Find a course with `price > 0`
2. Look at course card buttons

**Expected Result:**
- **NO "FREE" badge**
- Price displayed: `$XX.XX`
- **Two buttons:**
  1. "🛒 Add to Cart" (purple)
  2. "Buy Now" (blue)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 5: Add to Cart Functionality
**Location:** Homepage course cards

**Steps:**
1. Find a PAID course
2. Click "Add to Cart" button
3. Wait for confirmation

**Expected Result:**
- Button shows spinner: "Adding..."
- Success alert: "Course added to cart!"
- Cart icon in header shows updated count
- Button returns to normal

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 6: Cart Page Display
**Location:** `/cart`

**Steps:**
1. Add 2-3 courses to cart
2. Navigate to `/cart` page

**Expected Result:**
- Shows all cart items with:
  - Course thumbnail
  - Course title
  - Instructor name
  - Level badge
  - Price
  - Remove button
- Order summary sidebar shows:
  - Subtotal
  - Tax (currently $0.00)
  - Total price (bold blue)
  - "Proceed to Checkout" button
- Promo code input field

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 7: Remove from Cart
**Location:** `/cart`

**Steps:**
1. Go to cart page with items
2. Click "Remove" button on any course
3. Wait for update

**Expected Result:**
- Item disappears from list
- Total price updates automatically
- Cart count in header decreases
- If last item removed → shows empty state

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 8: Clear Cart
**Location:** `/cart`

**Steps:**
1. Go to cart page with multiple items
2. Click "Clear Cart" button (top-right)
3. Confirm in dialog

**Expected Result:**
- Confirmation dialog: "Are you sure?"
- After confirming: All items removed
- Shows empty state with:
  - "Your Cart is Empty" message
  - "Browse Courses" button
  - Features section (3 cards)
  - Promo banner

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 9: Wishlist Page Display
**Location:** `/wishlist`

**Steps:**
1. Add 3-4 courses to wishlist
2. Navigate to `/wishlist` page

**Expected Result:**
- Grid layout (4 columns on desktop)
- Each course card shows:
  - Thumbnail
  - Solid red heart (top-left) with remove function
  - Level badge (top-right)
  - FREE badge (if free)
  - Course title, category, instructor
  - Rating and student count
  - Price (if paid)
  - Action buttons based on type

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 10: Remove from Wishlist
**Location:** `/wishlist`

**Steps:**
1. Go to wishlist page
2. Click red heart icon on any course
3. Wait for update

**Expected Result:**
- Course card disappears
- Wishlist count updates
- If last item → shows empty state

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 11: Add to Cart from Wishlist
**Location:** `/wishlist`

**Steps:**
1. Go to wishlist page
2. Find a PAID course
3. Click "Add to Cart" button

**Expected Result:**
- Button shows "Adding..." with spinner
- Success alert: "Course added to cart!"
- Course stays in wishlist
- Cart count in header increases

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 12: Enroll Free Course from Wishlist
**Location:** `/wishlist`

**Steps:**
1. Go to wishlist page
2. Find a FREE course
3. Click "Enroll Now - FREE" button

**Expected Result:**
- Redirects to enrollment page
- URL: `/courses/{courseId}/enroll`

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 13: Buy Now from Wishlist
**Location:** `/wishlist`

**Steps:**
1. Go to wishlist page
2. Find a PAID course
3. Click "Buy Now" button

**Expected Result:**
- Redirects to enrollment/checkout page
- URL: `/courses/{courseId}/enroll`

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 🔴 Error Handling Tests

### ✅ Test 14: Add Free Course to Cart
**Steps:**
1. Try to add a free course to cart via API

**Expected Result:**
- Error message: "Free courses cannot be added to cart"
- Course NOT added
- Shows alert with error

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 15: Add Already Enrolled Course
**Steps:**
1. Try to add a course you're enrolled in

**Expected Result:**
- Error message: "You are already enrolled in this course"
- Course NOT added to cart/wishlist
- Shows alert with error

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 16: Duplicate Cart Items
**Steps:**
1. Add course to cart
2. Try to add same course again

**Expected Result:**
- Error message: "Course already in cart"
- No duplicate added
- Shows alert with error

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 17: Duplicate Wishlist Items
**Steps:**
1. Add course to wishlist
2. Try to add same course again

**Expected Result:**
- Error message: "Course already in wishlist"
- No duplicate added
- Shows alert with error

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 18: Unauthorized Access
**Steps:**
1. Logout (remove token from localStorage)
2. Try to access `/cart` or `/wishlist`

**Expected Result:**
- Redirects to `/login` page
- No data fetched
- Shows login form

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 🎨 UI/UX Tests

### ✅ Test 19: Loading States
**Steps:**
1. Click any async button (Add to Cart, Toggle Wishlist)
2. Observe button state

**Expected Result:**
- Button shows spinner animation
- Button disabled during operation
- Text changes to "Adding..." / "Removing..."
- Opacity reduced (50%)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 20: Hover Effects
**Steps:**
1. Hover over course cards
2. Hover over buttons

**Expected Result:**
- Course cards: Scale up (105%), shadow increases
- Buttons: Background color darkens
- Heart icon: Transforms red on hover
- Smooth transitions (200-300ms)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 21: Responsive Design
**Steps:**
1. Resize browser window
2. Test on mobile (DevTools responsive mode)

**Expected Result:**
- Desktop (1200px+): 4 columns
- Tablet (768px-1199px): 2 columns
- Mobile (<768px): 1 column
- All elements readable and clickable

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 22: Dark Mode
**Steps:**
1. Toggle dark mode switch
2. Visit cart and wishlist pages

**Expected Result:**
- All backgrounds invert properly
- Text remains readable
- Borders visible
- Shadows adjusted
- No white flashes

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 🔍 API Tests (Using Browser DevTools)

### ✅ Test 23: GET /api/cart
```javascript
// Open DevTools Console
fetch('http://localhost:5000/api/cart', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "...",
      "user": "...",
      "items": [
        {
          "course": { /* course object */ },
          "price": 49.99,
          "addedAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "totalPrice": 49.99
    },
    "itemCount": 1
  }
}
```

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 24: POST /api/cart/:courseId
```javascript
// Add course to cart (replace COURSE_ID)
fetch('http://localhost:5000/api/cart/COURSE_ID', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Course added to cart successfully",
  "data": {
    "cart": { /* updated cart */ }
  }
}
```

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 25: GET /api/wishlist
```javascript
fetch('http://localhost:5000/api/wishlist', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "wishlist": {
      "_id": "...",
      "user": "...",
      "items": [
        {
          "course": { /* course object */ },
          "addedAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    },
    "itemCount": 1
  }
}
```

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 📊 Test Summary

### Quick Checklist:
- [ ] Full name displays correctly
- [ ] Wishlist heart icon toggles
- [ ] FREE badge shows on free courses
- [ ] Paid courses show 2 buttons
- [ ] Add to cart works
- [ ] Cart page displays items
- [ ] Remove from cart works
- [ ] Clear cart works
- [ ] Wishlist page displays items
- [ ] Remove from wishlist works
- [ ] Add to cart from wishlist works
- [ ] Enroll free course works
- [ ] Buy now redirects correctly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Hover effects work
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] API endpoints respond correctly

---

## 🐛 Bug Reporting Template

If you find a bug, report it with:

```markdown
### Bug: [Short Description]

**Location:** [Page/Component]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]
**Actual Result:** [What actually happens]
**Screenshots:** [If applicable]
**Console Errors:** [Copy from DevTools]
**Browser:** [Chrome/Firefox/Safari + Version]
```

---

## ✅ Success Criteria

All features are working correctly when:

1. ✅ All 25 test cases pass
2. ✅ No console errors in DevTools
3. ✅ No network errors (check Network tab)
4. ✅ Dark mode works on all pages
5. ✅ Mobile responsive on all screen sizes
6. ✅ Loading states provide feedback
7. ✅ Error messages are user-friendly
8. ✅ Data persists after page refresh
9. ✅ Authentication works correctly
10. ✅ UI matches design specifications

---

## 🚀 Next Steps After Testing

Once all tests pass:
1. Create Cart page checkout flow
2. Integrate payment gateway (Stripe/PayPal)
3. Add bulk operations (move all wishlist to cart)
4. Implement price drop notifications
5. Add sharing wishlist feature
6. Create gift course functionality

---

**Happy Testing! 🎉**
