const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  icon: String,
  platform: { type: String, enum: ['ios', 'android', 'flutter', 'react-native'] },
  apiKey: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const DeviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appId: { type: String, required: true },
  model: String,
  osVersion: String,
  batteryLevel: Number,
  userName: String,
  status: { type: String, enum: ['online', 'background', 'offline'] },
  ip: String,
  sessionDuration: String,
  health: {
    score: Number,
    uxScore: Number,
    performanceIndex: Number,
    crashFreeSessions: Number,
    churnRisk: String
  },
  lastSeen: { type: Date, default: Date.now }
});

const LogSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  level: { type: String, enum: ['info', 'warn', 'error', 'debug', 'fatal'] },
  message: String,
  tag: String,
  timestamp: String, 
  isAnomaly: Boolean,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }
});

const CrashReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appId: String,
  timestamp: String,
  type: String,
  title: String,
  subtitle: String,
  error: String,
  stackTrace: String,
  affectedFile: String,
  eventsCount: Number,
  usersCount: Number,
  trend: [Number]
});

const FeatureFlagSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appId: String,
  key: String,
  name: String,
  description: String,
  enabled: Boolean,
  rolloutPercentage: Number
});

module.exports = {
  App: mongoose.model('App', AppSchema),
  Device: mongoose.model('Device', DeviceSchema),
  Log: mongoose.model('Log', LogSchema),
  CrashReport: mongoose.model('CrashReport', CrashReportSchema),
  FeatureFlag: mongoose.model('FeatureFlag', FeatureFlagSchema)
};