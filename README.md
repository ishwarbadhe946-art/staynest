# 🏠 StayNest — PG & Hostel Finder and Management System

All practicals (01 → 10) merged into **one full-stack MERN app**: a single Express server
that exposes the REST API **and** serves the built React UI — one thing to run, one thing to deploy.

```
staynest/
├── client/                 React 18 + Vite + React Router        (practicals 01–05, 09)
│   └── src/
│       ├── pages/          Home · FindStays · StayDetails · Owner · Manage · Register · About
│       ├── components/     PropertyCard · HostelForm (shared by Add / Update / Owner)
│       ├── styles/         base (04) · crud (05, scoped) · register (01, scoped) · extra
│       └── api.js          one axios client for the whole app
├── server/                 Node + Express + Mongoose              (practicals 06, 08, 09)
│   └── src/
│       ├── models/         Hostel (unified 05+06+09) · User (01)
│       ├── controllers/    hostelController · authController
│       ├── routes/         /api/hostels · /api/auth
│       └── store/          MongoDB store  ⇄  in-memory store (works with zero setup)
├── practicals/07-node-basics/   standalone Node demos (fs, streams, buffers, http, event loop)
├── Dockerfile · docker-compose.yml · render.yaml · .env.example
```

## Where each practical lives now

| Practical | What it was | Where it is in the merged app |
|---|---|---|
| 01 Registration form | HTML/CSS/Bootstrap form | `client/src/pages/Register.jsx` (now React, posts to `/api/auth/register`) |
| 02 JavaScript ES6 | arrow fns, arrays, events | validators + events in `Register.jsx`; arrow fns/array methods across the app |
| 03 React application | cards, props, state, favourites | `PropertyCard.jsx`, favourites in `FindStays.jsx` |
| 04 Router + hooks | SPA, `useEffect`, `useMemo`, `useLocation` | `App.jsx` (router + lifecycle), `Home` / `FindStays` / `Owner` / `About` |
| 05 MongoDB CRUD | Add / Retrieve / Update / Delete UI | `pages/Manage.jsx` (`/manage`) |
| 06 Node + Express + Mongoose | models, controllers, routes | `server/src/*` |
| 07 Basic Node.js | fs, streams, buffers, http | `practicals/07-node-basics/` (standalone demos) |
| 08 REST API / Postman | REST endpoints, in-memory data | `server/src/store/memoryStore.js` + the endpoints below |
| 09 Full-stack MERN | React ⇄ Express ⇄ MongoDB | the whole app |
| 10 Cloud deployment | — | `Dockerfile`, `render.yaml`, steps below |

## Run locally

Requires Node 18+.

```bash
cp .env.example .env          # optional – see "Database" below
npm run install:all           # installs server + client
npm run dev                   # API on :5000, UI on http://localhost:5173
```

**Production-style (one process, one port):**

```bash
npm run build                 # builds client/dist
npm start                     # http://localhost:5000  (API + UI)
```

### Database
* **No `MONGO_URI`** → runs on the in-memory store, seeded with 6 sample stays. Perfect for a quick demo; data resets on restart.
* **With `MONGO_URI`** → uses MongoDB (Atlas or local) and seeds the samples into an empty database once (`SEED=false` to skip).

## Deploy

**Render (easiest, free tier)**
1. Push this folder to GitHub.
2. Create a free cluster on **MongoDB Atlas** → Database Access: add a user → Network Access: allow `0.0.0.0/0` → copy the connection string.
3. Render → *New → Blueprint* → pick the repo (it reads `render.yaml`).
4. Set the `MONGO_URI` env var when prompted. Done — the same URL serves UI and API.

**Docker (any host: Railway, Fly.io, AWS, VPS…)**
```bash
docker build -t staynest .
docker run -p 5000:5000 -e MONGO_URI="<your uri>" -e JWT_SECRET="<random>" staynest
# or, with a local MongoDB included:
docker compose up --build
```

**Railway / Heroku-style:** build command `npm run install:all && npm run build`, start command `npm start`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | status + which DB mode is active |
| GET | `/api/hostels` | list all |
| GET | `/api/hostels/:id` | one hostel |
| POST | `/api/hostels` | create |
| PUT | `/api/hostels/:id` | update |
| DELETE | `/api/hostels/:id` | delete |
| POST | `/api/auth/register` | create account (bcrypt-hashed password, returns JWT) |
| POST | `/api/auth/login` | log in (returns JWT) |

## Before you go public — known limitations
* **Create / update / delete endpoints and `/manage` are not password-protected** (same as the original practicals). Accounts and JWTs exist, but no route enforces them yet. Add an auth middleware before exposing real data.
* Set a strong `JWT_SECRET` in production (the fallback is for local dev only).
* "Continue with Google" on the sign-up page is a placeholder.
