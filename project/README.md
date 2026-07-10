# CodeMarket - Developer Template Marketplace

A production-ready template marketplace with Razorpay payments, user authentication, secure Supabase downloads, and admin commerce dashboard.

## Tech Stack

**Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Axios, React Hook Form, Zod, React Hot Toast, Razorpay Checkout, Google OAuth

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Razorpay, Supabase Storage

## Project Structure

```
project/
├── client/     # Next.js 15 frontend (port 5173)
└── server/     # Express API (port 5000)
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Supabase project with **private** Storage bucket
- Razorpay account (test mode for development)

## Environment Variables

### Server (`project/server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=templates

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

API_PUBLIC_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=postmessage
```

### Client (`project/client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Setup

### 1. Server

```bash
cd project/server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 2. Client

```bash
cd project/client
cp .env.example .env
npm install
npm run dev
```

## Default Admin

- **Email:** admin@codemarket.ai
- **Password:** Admin@123

## Razorpay Setup

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** and generate test keys
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to server `.env`
4. For webhooks, go to **Settings → Webhooks** and create a webhook:
   - **URL:** `https://your-api-domain.com/api/payment/webhook`
   - **Events:** `payment.captured`, `payment.failed`, `refund.processed`
   - Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### Test Cards (Razorpay Test Mode)

| Card Number       | Result  |
|-------------------|---------|
| 4111 1111 1111 1111 | Success |
| 4000 0000 0000 0002 | Failed  |

Use any future expiry date and any 3-digit CVV.

## Payment Flow

1. User registers/logs in
2. Opens template details → **Buy Now**
3. Backend creates Razorpay order (`POST /api/payment/create-order`)
4. Razorpay Checkout opens in browser
5. On success, frontend calls `POST /api/payment/verify`
6. Backend verifies signature, creates Order/Payment/Download records
7. User redirected to success page → **My Downloads**

**Free templates:** Razorpay is skipped; download permission is granted immediately.

## Secure Downloads

ZIP files are stored in a **private** Supabase bucket. The public download endpoint is disabled.

```
GET /api/download/:templateId  (JWT required)
```

Backend verifies purchase → generates a **10-minute signed URL** → frontend starts download.

## API Routes

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | User registration |
| POST | /api/auth/login | No | User or admin login |
| POST | /api/auth/logout | No | Logout (client clears token) |
| POST | /api/auth/forgot-password | No | Request password reset |
| POST | /api/auth/reset-password | No | Reset password with token |
| POST | /api/auth/google | No | Google Sign-In (verify token, issue JWT) |
| GET | /api/auth/me | User | Current user profile |

### Payment

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/payment/create-order | User | Create Razorpay order |
| POST | /api/payment/verify | User | Verify payment signature |
| POST | /api/payment/webhook | Webhook | Razorpay webhook handler |

### Orders & Downloads

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/orders/my-orders | User | Purchase history |
| GET | /api/downloads | User | My downloads list |
| GET | /api/download/:templateId | User | Secure signed download URL |

### Templates (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/templates | No | List templates |
| GET | /api/templates/:slug | No | Template details |
| POST | /api/templates/upload | Admin | Upload template |
| GET | /api/templates/download/:id | No | **Disabled** (403) |

### Admin Commerce

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/admin/dashboard/stats | Admin | Revenue, orders, customers |
| GET | /api/admin/orders | Admin | All orders |
| GET | /api/admin/payments | Admin | All payments |
| GET | /api/admin/downloads | Admin | Download activity |
| GET | /api/admin/customers | Admin | Customer list |

## MongoDB Collections

- **Users** — marketplace customers
- **Orders** — purchase orders with Razorpay IDs
- **Payments** — payment gateway records
- **Downloads** — download permissions and counts
- **Templates** — extended with `zipPath`, `purchaseCount`
- **Admins** — admin accounts (unchanged)

## Email (Architecture Ready)

Placeholder services in `server/src/services/emailService.js`:

- Purchase confirmation
- Invoice
- Forgot password

Integrate SendGrid, Resend, or AWS SES when ready.

## Testing

1. Start server and client
2. Register a new user at `/register`
3. Browse templates at `/templates`
4. For a **paid** template: login → Buy Now → pay with test card
5. For a **free** template: login → Download Free
6. Check **My Downloads** at `/dashboard/downloads`
7. Check **My Purchases** at `/dashboard/purchases`
8. Admin panel at `/admin/login` — view Orders, Payments, Customers
9. **Google Sign-In:** click **Continue with Google** on `/login` or `/register` (requires Google OAuth env vars)

## Google Authentication Setup

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Open **APIs & Services → OAuth consent screen**
4. Choose **External**, fill app name (**Neokit**), support email, and developer contact
5. Add scopes: `openid`, `email`, `profile`
6. Add test users while in **Testing** mode (or publish the app for production)

### 2. OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `Neokit Web Client`
5. **Authorized JavaScript origins:**
   - `http://localhost:5173` (local dev)
   - `https://your-production-domain.com` (production)
6. **Authorized redirect URIs:**
   - `http://localhost:5173` (local dev)
   - `https://your-production-domain.com` (production)
7. Copy the **Client ID** and **Client Secret**

### 3. Redirect URI configuration

This project uses the **popup authorization-code flow** (`@react-oauth/google`).

- Set `GOOGLE_CALLBACK_URL=postmessage` on the server (default for SPA popup)
- The same **Client ID** must be set on both frontend and backend

### 4. Required environment variables

**Server (`project/server/.env`):**

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | OAuth Web client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret (server only — never expose to frontend) |
| `GOOGLE_CALLBACK_URL` | `postmessage` for popup flow, or your redirect URL |

**Client (`project/client/.env`):**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same OAuth Web client ID |

### 5. Local development

```bash
# Server .env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=postmessage

# Client .env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

Restart both `npm run dev` processes after changing env files.

### 6. Production deployment

1. Add production domain to **Authorized JavaScript origins** and **redirect URIs** in Google Cloud Console
2. Set the same `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` on your backend host
3. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on your frontend host (Netlify, Vercel, etc.)
4. Rebuild the frontend after setting `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
5. Use HTTPS in production

### Google login behavior

- **New user:** account created with `provider: google`, avatar from Google profile
- **Existing Google user:** logs in, updates `lastLogin`
- **Existing email user + same Google email:** links `googleId` to existing account (no duplicate)
- **JWT:** same token format as email/password login — all protected routes work unchanged
- **Logout:** same client-side JWT clear for all users

## Production Setup

1. Switch Razorpay to **live mode** keys
2. Set `CLIENT_URL` and `API_PUBLIC_URL` to production URLs
3. Configure Razorpay webhook to production API URL
4. Ensure Supabase bucket is **private** (not public)
5. Use strong `JWT_SECRET`
6. Deploy backend (Railway, Render, etc.) and frontend (Netlify, Vercel)

### Frontend (Netlify)

- Base directory: `client`
- Build: `npm run build`
- Uses `@netlify/plugin-nextjs` (see `client/netlify.toml`)
- Env: `NEXT_PUBLIC_API_URL=https://your-api.com/api`

### Backend (Railway)

- Start command: `npm start`
- Set all server environment variables

## License

MIT
