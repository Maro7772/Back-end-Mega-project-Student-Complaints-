## Student Complaints Backend (Node.js + Express + TypeScript + MongoDB)

A backend API for managing student complaints with a secure authentication system. It includes signup/login with JWT, refresh tokens via HttpOnly cookies, password reset with email verification codes, input validation, rate limiting, and CRUD for complaints.

### Features
- **Authentication**: Signup, Login, Logout
- **JWT Auth**: Access tokens + HttpOnly cookie refresh tokens
- **Password Reset**: Forgot password, verification code, reset password
- **Validation**: Yup schemas for all auth flows
- **Security**: bcrypt hashing, rate limiting, cookies set with `httpOnly`, CORS configured for a Vite frontend
- **Complaints**: Create, list, update, delete complaints
- **MongoDB Models**: Users, Complaints, Notifications (scaffold)
- **Environment Validation**: Enforced via `envalid`

### Tech Stack
- **Runtime**: Node.js (Express 5)
- **Language**: TypeScript
- **Auth**: `jsonwebtoken` (JWT), HttpOnly cookies
- **DB**: MongoDB with `mongoose`
- **Security**: `bcryptjs`, `express-rate-limit`, `cookie-parser`, CORS
- **Email**: `nodemailer` (Gmail or SMTP)
- **Validation**: `yup`
- **Tooling**: `nodemon`, `ts-node`, `typescript`, `eslint`

### Project Structure
```
src/
  config/
    db.ts                 # Mongo connection
  controllers/
    auth.controller.ts    # Auth flows (signup, login, refresh, forgot/reset)
    complaint.controller.ts
  middlwares/
    auth.middlware.ts
    admin-guard-middleware.ts
    rateLimiter.ts
  models/
    auth.model.ts         # Yup schemas for auth
    user.model.ts         # User schema
    complaint.model.ts    # Complaint schema
    notification.model.ts # Notification schema (scaffold)
  routes/
    auth.route.ts         # /api/v1/auth/*
    complaint.route.ts    # /api/v1/complaint/*
  util/
    generateToken.ts      # JWT helpers
    validateEnv.ts        # envalid config (PORT, MONGO_URI)
  Types/
    ENUM/                 # Role, Category, Status
    Interfaces/           # IUser, IComplaint, INotification
  server.ts               # Express app entry
vercel.json               # Vercel serverless config
```

### Requirements
- Node.js 18+
- MongoDB connection string (Atlas or local)

### Environment Variables
Create a `.env` file in the project root:
```env
# Required
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Strongly recommended for production (fallbacks exist in code but do NOT use defaults in prod)
JWT_SECRET=your_strong_jwt_secret
REFRESH_SECRET=your_strong_refresh_secret

# For email password reset (Nodemailer). Use Gmail App Password or any SMTP creds
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password_or_smtp_pass
```

### Installation
```bash
git clone https://github.com/Maro7772/Back-end-Mega-project-Student-Complaints-.git
cd Back-end-Mega-project-Student-Complaints-
npm install
```

### Running Locally
- Start the dev server (recommended):
```bash
npm run dev
```
- Build TypeScript:
```bash
npm run build
```

The server listens on `http://localhost:<PORT>` and enables CORS for `http://localhost:5173` with credentials (cookies) support.

### API Overview
Base URL: `http://localhost:<PORT>/api/v1`

#### Auth Routes (`/auth`)
- `POST /signup`
  - Body: `{ fullName, email, password, role }` where `role` ∈ `student | admin`
- `POST /login` (rate limited)
  - Body: `{ email, password }`
  - Returns: `{ accessToken, user }`, sets `refreshToken` as HttpOnly cookie
- `POST /logout`
  - Clears `refreshToken` cookie
- `POST /refresh-token`
  - Uses `refreshToken` cookie to mint a new access token
- `POST /forgot-password`
  - Body: `{ email }`; sends a 6‑digit verification code by email
- `POST /codeVerification`
  - Body: `{ email, code }`; validates the code (10‑minute expiry)
- `POST /reset-password`
  - Body: `{ email, code, password }`; updates password, clears code

Access tokens expire in ~20 minutes by default, refresh tokens in 7 days. Keep the `refreshToken` cookie attached with `credentials: 'include'` from the frontend.

#### Complaint Routes (`/complaint`)
- `GET /complaints`
- `POST /complaints`
  - Body: `{ name, category, description }`
  - Note: `name` must match an existing user's `fullName` (used to link the complaint to the user)
- `PUT /complaints/:id`
- `DELETE /complaints/:id`

Categories: `Academic | Non-Academic`. Status: `Pending | Resolved | Rejected` (default `Pending`).

### Sample Requests
```bash
# Signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Doe","email":"jane@example.com","password":"secret123","role":"student"}'

# Login (stores refresh cookie)
curl -i -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'

# Request password reset code
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com"}'

# Create a complaint
curl -X POST http://localhost:5000/api/v1/complaint/complaints \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","category":"Academic","description":"Issue description"}'
```

### Security Notes
- Passwords are hashed with `bcryptjs`
- Access tokens are returned in JSON; refresh tokens are stored in an HttpOnly cookie
- Login endpoints are rate limited (`express-rate-limit`)
- Validation enforced via `yup`

### Email Setup
This project uses `nodemailer` to send verification codes. For Gmail, enable 2FA and create an App Password, or use a dedicated SMTP provider. Set `EMAIL_USER` and `EMAIL_PASS` in `.env`.

### Deployment
- Vercel configuration is provided in `vercel.json` to run `src/server.ts` with `@vercel/node`.
- Ensure all env vars are set in the Vercel project settings.

### Scripts
```json
{
  "dev": "nodemon ./src/server.ts",
  "build": "tsc",
  "lint": "eslint . --ext .ts"
}
```

Note: The provided `start` script uses `ts-node` and a `.js` path; prefer `npm run dev` locally or compile with `npm run build` for production.



