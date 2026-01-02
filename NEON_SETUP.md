# Database Initialization Script for Neon

## Your Neon Connection String
```
postgresql://neondb_owner:npg_SmXfdGU1hco5@ep-crimson-water-a149542j-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Option 1: Using Neon SQL Editor (Recommended)
1. Go to your Neon dashboard at [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Copy and paste the contents of `backend/src/schema.sql`
5. Click "Run" to execute the schema

## Option 2: Using Node.js Script
If you have Node.js installed, you can run:
```bash
cd backend
npm install
node -e "const {Pool}=require('pg');const fs=require('fs');const pool=new Pool({connectionString:'postgresql://neondb_owner:npg_SmXfdGU1hco5@ep-crimson-water-a149542j-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'});pool.query(fs.readFileSync('src/schema.sql','utf8')).then(()=>{console.log('Schema created!');process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})"
```

## After Database Setup
Update your Render environment variable:
- `DATABASE_URL`: `postgresql://neondb_owner:npg_SmXfdGU1hco5@ep-crimson-water-a149542j-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
