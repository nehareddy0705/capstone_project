# Blog Frontend

React client for the blog application. Users browse articles, authors publish content, and admins manage the platform. Connects to [blog-backend](../blog-backend) with cookie-based sessions.

## Tech stack

React 19, Vite 8, React Router 7, Zustand, Axios, Tailwind CSS 4, React Hook Form, React Hot Toast.

## Features

- **Public** — Home, articles, register, login, forgot password
- **User** — Profile and comments (`USER`)
- **Author** — Dashboard, write/edit articles (`AUTHOR`)
- **Admin** — User and article management (`ADMIN`)
- **Auth** — Role-based routes; session restored on page load

## Prerequisites

Node.js 18+ and a running [blog-backend](../blog-backend).

## Setup

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev      # http://localhost:5000
npm run build
npm run preview
npm run lint
```

Point `VITE_API_URL` at your API (no trailing slash). Backend CORS allows `http://localhost:5000` for local dev.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

## Main routes

| Path | Access |
|------|--------|
| `/` | Public — home |
| `/login`, `/register`, `/forgot-password` | Public |
| `/article/:id` | Public |
| `/user-profile` | `USER` |
| `/author-profile`, `.../write-article` | `AUTHOR` |
| `/edit-article` | Author |
| `/admin-profile` | `ADMIN` |
| `/unauthorized` | Wrong role |

## Structure

```
src/
├── App.jsx              # Routes
├── store/authStore.js   # Login, logout, checkAuth
└── components/          # Pages, Header, Footer
```

Ensure the backend is running and `VITE_API_URL` matches before testing login or protected routes.
