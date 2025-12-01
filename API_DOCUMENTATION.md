# SpectraMonitor API Documentation

## Overview
SpectraMonitor provides a comprehensive REST API and WebSocket (Socket.IO) interface for real-time mobile app monitoring. The backend runs on Spring Boot with MongoDB for data persistence.

## Base URL
- **REST API**: `http://localhost:9090/api`
- **Socket.IO**: `http://localhost:9091` (WebSocket)

## Authentication
Currently, the API is open without authentication. In production, implement API key validation and JWT tokens.

---

## REST API Endpoints

### Applications

#### List All Applications
```
GET /api/apps
```
Returns a list of all registered applications.

**Response:**
```json
[
  {
    "id": "app_1764521212678",
    "name": "Test App",
    "platform": "Flutter",
    "description": "Testing Java backend",
    "icon": "📱",
    "apiKey": "sk_live_...",
    "createdAt": "2025-11-30T12:00:00Z"
  }
]
```

#### Create Application
```
POST /api/apps
Content-Type: application/json

{
  "name": "My App",
  "platform": "Flutter",
  "description": "Production app",
  "icon": "📱"
}
```

**Response:** Created app object with generated API key.

---

### Devices

#### List Devices for App
```
GET /api/apps/{appId}/devices
```
Returns all devices connected to a specific application.

#### Create Device
```
POST /api/apps/{appId}/devices
Content-Type: application/json

{
  "id": "device_optional",
  "userName": "John Doe",
  "model": "iPhone 14",
  "osVersion": "17.0",
  "status": "online"
}
```

**Response:** Created device object.

#### Get Device Details
```
GET /api/devices/{deviceId}
```
Returns detailed information about a specific device.

---

### Logs

#### Get Device Logs
```
GET /api/devices/{deviceId}/logs?limit=100
```
Retrieves logs for a device. Default limit is 100.

**Query Parameters:**
- `limit` (optional): Maximum number of logs to return (default: 100)

**Response:**
```json
[
  {
    "mongoId": "692d2c5c7bbe8134963565c2",
    "deviceId": "device_1764529653580",
    "level": "info",
    "message": "App started successfully",
    "tag": "lifecycle",
    "timestamp": "2025-12-01T05:49:16Z",
    "isAnomaly": false,
    "createdAt": "2025-12-01T05:49:16.421Z"
  }
]
```

#### Add Log Entry
```
POST /api/devices/{deviceId}/logs
Content-Type: application/json

{
  "level": "info",
  "message": "User logged in",
  "tag": "app",
  "timestamp": "2025-12-01T10:30:00Z",
  "isAnomaly": false
}
```

**Log Levels:**
- `info` - Information message
- `warning` - Warning message
- `error` - Error message
- `debug` - Debug information

**Response:** Created log entry object.

#### Anomaly Detection
Logs with `"isAnomaly": true` are highlighted in the UI for special attention.

---

### Crash Reports

#### Get Crash Reports
```
GET /api/devices/{deviceId}/crashes
```
Returns all crash reports for a device.

**Response:**
```json
[
  {
    "mongoId": "692d2c5d7bbe8134963565ca",
    "id": "crash_1764568157138",
    "appId": "app_1764521212678",
    "timestamp": "2025-12-01T05:49:17Z",
    "type": "NullPointerException",
    "title": "Fatal Error in UserService",
    "subtitle": "Null pointer when accessing user profile",
    "error": "Cannot read property of null",
    "stackTrace": "at UserService.getProfile (UserService.java:42)...",
    "affectedFile": "UserService.java",
    "eventsCount": 12,
    "usersCount": 5
  }
]
```

#### Report Crash
```
POST /api/devices/{deviceId}/crashes
Content-Type: application/json

{
  "appId": "app_1764521212678",
  "type": "RuntimeException",
  "title": "Unexpected Error",
  "subtitle": "Optional description",
  "error": "Something went wrong",
  "stackTrace": "at MainActivity.onCreate(MainActivity.java:42)...",
  "affectedFile": "MainActivity.java",
  "eventsCount": 1,
  "usersCount": 1
}
```

**Response:** Created crash report object.

---

### Feature Flags

#### List Feature Flags
```
GET /api/flags
```
Returns all feature flags.

#### Create Feature Flag
```
POST /api/flags
Content-Type: application/json

{
  "name": "new_dashboard",
  "description": "Rollout new dashboard UI",
  "enabled": true,
  "rolloutPercentage": 50
}
```

#### Update Feature Flag
```
PUT /api/flags/{id}
Content-Type: application/json

{
  "enabled": false,
  "rolloutPercentage": 75,
  "name": "new_dashboard",
  "description": "Updated description"
}
```

**Response:** Updated flag object.

---

## Socket.IO Events

Real-time events are broadcast to connected clients via WebSocket. Connect to `http://localhost:9091` with Socket.IO client.

### Server Events (Received by Client)

#### Device Update
```
Event: "device:update"
Data: {
  "id": "device_1764529653580",
  "status": "online"
}
```
Fired when device status changes (online/offline/background).

#### New Log Entry
```
Event: "log:new"
Data: {
  "mongoId": "...",
  "deviceId": "device_...",
  "level": "info",
  "message": "...",
  ...
}
```
Fired when a new log is received from a device.

#### New Crash Report
```
Event: "crash:new"
Data: {
  "id": "crash_...",
  "appId": "app_...",
  "type": "Exception",
  ...
}
```
Fired when a crash is reported.

#### Feature Flag Updated
```
Event: "flag:updated"
Data: {
  "id": "flag_...",
  "name": "feature_name",
  "enabled": true,
  ...
}
```
Fired when a feature flag is updated.

---

## Example Workflows

### 1. Simulate Device Data with curl

**Add logs:**
```bash
curl -X POST http://localhost:9090/api/devices/device_1764529653580/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "info",
    "message": "App launched",
    "tag": "lifecycle",
    "isAnomaly": false
  }'
```

**Report crash:**
```bash
curl -X POST http://localhost:9090/api/devices/device_1764529653580/crashes \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "app_1764521212678",
    "type": "Exception",
    "title": "Unexpected Error",
    "error": "Connection timeout",
    "affectedFile": "NetworkManager.java",
    "eventsCount": 3,
    "usersCount": 2
  }'
```

### 2. Create Application and Device Programmatically

```bash
# Create app
APP_ID=$(curl -s -X POST http://localhost:9090/api/apps \
  -H "Content-Type: application/json" \
  -d '{"name":"MyApp","platform":"Flutter","description":"My Test App"}' \
  | jq -r '.id')

# Create device
curl -X POST http://localhost:9090/api/apps/$APP_ID/devices \
  -H "Content-Type: application/json" \
  -d '{"userName":"Test User","model":"Pixel 6","osVersion":"13.0"}'
```

---

## Database Schema

### Collections in MongoDB

**apps**
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  platform: String,
  description: String,
  icon: String,
  apiKey: String,
  createdAt: Date
}
```

**devices**
```javascript
{
  _id: ObjectId,
  id: String,
  appId: String,
  userName: String,
  model: String,
  osVersion: String,
  status: String,
  lastSeen: Date
}
```

**logs**
```javascript
{
  _id: ObjectId,
  deviceId: String,
  level: String,
  message: String,
  tag: String,
  timestamp: String,
  isAnomaly: Boolean,
  createdAt: Date
}
```

**crashreports**
```javascript
{
  _id: ObjectId,
  id: String,
  appId: String,
  timestamp: String,
  type: String,
  title: String,
  subtitle: String,
  error: String,
  stackTrace: String,
  affectedFile: String,
  eventsCount: Number,
  usersCount: Number
}
```

**featureflags**
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  enabled: Boolean,
  rolloutPercentage: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include a message:
```json
{
  "error": "Description of the error",
  "timestamp": "2025-12-01T10:30:00Z"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, implement rate limiting per API key.

---

## Deployment

For production deployment:
1. Replace CDN Tailwind CSS with PostCSS build
2. Add API key authentication
3. Implement rate limiting
4. Enable CORS based on domains (currently allows all)
5. Use environment variables for configuration
6. Set up HTTPS/TLS
7. Configure MongoDB connection pooling
8. Add request validation and sanitization

---

## Support

For issues or questions, contact the development team.
