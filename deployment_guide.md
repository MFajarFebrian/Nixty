# Nixty Deployment Guide

This guide explains how to deploy the Nixty e-commerce system using Docker.

## Prerequisites
- **Docker** and **Docker Compose** installed on your machine.

## Quick Start

1.  **Navigate to the project root**:
    ```bash
    cd "C:\Users\E31\Documents\Antigravity Project\Nixty"
    ```

2.  **Build and Run**:
    ```bash
    docker-compose up --build -d
    ```
    The `-d` flag runs the containers in detached mode (background).    

3.  **Verify Services**:
    -   **Frontend**: Open [http://localhost:3000](http://localhost:3000)
    -   **Backend API**: [http://localhost:3001/health](http://localhost:3001/health) should return `{"status":"ok", "db":"connected"}`.
    -   **Database**: PostgreSQL is running on port `5432`.

## Default Credentials
-   **Database**:
    -   User: `user`
    -   Password: `password`
    -   DB Name: `nixty`

## Netlify Deployment (Frontend)
1.  **Push to Git**: Ensure your project is pushed to a Git repository (GitHub/GitLab).
2.  **Connect to Netlify**:
    -   Log in to Netlify and "Add new site".
    -   Select your repository.
    -   Base directory: `Nixty/frontend`.
    -   Build command: `npm run build`.
    -   Publish directory: `.next`.
3.  **Environment Variables**:
    -   Set `NEXT_PUBLIC_API_URL` to your backend URL (Must be a public HTTPS URL, not localhost, unless using a tunnel like ngrok).

## Troubleshooting
-   **Backend Build Error**: If you see `missing script: build`, ensure `package.json` in backend has `"build": "tsc"`. (Fixed in latest update).
-   **Database Connection Error**: Ensure the `db` container is fully ready before the backend attempts to connect. The backend might restart a few times initially.
-   **Port Conflicts**: Make sure ports `3000`, `3001`, and `5432` are not in use by other applications.

## Stopping the App
To stop and remove containers:
```bash
docker-compose down
```
To stop and remove volumes (reset database):
```bash
docker-compose down -v
```
