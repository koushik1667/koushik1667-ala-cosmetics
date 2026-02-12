#!/bin/bash

echo "🚀 ALA Cosmetics Deployment Script"

echo "Building frontend..."
npm run build

echo "Frontend built successfully!"

echo "
📦 Deployment Ready!

Next steps:
1. Deploy backend to Render (see DEPLOYMENT_INSTRUCTIONS.md)
2. Deploy frontend to Netlify (upload the 'dist' folder)
3. Update environment variables in both platforms
4. Update Google OAuth authorized domains

Check DEPLOYMENT_INSTRUCTIONS.md for detailed steps!
"