# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Neon database (already set up)
- Code pushed to GitHub

## Step 1: Initialize Neon Database
Follow the instructions in `NEON_SETUP.md` to run the schema in your Neon SQL Editor.

## Step 2: Deploy to Vercel

### 2.1 Sign Up
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and use your GitHub account
3. **No credit card required!**

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository: `MFajarFebrian/Nixty`
3. Vercel will auto-detect Next.js

### 2.3 Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as is for monorepo)
- **Build Command**: Leave default
- **Output Directory**: Leave default

### 2.4 Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Any random string (e.g., `my-super-secret-jwt-key-2024`) |
| `ENCRYPTION_KEY` | 32-character string (e.g., `vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3`) |

**Your Neon connection string:**
```
postgresql://neondb_owner:npg_SmXfdGU1hco5@ep-crimson-water-a149542j-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 2.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for the build
3. Your site will be live at `https://nixty-xxx.vercel.app`

## Step 3: Test Your Deployment
1. Visit your Vercel URL
2. Browse the catalog
3. Try the admin login at `/admin/login`
4. Test a purchase flow

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set

### API Not Working
- Verify `DATABASE_URL` is correct
- Check Vercel function logs

### Database Connection Issues
- Ensure Neon database is active
- Verify connection string includes `?sslmode=require`

## Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
