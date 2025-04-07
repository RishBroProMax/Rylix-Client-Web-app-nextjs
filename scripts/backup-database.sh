#!/bin/bash

# This script creates a backup of the PostgreSQL database

# Check if required environment variables are set
if [ -z "$POSTGRES_HOST" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DATABASE" ]; then
  echo "Error: Required environment variables are not set"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p backups

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/rylix_db_backup_$TIMESTAMP.sql"

# Create database backup
echo "Creating database backup..."
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DATABASE > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Database backup created successfully: $BACKUP_FILE"
else
  echo "Error: Database backup failed"
  exit 1
fi

