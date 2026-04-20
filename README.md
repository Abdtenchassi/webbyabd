# WebbyAbd — Mobile-First Web Studio

A professional portfolio and lead-generation platform for WebbyAbd web agency. Built with Next.js 15.

## Features

- **Portfolio showcase** with live project screenshots and direct links
- **Interactive project builder** — clients select features they need
- **Lead management API** — submissions stored in Supabase (with in-memory fallback)
- **Admin dashboard** at `/admin` — view leads, pricing (admin-only), status tracking
- **Mobile-first responsive design** — scales from phone to desktop
- **Zero-dependency styling** — no CSS frameworks, pure CSS with media queries

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_KEY=your_admin_secret_key
```

## Supabase Table

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_business TEXT,
  email_phone TEXT NOT NULL,
  notes TEXT,
  features JSONB,
  "estimateMin" INTEGER,
  "estimateMax" INTEGER,
  attached_files TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Screenshots

Replace the SVG previews in `/public/screenshots/` with real PNG screenshots of your live projects for the best visual impact.

## Deployment

Deploy on Vercel, Render, or any Node.js host:

```bash
npm run build
npm start
```
