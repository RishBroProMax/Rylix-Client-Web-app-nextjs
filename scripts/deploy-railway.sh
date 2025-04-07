#!/bin/bash

# This script helps deploy the application to Railway

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Railway CLI is not installed. Please install it first."
    echo "npm install -g @railway/cli"
    exit 1
fi

# Login to Railway
railway login

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo "Deployment initiated. Check the Railway dashboard for progress."

