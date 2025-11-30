require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { App, Device, Log, CrashReport, FeatureFlag } = require('./models');
const crypto = require('crypto');

// --- Configuration ---
// Updated to 8080 to match frontend apiClient expectations
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spectramonitor';

// --- Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// --- Database Connection & Seeding ---
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedDataIfNeeded();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- REST API Routes ---

// Apps
app.get('/api/apps', async (req, res) => {
  try {
    const apps = await App.find();
    res.json(apps);
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.post('/api/apps', async (req, res) => {
  try {
    const { name, platform, description, icon } = req.body;
    const newApp = new App({
      id: `app_${Date.now()}`,
      name,
      platform,
      description,
      icon,
      apiKey: `sk_live_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date()
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Devices
app.get('/api/apps/:appId/devices', async (req, res) => {
  try {
    const devices = await Device.find({ appId: req.params.appId });
    res.json(devices);
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.get('/api/devices/:deviceId', async (req, res) => {
  const device = await Device.findOne({ id: req.params.deviceId });
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
});

// Logs (Historical)
app.get('/api/devices/:deviceId/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await Log.find({ deviceId: req.params.deviceId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(logs.reverse());
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Feature Flags
app.get('/api/flags', async (req, res) => {
  const flags = await FeatureFlag.find();
  res.json(flags);
});

app.post('/api/flags', async (req, res) => {
  const flag = new FeatureFlag(req.body);
  await flag.save();
  io.emit('flag:updated', flag); 
  res.json(flag);
});

app.put('/api/flags/:id', async (req, res) => {
  const flag = await FeatureFlag.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  io.emit('flag:updated', flag);
  res.json(flag);
});

// --- Socket.IO Real-time Logic ---

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join_device_session', (deviceId) => {
    socket.join(`session:${deviceId}`);
    console.log(`Socket ${socket.id} joined session:${deviceId}`);
  });

  socket.on('device:connect', async (deviceData) => {
    await Device.findOneAndUpdate({ id: deviceData.id }, { ...deviceData, status: 'online' }, { upsert: true });
    io.emit('device:update', { id: deviceData.id, status: 'online' });
  });

  socket.on('device:log', async (logData) => {
    const log = new Log({
        ...logData, 
        createdAt: new Date(),
        isAnomaly: logData.level === 'error' || logData.message.includes('Exception')
    });
    await log.save();
    io.to(`session:${logData.deviceId}`).emit('log:new', log);
  });

  socket.on('device:screen_frame', (data) => {
    io.to(`session:${data.deviceId}`).emit('screen:frame', data.imageBase64);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// --- Seeder Helper ---
async function seedDataIfNeeded() {
  const appCount = await App.countDocuments();
  if (appCount === 0) {
    console.log('🌱 Seeding initial data...');
    // No initial apps - user must onboarding
    console.log('✅ Seeding skipped (waiting for user onboarding)');
  }
}

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`🚀 SpectraMonitor Backend running on http://localhost:${PORT}`);
});