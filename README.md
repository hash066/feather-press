
If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## Deploying to DigitalOcean App Platform (Full Stack)

This repository is set up so a single Node.js service serves both the frontend (Vite build) and the backend (Express API).

### 1) Prerequisites

- A MySQL database (DigitalOcean Managed Database, PlanetScale, or your own MySQL)
- Optional but recommended: DigitalOcean Spaces for persistent uploads
- GitHub repo containing this project

### 2) App Platform Configuration

- Service Type: Node.js App
- Source: GitHub (root of this project)
- Build Command:
  ```sh
  npm ci && npm run build
  ```
- Run Command:
  ```sh
  npm start
  ```
- Health Check Path: `/api/health`

The server serves the frontend build from `dist/` and keeps APIs under `/api/*`.

### 3) Environment Variables

Copy from `.env.example.app-platform` into App Platform → Settings → Environment Variables:

- Database (required)
  - `MYSQL_HOST`
  - `MYSQL_PORT` (e.g., 3306)
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE` (e.g., feather_press)

- Storage (recommended for production uploads)
  - `STORAGE_PROVIDER=spaces` (any non-`local` value enables object storage)
  - `SPACES_ENDPOINT` (e.g., https://nyc3.digitaloceanspaces.com)
  - `SPACES_REGION` (e.g., nyc3)
  - `SPACES_BUCKET`
  - `SPACES_KEY`
  - `SPACES_SECRET`
  - Optional: `PUBLIC_CDN_BASE` if you have a CDN/custom domain over your bucket

- App
  - `NODE_ENV=production`

### 4) Auto-Deploy from GitHub

Enable "Auto-deploy on push" so each push to your chosen branch triggers a new build + deploy.

### 5) Optional: App Spec

This repo includes `.do/app.yaml`. You can use DigitalOcean's "Import from a spec" to create the app with pre-filled settings. You'll still need to enter secrets (DB + Spaces) in the dashboard.

### 6) Notes on Uploads

- Locally (dev): uploads are saved under `public/uploads/` and served at `/uploads/*`.
- App Platform: the filesystem is ephemeral. For persistence, the server uploads files to DigitalOcean Spaces and returns public URLs. Those URLs can be stored in MySQL alongside your content.
