#!/bin/bash

# Generate a random secret for NEXTAUTH_SECRET
echo "Generating a random secret for NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32)
echo "Your NEXTAUTH_SECRET: $SECRET"

echo "You can add this to your .env file:"
echo "NEXTAUTH_SECRET=$SECRET"

