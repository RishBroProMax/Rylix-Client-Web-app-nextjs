#!/bin/bash

# This script helps deploy the application to Render

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "Render CLI is not installed. Please install it first."
    echo "npm install -g @render/cli"
    exit 1
fi

# Deploy to Render
echo "Deploying to Render..."
render deploy

echo "Deployment initiated. Check the Render dashboard for progress."

