#!/bin/bash

# Check if required environment variables are set
if [ -z "$POSTGRES_PRISMA_URL" ]; then
  echo "Error: POSTGRES_PRISMA_URL environment variable is not set"
  exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npx prisma db seed

echo "Database setup completed successfully!"

