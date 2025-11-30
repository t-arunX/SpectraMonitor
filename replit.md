# SpectraMonitor

## Overview
SpectraMonitor is a real-time mobile application monitoring platform that provides comprehensive insights into app performance, user behavior, and device sessions. It features a React + TypeScript frontend with Vite, a Node.js + Express + Socket.IO backend, and MongoDB for data persistence.

## Project Structure

### Frontend
- **Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Libraries**: Tailwind CSS (via CDN), Lucide React (icons), Recharts (charts)
- **Real-time**: Socket.IO Client
- **AI Integration**: Google Generative AI (Gemini)

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB (local instance)
- **Real-time**: Socket.IO Server
- **Port**: 8080 (backend), 5000 (frontend)

### Additional Components
- **Flutter SDK**: Mobile SDK for integrating SpectraMonitor into Flutter apps
- **Java Spring Boot**: Alternative backend implementation (not actively used)

## Setup & Configuration

### Environment Variables
- `VITE_BACKEND_URL`: Backend URL (default: http://localhost:8080)
- `BACKEND_PORT`: Backend server port (default: 8080)
- `MONGO_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key for AI features

### Replit Configuration
- **Workflow**: Single workflow (`SpectraMonitor`) runs `start.sh` which:
  1. Starts MongoDB on port 27017
  2. Starts backend server on port 8080
  3. Starts Vite dev server on port 5000
- **Frontend Port**: 5000 (configured for Replit webview)
- **HMR**: Configured for Replit proxy with WSS protocol
- **Deployment**: VM deployment target (always-on for WebSocket support)

## Features
- **App Onboarding**: Create and manage multiple mobile applications
- **Device Monitoring**: Real-time device session tracking
- **Log Viewer**: Live log streaming with anomaly detection
- **Screen Mirroring**: Real-time screen capture (when SDK is integrated)
- **Feature Flags**: Remote configuration management
- **Analytics Dashboard**: App performance metrics and visualizations
- **AI-Powered Insights**: Gemini integration for log analysis

## Development
- **Start Development**: Workflow automatically starts all services
- **MongoDB Data**: Stored in `data/db` directory (gitignored)
- **Frontend**: Hot module reload enabled via Vite
- **Backend**: Automatic restart on file changes (via workflow)

## Recent Changes (Nov 30, 2025)
- Imported from GitHub and configured for Replit environment
- Updated Vite config to use port 5000 with Replit proxy support
- Configured MongoDB local instance
- Set up unified startup script (`start.sh`)
- Added TypeScript environment definitions for Vite
- Fixed index.html to properly load React application
- Configured deployment for VM target

## Architecture
- **Frontend-Backend Communication**: REST API + WebSocket
- **Database**: MongoDB with Mongoose ODM
- **Real-time Updates**: Socket.IO rooms for device sessions
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Tab-based navigation system (no router library)

## Notes
- Tailwind CSS is loaded via CDN (development only, should migrate to PostCSS for production)
- Import maps used for ESM dependencies
- Multiple backend implementations exist (Node.js is primary, Java/Spring Boot is alternative)
