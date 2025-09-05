

# Feather Press

Full‑stack blog/quotes app using React (Vite) + Node/Express + MySQL.

## Stack
- Frontend: Vite, React, TypeScript, Tailwind, shadcn/ui
- Backend: Node.js, Express, Multer
- DB: MySQL (mysql2/promise)

## Project Structure
- [server.js](cci:7://file:///d:/RVCE/dupe/feather-press/server.js:0:0-0:0) — Express API server
- `src/` — React app
- [src/lib/mysqlClient.js](cci:7://file:///d:/RVCE/dupe/feather-press/src/lib/mysqlClient.js:0:0-0:0) — MySQL pool and init
- `public/uploads/` — Uploaded files
- [database-setup.sql](cci:7://file:///d:/RVCE/dupe/feather-press/database-setup.sql:0:0-0:0) — Basic DB setup
- [run_sql_script.bat](cci:7://file:///d:/RVCE/dupe/feather-press/run_sql_script.bat:0:0-0:0) — Runs SQL via XAMPP
- [.env](cci:7://file:///d:/RVCE/dupe/feather-press/.env:0:0-0:0) — Environment variables

## Prerequisites
- Node.js 18+
- XAMPP MySQL (or standalone MySQL)
- Git

## Setup
1) Clone and install
```
git clone https://github.com/hash066/feather-press.git
cd feather-press
npm install
```

2) Environment
Create [.env](cci:7://file:///d:/RVCE/dupe/feather-press/.env:0:0-0:0):
```
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_USER=root
MYSQL_PASSWORD=Ganesha123*
MYSQL_DATABASE=feather_press

PORT=3001
VITE_API_BASE_URL=http://localhost:3001/api
```

3) Start MySQL (XAMPP)
- Open XAMPP Control Panel
- Start MySQL (set port to 3307 in [C:\xampp\mysql\my.ini](cci:7://file:///C:/xampp/mysql/my.ini:0:0-0:0) if 3306 is busy)

4) Initialize database
- Option A: Double‑click [run_sql_script.bat](cci:7://file:///d:/RVCE/dupe/feather-press/run_sql_script.bat:0:0-0:0)
- Option B (phpMyAdmin): import [database-setup.sql](cci:7://file:///d:/RVCE/dupe/feather-press/database-setup.sql:0:0-0:0) into `feather_press`

5) Run servers
- Backend: `npm run dev:server` → check http://localhost:3001/
- Frontend: `npm run dev` → open printed URL (e.g., http://localhost:5173)

## API (quick)
Base: `http://localhost:3001/api`
- `POST /auth/register` `{ username, password }`
- `POST /auth/login` `{ username, password }`
- `GET /posts`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`
- `GET /quotes`, `POST /quotes`, `POST /quotes/:id/like`, `POST /quotes/:id/unlike`
- `POST /upload` (multipart), `GET /uploads`

## Common Issues
- Login/Registration fails:
  - Ensure backend is running at `http://localhost:3001/`
  - Ensure `VITE_API_BASE_URL` matches backend
  - Check MySQL connects with [.env](cci:7://file:///d:/RVCE/dupe/feather-press/.env:0:0-0:0) values
- MySQL access denied (1045):
  - Confirm port/credentials
  - In MySQL: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword'; FLUSH PRIVILEGES;`
  - Restart backend

## Scripts
- `npm run dev` — Frontend dev server
- `npm run dev:server` — Backend server
- `npm run dev:full` — Run both
- `npm run build` — Frontend build
- `npm run preview` — Preview build

## Notes
- [.env](cci:7://file:///d:/RVCE/dupe/feather-press/.env:0:0-0:0) and `public/uploads/` are ignored by Git
- Use [env.example](cci:7://file:///d:/RVCE/dupe/feather-press/env.example:0:0-0:0) to share config expectations
