# AI-Powered Job Application Tracker

A full-stack web application that helps job seekers track job applications, 
optimize resumes using AI, generate cover letters, and search real job listings.

**Live demo:** https://ai-job-tracker-coral.vercel.app

---

## What it does

Most job seekers lose track of where they applied, forget to follow up, and 
spend hours writing cover letters. This app solves all three problems in one place.

You can add every job application you submit, move them through stages on a 
visual Kanban board, use AI to score your resume and generate tailored cover 
letters, and search real job listings without leaving the app.

---

## Features

**Job tracking**
- Add job applications with company, role, status, and notes
- Track four stages: Applied, Interviewing, Offered, Rejected
- View all applications on a dashboard with status counts

**Kanban board**
- Drag and drop cards between columns to update application status
- Changes save to the database in real time

**AI tools** (powered by Anthropic Claude)
- Resume scorer: paste your resume and get an ATS compatibility score out of 100, with specific strengths and improvements
- Cover letter generator: enter a job description and your resume, get a tailored cover letter under 350 words
- Interview prep: enter a job title and get 8 likely interview questions with model answers
- Job match analyzer: compare your resume to a job description and see matched and missing keywords

**Analytics**
- Bar chart showing applications by status
- Application funnel from Applied to Offered
- Line chart showing applications over time
- Response rate and offer count statistics

**Job search**
- Search real job listings via the Adzuna API
- Save any listing directly to your tracker with one click

**Authentication and access control**
- User registration and login with JWT tokens
- Passwords encrypted with bcrypt
- Admin dashboard showing platform-wide stats and all user accounts
- Regular users cannot access admin routes

---

## Tech stack

Frontend: Next.js, React, Tailwind CSS, Recharts  
Backend: Node.js, Express.js  
Database: PostgreSQL, Prisma ORM  
AI: Anthropic Claude API  
Job data: Adzuna API  
Auth: JSON Web Tokens, bcrypt  
Deployment: Vercel (frontend), Railway (backend and database)

---

## Project structure

```
ai-job-tracker/
  frontend/
    app/
      login/          Login page
      register/       Registration page
      dashboard/      Job list and add form
      kanban/         Drag and drop board
      ai/             AI tools (four tabs)
      analytics/      Charts and statistics
      search/         Job search
      admin/          Admin panel (restricted)

  backend/
    routes/
      auth.js         Register and login endpoints
      jobs.js         Job CRUD and analytics
      ai.js           AI feature endpoints
      search.js       Job search endpoint
      admin.js        Admin-only endpoints
    middleware/
      auth.js         JWT verification middleware
    lib/
      prisma.js       Database client
    prisma/
      schema.prisma   User and Job table definitions
```
---

## Running locally

You will need Node.js v20 or higher and PostgreSQL installed.

**Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
DATABASE_URL=postgresql://localhost:5432/aijobtracker
JWT_SECRET=your_secret_here
ANTHROPIC_API_KEY=your_anthropic_key
ADZUNA_APP_ID=your_adzuna_id
ADZUNA_APP_KEY=your_adzuna_key
Then run:

```bash
npx prisma migrate dev
node index.js
```

Server runs on http://localhost:3001

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:3000

---

## API reference

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create a new account | No |
| POST | /api/auth/login | Log in | No |
| GET | /api/jobs | Get all jobs for logged-in user | Yes |
| POST | /api/jobs | Add a new job | Yes |
| PATCH | /api/jobs/:id | Update a job | Yes |
| DELETE | /api/jobs/:id | Delete a job | Yes |
| GET | /api/jobs/analytics | Get analytics data | Yes |
| POST | /api/ai/score-resume | Score a resume | Yes |
| POST | /api/ai/cover-letter | Generate a cover letter | Yes |
| POST | /api/ai/interview-prep | Generate interview questions | Yes |
| POST | /api/ai/match | Match resume to job description | Yes |
| GET | /api/search | Search job listings | Yes |
| GET | /api/admin/stats | Platform statistics | Admin only |
| GET | /api/admin/users | All user accounts | Admin only |

---

## What I learned building this

This was my first full-stack project. Key things I learned:

- How a REST API works end to end, from HTTP request to database and back
- How JWT authentication keeps routes secure without storing sessions
- How to write prompts that make LLMs return structured JSON reliably
- How to connect a Next.js frontend to a Node.js backend in production
- How environment variables protect API keys across local and deployed environments
- How database migrations work with Prisma

---

## Author

Sravya  
GitHub: https://github.com/s-r-a-v-y-a  
Live project: https://ai-job-tracker-coral.vercel.app