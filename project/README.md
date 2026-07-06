# CodeMarket - Developer Template Marketplace

A production-ready template marketplace with Razorpay payments, user authentication, secure Supabase downloads, and admin commerce dashboard.

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, Axios, React Hook Form, Zod, React Hot Toast, Razorpay Checkout

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Razorpay, Supabase Storage

## Project Structure

```
project/
├── client/     # React frontend (port 5173)
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
```

### Client (`project/client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
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
| POST | /api/auth/google | No | Google OAuth placeholder |
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
- Publish: `dist`
- Env: `VITE_API_URL=https://your-api.com/api`

### Backend (Railway)

- Start command: `npm start`
- Set all server environment variables

## License

MIT
