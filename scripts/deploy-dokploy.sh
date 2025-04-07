#!/bin/bash

# This script helps deploy the application to Dokploy

# Check if Dokploy CLI is installed
if ! command -v dokploy &> /dev/null; then
    echo "Dokploy CLI is not installed. Please install it first."
    echo "npm install -g dokploy-cli"
    exit 1
fi

# Login to Dokploy
dokploy login

# Deploy to Dokploy
echo "Deploying to Dokploy..."
dokploy deploy

echo "Deployment initiated. Check the Dokploy dashboard for progress."

