#!/bin/bash

# Load environment variables from .env file
export $(cat .env | xargs)

# Run the seed script
node scripts/seed-db-modern.js
