#!/bin/bash

# Setup database
echo "Setting up database..."
./scripts/setup-database.sh

# Setup Supabase storage
echo "Setting up Supabase storage..."
node scripts/setup-supabase.js

echo "All setup completed successfully!"

