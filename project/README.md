# CodeMarket - Developer Template Marketplace

A production-ready MVP for selling (displaying) website templates with admin upload, live preview, and ZIP download.

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, Axios, React Hook Form, Zod, React Hot Toast

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Multer, Cloudflare R2, Playwright

## Project Structure

```
project/
├── client/     # React frontend (port 5173)
└── server/     # Express API (port 5000)
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Cloudflare R2 bucket with public access enabled

## Setup

### 1. Server

```bash
cd project/server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and R2 credentials
npm install
npx playwright install chromium
npm run dev
```

### 2. Client

```bash
cd project/client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

## Default Admin

- **Email:** admin@codemarket.ai
- **Password:** Admin@123

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | No | Admin login |
| GET | /api/templates | No | List all templates |
| GET | /api/templates/:slug | No | Get template by slug |
| GET | /api/templates/download/:id | No | Get download URL + increment count |
| POST | /api/templates/upload | Yes | Upload template ZIP |
| PATCH | /api/templates/:id | Yes | Update template |
| DELETE | /api/templates/:id | Yes | Delete template |
| GET | /api/templates/dashboard/stats | Yes | Dashboard stats |

## Cloudflare R2 Setup

1. Create an R2 bucket in Cloudflare dashboard
2. Enable public access (R2.dev subdomain or custom domain)
3. Create API token with Object Read & Write permissions
4. Set environment variables in server `.env`:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=codemarket
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

## ZIP Processing Flow

1. Admin uploads ZIP via admin panel
2. Original ZIP stored in R2 (`zips/{slug}.zip`)
3. ZIP extracted temporarily on server
4. `index.html` found recursively (best candidate selected automatically)
5. All extracted files uploaded to R2 (`previews/{slug}/`)
6. Thumbnail from `preview.jpg/png/webp` in ZIP, or auto-generated via Playwright
7. Metadata saved to MongoDB
8. Temp files deleted

## Deployment

- **Frontend:** Netlify — build command `npm run build`, publish `dist/`, set `VITE_API_URL`
- **Backend:** Railway — set all server env vars, start command `npm start`
- **Database:** MongoDB Atlas
- **Storage:** Cloudflare R2

## License

MIT
