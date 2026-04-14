# AI-Powered Job Application Tracker

A full-stack web application that helps you track job applications 
while using AI to analyze resumes, generate cover letters, 
and provide personalized job insights.

## Live Demo
Coming soon...

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **AI:** Claude / GPT-4o
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Vercel, Railway

## Features (in progress)
- [x] User registration and login
- [x] JWT authentication
- [x] Job application CRUD (create, read, update, delete)
- [ ] Kanban board with drag and drop
- [ ] AI resume scoring
- [ ] Cover letter generator
- [ ] Interview prep
- [ ] Analytics dashboard

## Project Structure
ai-job-tracker/
backend/        → Node.js + Express API
routes/       → auth and jobs endpoints
middleware/   → JWT authentication
lib/          → Prisma database client
prisma/       → database schema and migrations
## How to Run Locally

### Backend
```bash
cd backend
npm install
node index.js
```
Server runs on http://localhost:3001

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Add a job |
| PATCH | /api/jobs/:id | Update a job |
| DELETE | /api/jobs/:id | Delete a job |

## Build Progress
- [x] Phase 1 — Setup & Foundations
- [x] Phase 2 — Backend API & Database
- [ ] Phase 3 — Frontend React Dashboard
- [ ] Phase 4 — Kanban Board
- [ ] Phase 5 — AI Features
- [ ] Phase 6 — Analytics & Charts
- [ ] Phase 7 — Bonus Features
- [ ] Phase 8 — Deploy & Polish

## Author
Sravya 