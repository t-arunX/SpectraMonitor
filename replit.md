# SpectraMonitor

## Overview
SpectraMonitor is a real-time mobile application monitoring platform that provides comprehensive insights into app performance, user behavior, and device sessions. It features a React + TypeScript frontend with Vite, a **Java Spring Boot backend with netty-socketio for Socket.IO compatibility**, and MongoDB for data persistence.

## Project Structure

### Frontend
- **Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Libraries**: Tailwind CSS (via CDN), Lucide React (icons), Recharts (charts)
- **Real-time**: Native WebSocket
- **AI Integration**: Google Generative AI (Gemini)

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Database**: MongoDB with Spring Data MongoDB
- **Real-time**: Spring WebSocket (native Tomcat support)
- **Build Tool**: Maven
- **Ports**:
  - REST API + WebSocket: 9090 (Spring Boot/Tomcat)
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
│   │   └── ApiController.java       # REST API endpoints (CRUD + delete app)
│   ├── model/
│   │   ├── App.java                 # Application model
│   │   ├── Device.java              # Device model
│   │   ├── LogEntry.java            # Log entry model
│   │   ├── FeatureFlag.java         # Feature flag model
│   │   ├── CrashReport.java         # Crash report model
│   │   ├── PerformanceMetric.java   # Performance metrics (CPU, memory, battery, FPS, etc.)
│   │   └── NetworkRequest.java      # Network request tracking
│   ├── repository/
│   │   ├── AppRepository.java
│   │   ├── DeviceRepository.java    # Includes deleteByAppId
│   │   ├── LogRepository.java
│   │   ├── CrashReportRepository.java
│   │   ├── FeatureFlagRepository.java
│   │   ├── PerformanceMetricRepository.java
│   │   └── NetworkRequestRepository.java
│   └── socket/
│       └── SignalHandler.java       # Socket.IO event handlers
└── pom.xml                          # Maven dependencies
```

### Replit Configuration
- **Workflow**: Single workflow (`SpectraMonitor`) runs `start.sh` which:
  1. Starts MongoDB on port 27017
  2. Starts Spring Boot backend (REST on 9090, WebSocket at /ws)
  3. Starts Vite dev server on port 5000
- **Frontend Proxy**: Vite proxies `/api` requests to Spring Boot (port 9090)
- **WebSocket**: Native Tomcat WebSocket at `ws://localhost:9090/ws`
- **HMR**: Configured for Replit proxy with WSS protocol
- **Deployment**: VM deployment target (always-on for WebSocket support)

## Features
- **App Management**: Create, view, and delete applications
- **Device Monitoring**: Real-time device session tracking
- **Log Viewer**: Live log streaming with anomaly detection
- **Crash Reporting**: Track and analyze app crashes
- **Performance Metrics**: Monitor CPU, memory, battery, temperature, FPS, network speed
- **Network Tracking**: Log HTTP requests with status codes, duration, and payload sizes
- **Screen Mirroring**: Real-time screen capture (when SDK is integrated)
- **Feature Flags**: Remote configuration management
- **Analytics Dashboard**: App performance metrics and visualizations
- **AI-Powered Insights**: Gemini integration for log analysis
- **Dark Mode**: Improved dark theme with better color contrast

## Development
- **Start Development**: Workflow automatically starts all services
- **MongoDB Data**: Stored in `data/db` directory (gitignored)
- **Frontend**: Hot module reload enabled via Vite
- **Backend Build**: `cd backend && mvn clean package -DskipTests`

## Recent Changes (Dec 01, 2025)
- **Tomcat-only Architecture**: Removed netty-socketio, switched to pure Spring Boot WebSocket
- **Single Port Operation**: Everything now runs on port 9090 (REST API + WebSocket at /ws)
- **Native WebSocket**: Frontend uses native WebSocket instead of Socket.IO protocol
- **Simplified Deployment**: No separate port needed for real-time communication
- **Delete App Feature**: Added DELETE /api/apps/{appId} endpoint with UI button
- **Performance Metrics Tracking**: POST/GET endpoints for CPU, memory, battery, FPS monitoring
- **Network Request Logging**: POST/GET endpoints for HTTP request tracking

## Architecture
- **Frontend-Backend Communication**: REST API (proxied via Vite) + Native WebSocket (direct connection to 9090/ws)
- **Database**: MongoDB with Spring Data MongoDB
- **Real-time Updates**: Spring WebSocket with room support for device sessions (no external dependencies)
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Tab-based navigation system (no router library)
- **WebSocket Protocol**: Native browser WebSocket with custom JSON message protocol

## Building the Backend
```bash
cd backend
mvn clean package -DskipTests
```

## Notes
- Tailwind CSS is loaded via CDN (development only, should migrate to PostCSS for production)
- Original Node.js backend remains in `backend/index.js` for reference
- Frontend uses relative `/api` URLs for REST (proxied to 9090) and native WebSocket for real-time (`ws://localhost:9090/ws`)
- All backend real-time communication now goes through native Spring WebSocket - no external dependencies needed
