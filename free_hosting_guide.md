# Nixty Free Hosting Guide

This guide details how to deploy Nixty for free using **Neon** (Database), **Render** (Backend), and **Netlify** (Frontend).

## 1. Database Setup (Neon)
We will use Neon for a free, serverless PostgreSQL database.

1.  **Sign Up**: Go to [neon.tech](https://neon.tech) and sign up.
2.  **Create Project**: Create a new project named `nixty-db`.
3.  **Get Connection String**:
    -   In your dashboard, look for the **Connection String**.
    -   It will look like: `postgres://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require`
    -   **Copy this string**. You will need it for the Backend.

## 2. Backend Deployment (Render)
We will use Render to host the Node.js backend.

1.  **Sign Up**: Go to [render.com](https://render.com) and sign up (using GitHub is recommended).
2.  **Connect GitHub**:
    -   Push your `Nixty` project to a GitHub repository if you haven't already.
3.  **Create Web Service**:
    -   Click **New +** -> **Web Service**.
    -   Select your repository.
    -   **Root Directory**: `backend` (Important!).
    -   **Runtime**: Node.
    -   **Build Command**: `npm install && npm run build`.
    -   **Start Command**: `node dist/server.js`.
    -   **Instance Type**: Free.
4.  **Environment Variables**:
    -   Scroll down to "Environment Variables" and add:
        -   `DATABASE_URL`: Paste the Neon connection string from Step 1.
        -   `JWT_SECRET`: Generate a random string (e.g., `my-super-secret-jwt-key`).
        -   `ENCRYPTION_KEY`: Generate a random 32-char string (e.g., `vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3`).
        -   `PORT`: `10000` (Render's default).
5.  **Deploy**: Click "Create Web Service".
    -   Wait for the build to finish.
    -   **Copy your Backend URL** (e.g., `https://nixty-backend.onrender.com`).

## 3. Frontend Deployment (Netlify)
We will use Netlify to host the Next.js frontend.

1.  **Sign Up**: Go to [netlify.com](https://netlify.com) and sign up.
2.  **Add New Site**:
    -   Click **Add new site** -> **Import from Git**.
    -   Select GitHub and choose your repository.
3.  **Configure Build**:
    -   **Base directory**: `frontend`.
    -   **Build command**: `npm run build`.
    -   **Publish directory**: `.next`.
4.  **Environment Variables**:
    -   Click **Show advanced** -> **New Variable**.
    -   Key: `NEXT_PUBLIC_API_URL`
    -   Value: Your Render Backend URL (e.g., `https://nixty-backend.onrender.com`).
    -   **Important**: Do NOT add `INTERNAL_API_URL` for Netlify; the client browser needs to hit the public Render URL directly.
5.  **Deploy**: Click **Deploy site**.
6.  **Visit**: Once deployed, click the link to see your live Galaxy-themed store!

## Troubleshooting
-   **CORS Issues**: If the frontend cannot talk to the backend, you might need to update `backend/src/server.ts` to allow the Netlify domain in CORS settings. For now, it allows `*` (all), so it should work.
-   **Database Connectivity**: Ensure Neon is active. Serverless DBs might sleep; give it a second on first load.
-   **Build Failures**: Check the logs on Render/Netlify. Ensure `package.json` scripts are correct.
