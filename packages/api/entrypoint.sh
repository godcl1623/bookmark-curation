#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations complete"
echo "🚀 Starting server..."

exec node packages/api/dist/index.js
