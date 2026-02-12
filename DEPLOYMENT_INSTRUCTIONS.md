# ALA Cosmetics - Free Permanent Deployment Guide

## Prerequisites
1. Create accounts on:
   - [Netlify](https://netlify.com) (frontend)
   - [Render](https://render.com) (backend)
   - [MongoDB Atlas](https://cloud.mongodb.com) (database)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox - Forever free)
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Give read/write permissions
4. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs - for development)
5. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string (replace `<password>` with your user password)

## Step 2: Backend Deployment (Render)

### Method 1: Git Deployment (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New+" → "Web Service"
4. Connect your GitHub repository
5. Configure settings:
   - **Name**: ala-cosmetics-backend
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secure_jwt_secret_here
   GOOGLE_CLIENT_ID=869174528860-cavrb2s2tolgl0pp9emoab6q7lhu8u1p.apps.googleusercontent.com
   ```
7. Click "Create Web Service"
8. Wait for deployment to complete (takes 5-10 minutes)
9. Note your deployed URL (will be something like: https://ala-cosmetics-backend.onrender.com)

### Method 2: Manual Deployment (If Git not available)

1. Zip your entire backend folder
2. Go to Render Dashboard
3. Click "New+" → "Web Service"
4. Choose "Manual Deploy"
5. Upload your zipped backend folder
6. Configure the same settings as above

## Step 3: Frontend Deployment (Netlify)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist` folder (created by `npm run build`)
4. Or connect to GitHub and set up continuous deployment:
   - Repository: your repo
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Go to "Site settings" → "Environment variables"
6. Add these variables:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
   REACT_APP_GOOGLE_CLIENT_ID=869174528860-cavrb2s2tolgl0pp9emoab6q7lhu8u1p.apps.googleusercontent.com
   ```

## Step 4: Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your Netlify domain to authorized origins:
   - `https://your-netlify-site.netlify.app`
5. Add redirect URIs:
   - `https://your-netlify-site.netlify.app`

## Step 5: Final Testing

1. Visit your deployed frontend URL
2. Test Google Sign-In
3. Test product browsing
4. Test cart functionality

## Important Notes

- **Render free tier**: Services sleep after 15 minutes of inactivity, wake up in ~10 seconds
- **MongoDB Atlas free tier**: 512MB storage, suitable for small applications
- **Netlify free tier**: 100GB bandwidth/month, unlimited deployments

## Estimated Costs

- **$0/month** for basic usage
- All services offer generous free tiers
- Only pay if you exceed free limits (unlikely for small apps)

## Maintenance

- Monitor Render dashboard for backend logs
- Check MongoDB Atlas for database metrics
- Netlify handles frontend automatically