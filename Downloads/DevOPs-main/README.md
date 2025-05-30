# 🎭 Performly - Performance Booking Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

## 📝 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Contributors](#-contributors)

## 🌟 Overview

Performly is a comprehensive platform that connects performers with clients, enabling seamless booking and management of performances. The platform facilitates the entire process from discovery to booking, payment, and review.

## ✨ Features

### 🎯 Core Features
- **User Management**
  - Secure authentication system
  - Profile management
  - Role-based access control

- **Performer Features**
  - Profile creation and management
  - Performance portfolio
  - Availability calendar
  - Booking management

- **Client Features**
  - Search and discover performers
  - Booking management
  - Payment processing
  - Review system

- **Booking System**
  - Real-time availability checking
  - Secure payment processing
  - Booking confirmation
  - Calendar integration

## 🛠 Tech Stack

### ⚙️ Backend
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Razorpay
- **Validation**: Express Validator
- **Security**: bcrypt for password hashing

### 💻 Frontend
- **Framework**: React.js
- **Styling**: CSS & TailwindCSS
- **UI Components**: Custom components

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/performly-backend.git
cd performly-backend
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
Create a `.env` file in the backend directory with the following variables:
```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. **Start the application**
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Performer Endpoints
- `GET /api/performers` - List performers
- `POST /api/performers` - Create performer profile
- `GET /api/performers/:id` - Get performer details
- `PUT /api/performers/:id` - Update performer profile

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

## 📁 Project Structure

```
performly-backend/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── db/            # Database configuration
│   ├── utils/         # Utility functions
│   └── index.js       # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # State management
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
│   └── public/         # Static files
└── README.md
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port number | No (default: 8080) |
| MONGO_URL | MongoDB connection string | Yes |
| JWT_SECRET | Secret for JWT token generation | Yes |
| RAZORPAY_KEY_ID | Razorpay API key | Yes |
| RAZORPAY_KEY_SECRET | Razorpay API secret | Yes |

## 👥 Contributors

- [Abhishek Ratnakar](https://github.com/abhishekratnakar31)
- [Hardik Tiwari](https://github.com/HardikTi13)
- [Nidhi Singh](https://github.com/nidhiisinghh)
- [Rhythm Gulia](https://github.com/rhythmgulia)
- [Tanya Bhatnagar](https://github.com/tanyabhatnagar)

