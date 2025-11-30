# SpectraMonitor

## Overview
SpectraMonitor is a real-time mobile application monitoring platform that provides comprehensive insights into app performance, user behavior, and device sessions. It features a React + TypeScript frontend with Vite, a **Java Spring Boot backend with netty-socketio for Socket.IO compatibility**, and MongoDB for data persistence.

## Project Structure

### Frontend
- **Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Libraries**: Tailwind CSS (via CDN), Lucide React (icons), Recharts (charts)
- **Real-time**: Socket.IO Client
- **AI Integration**: Google Generative AI (Gemini)

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Database**: MongoDB with Spring Data MongoDB
- **Real-time**: netty-socketio 2.0.11 (Socket.IO server for Java)
- **Build Tool**: Maven
- **Ports**:
  - REST API: 9090 (Spring Boot/Tomcat)
  - Socket.IO: 8080 (Netty)
  - Frontend: 5000 (Vite)

### Additional Components
- **Flutter SDK**: Mobile SDK for integrating SpectraMonitor into Flutter apps

## Setup & Configuration

### Environment Variables
- `VITE_SOCKET_URL`: Socket.IO server URL (default: http://localhost:8080)
- `BACKEND_PORT`: Socket.IO server port (default: 8080)
- `MONGO_URI`: MongoDB connection string
- `GEMINI_API_KEY`: Google Gemini API key for AI features

### Backend Structure
```
backend/
├── src/main/java/com/spectramonitor/
│   ├── SpectraApplication.java      # Main Spring Boot entry point
│   ├── config/
│   │   ├── SocketIOConfig.java      # Netty-socketio configuration
│   │   └── CorsConfig.java          # CORS configuration
│   ├── controller/
│   │   └── ApiController.java       # REST API endpoints
│   ├── model/
│   │   ├── App.java                 # Application model
│   │   ├── Device.java              # Device model
│   │   ├── LogEntry.java            # Log entry model
│   │   ├── FeatureFlag.java         # Feature flag model
│   │   └── CrashReport.java         # Crash report model
│   ├── repository/
│   │   └── *Repository.java         # MongoDB repositories
│   └── socket/
│       └── SignalHandler.java       # Socket.IO event handlers
└── pom.xml                          # Maven dependencies
```

### Replit Configuration
- **Workflow**: Single workflow (`SpectraMonitor`) runs `start.sh` which:
  1. Starts MongoDB on port 27017
  2. Starts Spring Boot backend (REST on 9090, Socket.IO on 8080)
  3. Starts Vite dev server on port 5000
- **Frontend Proxy**: Vite proxies `/api` requests to Spring Boot (port 9090)
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
- **Backend Build**: `cd backend && mvn clean package -DskipTests`

## Recent Changes (Nov 30, 2025)
- **Backend Migration**: Converted from Node.js/Express to Java Spring Boot
- **Socket.IO Compatibility**: Using netty-socketio library to maintain Socket.IO protocol
- **Architecture Split**: REST API on Tomcat (9090), Socket.IO on Netty (8080)
- **Vite Proxy**: Added proxy configuration for API calls to Spring Boot
- **Updated startup script**: Now runs Java JAR instead of Node.js

## Architecture
- **Frontend-Backend Communication**: REST API (proxied via Vite) + Socket.IO (direct connection)
- **Database**: MongoDB with Spring Data MongoDB
- **Real-time Updates**: netty-socketio with room support for device sessions
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Tab-based navigation system (no router library)

## Building the Backend
```bash
cd backend
mvn clean package -DskipTests
```

## Notes
- Tailwind CSS is loaded via CDN (development only, should migrate to PostCSS for production)
- Original Node.js backend remains in `backend/index.js` for reference
- Frontend uses relative `/api` URLs (proxied to 9090) for REST, absolute URL for Socket.IO (8080)
