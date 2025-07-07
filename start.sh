#!/bin/sh
# A more robust start script

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the API server in the background
echo "Starting Node.js API server..."
cd /app/api && node dist/api/src/index.js &

# Wait for the API server to be ready
echo "Waiting for API to be ready on port 3000..."
while ! nc -z localhost 3000; do
  sleep 0.1 # wait for 1/10 of a second before check again
done
echo "API is ready!"

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'