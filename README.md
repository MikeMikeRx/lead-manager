# Lead Manager

Simple fullstack lead management app.

## Deployment

Backend: [Railway](https://lead-manager-production-f22f.up.railway.app)

Frontend: [Vercel](https://lead-manager-phi.vercel.app/)

## Tech Stack

- Next.js
- Express.js
- PostgreSQL (Supabase + Prisma)

## Features

- Create lead (POST /leads)
- Fetch leads (GET /leads)

## Setup

### 1. Clone repo

```bash
git clone https://github.com/MikeMikeRx/lead-manager.git
cd lead-manager
```

### 2. Backend

```bash
cd backend
npm install
```

Create `.env`:

```
DATABASE_URL=your_supabase_connection_string
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

```bash
npm run dev
```

## API

### GET /leads

Returns all leads.

### POST /leads

```json
{
  "name": "Michael",
  "email": "Michael@example.com",
  "status": "NEW"
}
```
