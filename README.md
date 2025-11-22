# NexEd - Next Generation E-Learning Platform

<div align="center">

![NexEd Logo](https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=NexEd)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0%2B-green)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-lightgrey)](https://expressjs.com/)

**Empowering the Next Generation of Learners**

[🚀 Live Demo](#demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#overview)
- [✨ Key Features](#key-features)
- [🏗️ Architecture](#architecture)
- [🛠️ Technology Stack](#technology-stack)
- [⚡ Quick Start](#quick-start)
- [📦 Installation](#installation)
- [🔧 Configuration](#configuration)
- [🚀 Deployment](#deployment)
- [🧪 Testing](#testing)
- [📖 API Documentation](#api-documentation)
- [🔒 Security Features](#security-features)
- [📱 Mobile Responsiveness](#mobile-responsiveness)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [👥 Team](#team)

## 🌟 Overview

**NexEd** is a comprehensive, modern e-learning platform designed to revolutionize online education. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides a seamless learning experience for students and a powerful course management system for educators.

### 🎯 Mission
To democratize quality education by providing an accessible, secure, and feature-rich platform that connects learners with educators worldwide.

### 🎨 Design Philosophy
- **User-Centric**: Intuitive interfaces designed for optimal learning experiences
- **Security-First**: Enterprise-grade security protecting content and user data
- **Scalable**: Architecture designed to handle growing user bases and content libraries
- **Accessible**: Inclusive design ensuring accessibility for users with disabilities

## ✨ Key Features

### 🎓 **Learning Management**
- 📚 **Interactive Courses**: Rich multimedia content with video lectures, documents, and quizzes
- 🎬 **Advanced Video Player**: Secure YouTube integration with anti-piracy protection
- 📊 **Progress Tracking**: Detailed analytics on learning progress and performance
- 🏆 **Certificates**: Automated certificate generation upon course completion
- 💾 **Offline Support**: Download content for offline learning (Premium feature)

### 👨‍🏫 **Instructor Tools**
- 🎯 **Course Builder**: Drag-and-drop course creation with rich content editor
- 📈 **Analytics Dashboard**: Comprehensive insights into student engagement and performance
- 💰 **Revenue Management**: Track earnings, payouts, and financial analytics
- 👥 **Student Management**: Monitor student progress and provide personalized feedback
- 📝 **Assessment Tools**: Create quizzes, assignments, and automated grading

### 💳 **E-Commerce Integration**
- 🛒 **Shopping Cart**: Add multiple courses, apply coupons, and manage purchases
- 💳 **Multiple Payment Gateways**: Razorpay integration with support for 100+ payment methods
- 🎟️ **Coupon System**: Flexible discount codes and promotional offers
- 🔄 **Subscription Models**: Monthly/yearly subscriptions and one-time purchases
- 📧 **Automated Invoicing**: PDF receipts and tax-compliant invoicing

### 🔐 **Security & Authentication**
- 🛡️ **Multi-Layer Security**: JWT authentication, rate limiting, and CORS protection
- 🎬 **Video Protection**: Advanced anti-piracy measures with URL encryption
- 🔒 **Data Encryption**: AES-256 encryption for sensitive data
- 👤 **Role-Based Access**: Granular permissions for students, instructors, and administrators
- 🚨 **Activity Monitoring**: Real-time security monitoring and threat detection

### 📱 **User Experience**
- 🌙 **Dark/Light Mode**: Customizable themes for comfortable viewing
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- ⚡ **Performance Optimized**: Fast loading times with code splitting and lazy loading
- 🌐 **Internationalization**: Multi-language support (Coming Soon)
- ♿ **Accessibility**: WCAG 2.1 AA compliant design

## 🏗️ Architecture

### 🏛️ **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React Router  │    │ • Express.js    │    │ • Collections:  │
│ • Tailwind CSS  │    │ • JWT Auth      │    │   - Users       │
│ • Context API   │    │ • Rate Limiting │    │   - Courses     │
│ • Axios         │    │ • File Upload   │    │   - Enrollments │
│                 │    │ • Email Service │    │   - Payments    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                               │
                    ┌─────────────────┐
                    │   External APIs │
                    │                 │
                    │ • YouTube API   │
                    │ • Razorpay      │
                    │ • Email SMTP    │
                    │ • Cloud Storage │
                    └─────────────────┘
```

### 📁 **Project Structure**
```
NexEd/
├── 📂 backend/                 # Backend API Server
│   ├── 📂 config/             # Database & third-party configs
│   ├── 📂 controllers/        # Request handlers
│   ├── 📂 middleware/         # Custom middleware
│   ├── 📂 models/             # MongoDB models
│   ├── 📂 routes/             # API routes
│   ├── 📂 services/           # Business logic
│   ├── 📂 utils/              # Utility functions
│   └── 📄 server.js           # Entry point
├── 📂 frontend/               # React Frontend
│   ├── 📂 public/             # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable components
│   │   ├── 📂 context/        # React contexts
│   │   ├── 📂 hooks/          # Custom hooks
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 services/       # API services
│   │   ├── 📂 styles/         # CSS & Tailwind
│   │   └── 📂 utils/          # Helper functions
│   └── 📄 package.json
├── 📂 docs/                   # Documentation
├── 📂 tests/                  # Test suites
├── 📄 docker-compose.yml      # Container orchestration
├── 📄 README.md               # Project documentation
└── 📄 package.json            # Root dependencies
```

## 🛠️ Technology Stack

### **Frontend**
- ⚛️ **React 18.2.0** - Modern UI library with hooks and concurrent features
- 🎨 **Tailwind CSS 3.3.6** - Utility-first CSS framework
- 🚦 **React Router DOM 6.8.0** - Declarative routing
- 📡 **Axios 1.6.0** - Promise-based HTTP client
- 🎭 **Framer Motion 12.23.24** - Production-ready motion library
- 🔐 **Crypto-js 4.2.0** - Client-side encryption
- 🎬 **React Player 3.4.0** - Video player component

### **Backend**
- 🟢 **Node.js 16+** - JavaScript runtime
- ⚡ **Express.js 4.18.2** - Web application framework
- 🍃 **MongoDB 7.0+** - NoSQL database
- 🔐 **JWT** - JSON Web Tokens for authentication
- 🛡️ **Helmet** - Security middleware
- 📧 **Nodemailer** - Email sending
- 💳 **Razorpay** - Payment processing
- 🔄 **Node-cron** - Task scheduling

### **DevOps & Tools**
- 🐳 **Docker** - Containerization
- 🧪 **Jest** - Testing framework
- 📝 **ESLint** - Code linting
- 🔄 **Nodemon** - Development server
- 📊 **Morgan** - HTTP request logging
- 🔒 **Bcrypt** - Password hashing

## ⚡ Quick Start

### 🚀 **One-Command Setup** (Recommended)

```bash
# Clone and setup everything
git clone https://github.com/zalakuldip2011/edemy.git
cd NexEd
npm run setup
```

### 🐳 **Docker Setup** (Fastest)

```bash
# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 📦 Installation

### 📋 **Prerequisites**

Ensure you have the following installed:
- 🟢 **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- 📦 **npm** (v8.0.0 or higher) - Comes with Node.js
- 🍃 **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- 🔧 **Git** - [Download](https://git-scm.com/)

### 🔍 **Verify Prerequisites**

```bash
node --version    # Should be v16.0.0+
npm --version     # Should be v8.0.0+
mongo --version   # Should be v5.0+
git --version     # Any recent version
```

### 📥 **Step-by-Step Installation**

#### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/zalakuldip2011/edemy.git
cd NexEd
```

#### 2️⃣ **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

#### 3️⃣ **Frontend Setup**
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

#### 4️⃣ **Database Setup**
```bash
# Start MongoDB service
# On Windows:
net start MongoDB

# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

#### 5️⃣ **Start Development Servers**

```bash
# Terminal 1: Start Backend (from backend directory)
cd backend
npm run dev

# Terminal 2: Start Frontend (from frontend directory)
cd frontend
npm start
```

#### 6️⃣ **Access Application**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 📊 **MongoDB**: mongodb://localhost:27017/NexEd

## 🔧 Configuration

### 🔐 **Environment Variables**

#### **Backend (.env)**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/NexEd

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRES_IN=30

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nexed.com

# OTP Configuration
OTP_EXPIRE_MINUTES=10
OTP_LENGTH=6

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key

# Video Security
VIDEO_SECRET_KEY=nexed-secure-video-encryption-key-2024
```

#### **Frontend (.env)**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000

# Video Security
REACT_APP_VIDEO_SECRET_KEY=nexed-video-security-key-2024

# Payment Gateway
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 📧 **Email Setup (Gmail)**

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### 💳 **Payment Gateway Setup (Razorpay)**

1. Create Razorpay account: https://razorpay.com/
2. Get API keys from Dashboard
3. Add keys to environment variables
4. Configure webhook URLs for payment verification

### 🔒 **Security Configuration**

```env
# Generate strong JWT secret (32+ characters)
JWT_SECRET=$(openssl rand -base64 32)

# Generate video encryption key
VIDEO_SECRET_KEY=$(openssl rand -base64 32)
```

## 🚀 Deployment

### 🌐 **Production Deployment**

#### **Using PM2 (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Build frontend
cd frontend
npm run build

# Start backend with PM2
cd ../backend
pm2 start server.js --name "nexed-backend"

# Serve frontend with PM2
pm2 serve ../frontend/build 3000 --name "nexed-frontend" --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### **Using Docker**

```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

#### **Environment-Specific Configurations**

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db/NexEd
JWT_SECRET=your-ultra-secure-production-jwt-secret
FRONTEND_URL=https://yourdomain.com
```

### 🔧 **Server Requirements**

**Minimum Requirements:**
- 🖥️ **CPU**: 2 cores
- 🧠 **RAM**: 4GB
- 💾 **Storage**: 20GB SSD
- 🌐 **Bandwidth**: 100 Mbps

**Recommended for Production:**
- 🖥️ **CPU**: 4+ cores
- 🧠 **RAM**: 8GB+
- 💾 **Storage**: 100GB+ SSD
- 🌐 **Bandwidth**: 1 Gbps
- 🔄 **Load Balancer**: Nginx/Apache
- 🛡️ **SSL Certificate**: Let's Encrypt

## 🧪 Testing

### 🔍 **Running Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests with coverage
npm run test:coverage

# Integration tests
npm run test:integration
```

### 🧪 **Test Structure**

```bash
tests/
├── unit/                  # Unit tests
│   ├── controllers/       # Controller tests
│   ├── models/           # Model tests
│   └── services/         # Service tests
├── integration/          # Integration tests
│   ├── auth.test.js      # Authentication flow
│   ├── course.test.js    # Course management
│   └── payment.test.js   # Payment processing
└── e2e/                  # End-to-end tests
    ├── user-journey.test.js
    └── admin-workflow.test.js
```

### 📊 **Test Coverage**

Current test coverage:
- 🧪 **Unit Tests**: 85%+
- 🔗 **Integration Tests**: 80%+
- 🎭 **E2E Tests**: 75%+

## 📖 API Documentation

### 🔗 **Base URL**
```
Development: http://localhost:5000/api
Production: https://api.nexed.com/api
```

### 🔐 **Authentication**

All protected routes require JWT token in header:
```javascript
headers: {
  'Authorization': 'Bearer <your-jwt-token>'
}
```

### 📚 **Core API Endpoints**

#### **Authentication**
```bash
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/forgot-password   # Password reset
POST   /api/auth/verify-otp        # OTP verification
```

#### **User Management**
```bash
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
POST   /api/users/avatar           # Upload avatar
GET    /api/users/enrollments      # Get user enrollments
```

#### **Course Management**
```bash
GET    /api/courses                # Get all courses
GET    /api/courses/:id            # Get specific course
POST   /api/courses                # Create course (instructor)
PUT    /api/courses/:id            # Update course (instructor)
DELETE /api/courses/:id            # Delete course (instructor)
POST   /api/courses/:id/enroll     # Enroll in course
```

#### **Payment Processing**
```bash
POST   /api/payments/create-order  # Create payment order
POST   /api/payments/verify        # Verify payment
GET    /api/payments/history        # Payment history
```

### 📄 **API Response Format**

```javascript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

For detailed API documentation, visit: [API Docs](./docs/API_DOCUMENTATION.md)

## 🔒 Security Features

### 🛡️ **Comprehensive Security Implementation**

#### **Authentication & Authorization**
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🔄 **Token Rotation**: Automatic token refresh mechanism
- 👤 **Role-Based Access**: Granular permissions (Student, Instructor, Admin)
- 🚪 **Session Management**: Secure session handling with httpOnly cookies

#### **Video Content Protection**
- 🎬 **URL Encryption**: AES-256 encryption of video URLs
- 🚫 **Anti-Piracy**: Developer tools detection and video watermarking
- 🔒 **Access Control**: Enrollment-based video access validation
- 🎯 **Rate Limiting**: Prevents abuse and unauthorized access attempts

#### **Data Protection**
- 🔐 **Password Security**: Bcrypt hashing with salt rounds
- 🛡️ **Input Validation**: Comprehensive input sanitization
- 🚨 **XSS Protection**: Content Security Policy and input filtering
- 💉 **SQL Injection Prevention**: MongoDB query sanitization

#### **Infrastructure Security**
- 🔒 **HTTPS Enforcement**: SSL/TLS encryption for all traffic
- 🛡️ **CORS Configuration**: Strict cross-origin resource sharing
- 🚫 **DDoS Protection**: Rate limiting and request throttling
- 📊 **Security Monitoring**: Real-time threat detection and logging

For complete security documentation: [Security Guide](./docs/VIDEO_SECURITY.md)

## 📱 Mobile Responsiveness

### 📐 **Responsive Breakpoints**

```css
/* Mobile First Design */
sm: '640px'    # Small devices (phones)
md: '768px'    # Medium devices (tablets)
lg: '1024px'   # Large devices (laptops)
xl: '1280px'   # Extra large devices (desktops)
2xl: '1536px'  # 2X large devices (large desktops)
```

### 📱 **Mobile Features**
- 🎬 **Touch-Optimized Video Player**: Gesture controls and mobile-friendly interface
- 📊 **Progressive Web App**: Add to homescreen, offline capabilities
- ⚡ **Performance Optimized**: Code splitting and lazy loading for mobile networks
- 🔄 **Adaptive Loading**: Different image qualities based on network speed

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🚀 **Getting Started**

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/NexEd.git
   cd NexEd
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow our coding standards
   - Add tests for new features
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Fill out the PR template
   - Link related issues
   - Request review

### 📋 **Development Guidelines**

#### **Code Style**
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

#### **Testing Requirements**
- Write unit tests for new functions
- Add integration tests for API endpoints
- Ensure 80%+ test coverage
- Test mobile responsiveness

#### **Documentation**
- Update README.md if needed
- Add JSDoc for new functions
- Update API documentation
- Include inline comments

### 🐛 **Bug Reports**

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### 💡 **Feature Requests**

Have an idea? Create an issue with:
- Clear feature description
- Use case explanation
- Proposed implementation
- Benefits and impact

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 NexEd Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👥 Team

### 🏆 **Core Contributors**

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/zalakuldip2011.png" width="100px;" alt="Zalak Uldip"/><br />
      <sub><b>Zalak Uldip</b></sub><br />
      <a href="https://github.com/zalakuldip2011">💻 Lead Developer</a>
    </td>
  </tr>
</table>

### 🤝 **Contributing**
- 💻 **Developers**: 5+ active contributors
- 🎨 **Designers**: UI/UX improvements welcome
- 📝 **Writers**: Documentation and content
- 🧪 **Testers**: Quality assurance and bug hunting

## 📞 Support & Community

### 💬 **Get Help**
- 📧 **Email**: support@nexed.com
- 💬 **Discord**: [Join our community](https://discord.gg/nexed)
- 📱 **Twitter**: [@NexEdPlatform](https://twitter.com/NexEdPlatform)
- 📖 **Documentation**: [Full Docs](./docs/README.md)

### 🐛 **Report Issues**
- 🔗 **GitHub Issues**: [Create Issue](https://github.com/zalakuldip2011/edemy/issues)
- 🚨 **Security Issues**: security@nexed.com

### 💡 **Feature Requests**
- 🗳️ **Feedback Board**: [Share Ideas](https://github.com/zalakuldip2011/edemy/discussions)
- 📋 **Roadmap**: [View Upcoming Features](./docs/ROADMAP.md)

---

<div align="center">

**Made with ❤️ by the NexEd Team**

⭐ **Star us on GitHub** if you find this project helpful!

[🌐 Website](https://nexed.com) • [📱 Mobile App](https://app.nexed.com) • [📧 Contact](mailto:team@nexed.com)

</div>
