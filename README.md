# Event Booking System

A full-stack event booking application built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS v4, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth**: JWT (7-day expiry), bcryptjs

## Project Structure

```
EB/
├── frontend/   # React + Vite app (port 5174)
└── backend/    # Express API server (port 5001)
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Seed the database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

## Demo Credentials

| Name | Email | Password |
|------|-------|----------|
| Swapnil Patil | swapnil@gmail.com | password123 |
| Vishal Sharma | vishal@gmail.com | password456 |

## Features

- Browse upcoming events with seat availability
- User login with JWT authentication
- Book seats for an event (overbooking prevented)
- View personal booking history
