#!/bin/bash
# PS Platform - Local Database Setup Script
# Run this after PostgreSQL and Redis are installed

set -e

echo "=== PS Platform Database Setup ==="

# 1. Start services
echo "→ Starting PostgreSQL..."
sudo service postgresql start

echo "→ Starting Redis..."
sudo service redis-server start

# 2. Create Postgres user and database
echo "→ Creating database user and database..."
sudo -u postgres psql -c "CREATE USER ps_user WITH PASSWORD 'postgres_password';" 2>/dev/null || echo "  (User already exists)"
sudo -u postgres psql -c "CREATE DATABASE ps_db OWNER ps_user;" 2>/dev/null || echo "  (Database already exists)"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ps_db TO ps_user;" 2>/dev/null

# 3. Use the postgres superuser URL (Prisma needs full access for migrations)
export DATABASE_URL="postgresql://postgres:$(sudo -u postgres psql -tAc "SELECT current_setting('authentication_timeout');" 2>/dev/null || echo 'postgres')@localhost:5432/ps_db"

echo "→ Running Prisma migrations..."
cd /home/moinul-islam/Projects/PS/backend
npx prisma migrate dev --name init --skip-seed

echo "→ Seeding database..."
npx ts-node prisma/seed.ts

echo ""
echo "=== Setup complete! ==="
echo "Run 'npm run dev' in the backend folder to start the API server."
