# Zomato Ops Pro - Smart Kitchen + Delivery Hub

A full-stack application for managing restaurant operations and delivery logistics built with the MERN stack.

## Features

- JWT-based authentication with role-based access (Restaurant Manager, Delivery Partner)
- Restaurant Manager Dashboard
  - Order management (create, view, assign)
  - Real-time order tracking
  - Partner assignment with workload validation
- Delivery Partner Interface
  - View assigned orders
  - Update order status
  - Real-time status updates
- Real-time updates using Socket.IO
- RESTful API endpoints
- MongoDB database with Mongoose schemas

## Tech Stack

- Frontend: React.js, TailwindCSS, Socket.IO Client
- Backend: Node.js, Express.js, Socket.IO
- Database: MongoDB with Mongoose
- Authentication: JWT
- API Testing: Postman

## Project Structure

```
zomato-ops-pro/
├── backend/           # Node.js + Express.js backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── frontend/         # React.js frontend
│   ├── public/       # Static files
│   └── src/          # React components and logic
└── postman/          # API collection for testing
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zomato-ops-pro
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

- POST /api/auth/login - User login
- POST /api/auth/register - User registration

### Order Endpoints

- GET /api/orders - Get all orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id - Update order
- POST /api/orders/:id/assign - Assign delivery partner

### Delivery Partner Endpoints

- GET /api/delivery-partners - Get all delivery partners
- GET /api/delivery-partners/:id/orders - Get assigned orders
- PUT /api/delivery-partners/:id/status - Update order status

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## License

MIT 