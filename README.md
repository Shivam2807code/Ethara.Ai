# Team Task Manager MERN Project

A full-stack Team Task Manager app with authentication, Admin/Member role-based access, projects, tasks, status tracking, and dashboard.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MongoDB
- Auth: JWT

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Update `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Test Flow

1. Signup as Admin
2. Signup as Member in another browser/incognito
3. Admin creates project and adds member
4. Admin creates task and assigns to member
5. Member logs in and updates task status
6. Dashboard shows total, pending, completed, overdue tasks

## Main API Routes

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/users` Admin only
- POST `/api/projects` Admin only
- GET `/api/projects`
- POST `/api/tasks` Admin only
- GET `/api/tasks`
- PUT `/api/tasks/:id`
- GET `/api/dashboard`
