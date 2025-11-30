#!/bin/bash

# Start MongoDB in the background
echo "Starting MongoDB..."
mkdir -p data/db
mongod --dbpath data/db --bind_ip localhost --port 27017 --fork --logpath data/mongodb.log

# Wait for MongoDB to start
sleep 3

# Start backend server in the background
echo "Starting backend server..."
cd backend
node index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
sleep 2

# Start frontend dev server
echo "Starting frontend..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID; mongod --dbpath data/db --shutdown" EXIT
