# User Management Dashboard

A full-stack user management dashboard built with React + TypeScript on the frontend and Express + TypeScript on the backend.

## Features

- User listing with server-side pagination
- Search users by name, username, or email
- Create and edit users with client-side validation (React Hook Form + Zod)
- View user details in a read-only modal
- Delete users
- Light/Dark theme toggle with persistence

## Tech Stack

- Frontend: React 19, Vite 8, TypeScript, Tailwind CSS v4, Axios, Lucide Icons
- Backend: Node.js, Express 5, TypeScript, Zod
- Storage: JSON file (`backend/data/users.json`)

## Project Structure

```text
user-management-dashboard/
  backend/
  frontend/
```

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm

## Backend Configuration

There is no `backend/.env` file in this project.

Backend runtime values use built-in defaults from `backend/src/config/env.ts`:

- `PORT`: `5000`
- `CLIENT_URL`: `http://localhost:3000`
- `NODE_ENV`: `development`

## Environment Variables (Frontend, Optional)

Create `frontend/.env` when need a custom API base URL:

```env
VITE_API_URL=http://localhost:5000/api/users
```

## Installation

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run in Development

Use two terminals.

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

## App URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/users`

## Build for Production

Backend:

```bash
cd backend
npm run build
npm run start
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

## Useful Scripts

Backend:

- `npm run dev` - Start backend with nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled backend

Frontend:

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Overview

Base URL: `http://localhost:5000/api/users`

- `GET /` - List users (supports `page`, `limit`, `search`)
- `GET /:id` - Get one user
- `POST /` - Create user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

Example paginated request:

```http
GET /api/users?page=1&limit=10&search=alice
```

## Data Storage

User records are stored in:

`backend/data/users.json`

## Troubleshooting

- If frontend cannot reach backend, make sure backend runs on port `5000` and `frontend/src/services/api.ts` points to the same URL.
- If CORS issues appear, check the `clientUrl` value in `backend/src/config/env.ts`.
