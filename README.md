# Catalyst Hub Backend

BioMarin Digital Transformation Platform API built with NestJS + Prisma + SQLite.

## Prerequisites

- Node.js 20+
- npm or yarn

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations and seed database
npm run db:setup

# Start development server
npm run start:dev
```

The API will be available at: `http://localhost:3001`
Swagger docs: `http://localhost:3001/api/docs`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:setup` | Migrate + seed (first time setup) |
| `npm run db:reset` | Reset DB and re-seed |
| `npm run db:studio` | Open Prisma Studio |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | david.chen@biomarin.com | admin123 |
| Admin | jhon.daniel@biomarin.com | admin123 |
| Author | ishika.gupta@biomarin.com | author123 |
| Author | priya.sharma@biomarin.com | author123 |
| Viewer | rahul.sharma@biomarin.com | viewer123 |
| Viewer | elena.chen@biomarin.com | viewer123 |

## API Overview

### Authentication
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/register` — Register new user (demo)
- `GET /api/auth/me` — Get current user (requires JWT)
- `POST /api/auth/logout` — Logout

### Dashboard
- `GET /api/dashboard/welcome` — Welcome data
- `GET /api/dashboard/announcements` — Latest announcements
- `GET /api/dashboard/trending-tools` — Trending tools
- `GET /api/dashboard/pinned-resources` — User's pinned resources
- `GET /api/dashboard/learning-path` — User's learning progress
- `GET /api/dashboard/north-star` — North Star banner content

### Initiatives
- `GET /api/initiatives` — List initiatives (filterable)
- `GET /api/initiatives/:slug` — Get initiative detail
- `POST /api/initiatives` — Create initiative (author/admin)
- `PUT /api/initiatives/:id` — Update initiative
- `GET /api/initiatives/:id/objectives` — Get objectives
- `PATCH /api/initiatives/:id/objectives/:objId` — Toggle objective
- `GET /api/initiatives/:id/updates` — Get timeline updates
- `POST /api/initiatives/:id/updates` — Post update
- `POST /api/initiatives/:id/save` — Save/bookmark

### Resources
- `GET /api/resources` — List resources
- `GET /api/resources/:id` — Get resource
- `POST /api/resources` — Create resource (author/admin)
- `PUT /api/resources/:id` — Update resource
- `DELETE /api/resources/:id` — Delete resource
- `POST /api/resources/:id/pin` — Pin/unpin resource

### Experts
- `GET /api/experts` — List experts
- `GET /api/experts/org-chart` — Org chart tree
- `GET /api/experts/:id` — Get expert profile

### Notifications
- `GET /api/notifications` — List notifications
- `PATCH /api/notifications/:id/read` — Mark as read
- `PATCH /api/notifications/read-all` — Mark all as read

### AI Assistant
- `POST /api/ai/query` — Submit question
- `GET /api/ai/conversations/:id` — Get conversation
- `POST /api/ai/conversations/:id/feedback` — Submit feedback
- `GET /api/ai/search` — Hybrid search
- `GET /api/ai/suggestions` — Prompt suggestions

### Learning
- `GET /api/learning/courses` — List courses
- `GET /api/learning/courses/:id` — Course detail
- `GET /api/learning/workshops` — List workshops
- `POST /api/learning/workshops/:id/register` — Register for workshop
- `GET /api/learning/my-progress` — User's progress

### Search
- `GET /api/search?q=keyword` — Global search

### Admin (admin only)
- `GET /api/admin/users` — List all users
- `PATCH /api/admin/users/:id/role` — Update user role
- `GET /api/admin/stats` — Platform stats
- `GET /api/admin/access-requests` — Access requests

## Architecture

```
src/
├── main.ts                    # Entry point
├── app.module.ts              # Root module
├── prisma/                    # Database service
├── common/                    # Guards, decorators, filters
└── modules/                   # Feature modules
    ├── auth/
    ├── users/
    ├── dashboard/
    ├── initiatives/
    ├── resources/
    ├── experts/
    ├── notifications/
    ├── ai/
    ├── learning/
    ├── search/
    └── admin/
```
