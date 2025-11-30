#!/bin/bash

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    kill $BACKEND_PID 2>/dev/null
    mongod --dbpath data/db --shutdown 2>/dev/null
    exit 0
}

# Set trap BEFORE starting services
trap cleanup EXIT INT TERM

# Kill any existing backend processes
pkill -f "node.*backend/index.js" 2>/dev/null || true

# Start MongoDB in the background
echo "Starting MongoDB..."
mkdir -p data/db

# Check if MongoDB is already running
if ! pgrep -x "mongod" > /dev/null; then
    mongod --dbpath data/db --bind_ip localhost --port 27017 --fork --logpath data/mongodb.log
    echo "MongoDB started"
else
    echo "MongoDB already running"
fi

# Wait for MongoDB to be ready
sleep 2

# Start backend server in the background
echo "Starting backend server..."
cd backend
node index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
sleep 2

# Start frontend dev server (this blocks)
echo "Starting frontend..."
npm run dev
