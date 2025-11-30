import { AppDefinition, Device, LogEntry, FeatureFlag } from '../types';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:8080/api';
const SOCKET_URL = 'http://localhost:8080';

class ApiClient {
  private socket: Socket | null = null;
  private logCallbacks: ((log: LogEntry) => void)[] = [];
  private screenCallbacks: ((base64: string) => void)[] = [];

  constructor() {
    // Lazy connection on usage
  }

  // --- REST Methods ---

  async getApps(): Promise<AppDefinition[]> {
    try {
      const res = await fetch(`${API_URL}/apps`);
      if (!res.ok) throw new Error('Failed to fetch apps');
      return res.json();
    } catch (e) {
      console.warn("Backend unavailable or network error", e);
      return []; 
    }
  }

  async createApp(app: Partial<AppDefinition>): Promise<AppDefinition> {
    const res = await fetch(`${API_URL}/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });
    if (!res.ok) throw new Error('Failed to create app');
    return res.json();
  }

  async getDevices(appId: string): Promise<Device[]> {
    try {
      const res = await fetch(`${API_URL}/apps/${appId}/devices`);
      return res.json();
    } catch (e) { return []; }
  }

  async getLogs(deviceId: string): Promise<LogEntry[]> {
    try {
      const res = await fetch(`${API_URL}/devices/${deviceId}/logs`);
      return res.json();
    } catch (e) { return []; }
  }

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const res = await fetch(`${API_URL}/flags`);
      return res.json();
    } catch (e) { return []; }
  }

  async updateFeatureFlag(id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const res = await fetch(`${API_URL}/flags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // --- Real-time Methods (Socket.IO for Node Backend) ---

  connectSocket() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
        transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO Connected');
    });

    this.socket.on('log:new', (log: LogEntry) => {
        this.logCallbacks.forEach(cb => cb(log));
    });

    this.socket.on('screen:frame', (base64: string) => {
        this.screenCallbacks.forEach(cb => cb(base64));
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO Disconnected');
    });
  }

  joinDeviceSession(deviceId: string) {
    this.ensureConnection(() => {
      this.socket?.emit('join_device_session', deviceId);
    });
  }

  onNewLog(callback: (log: LogEntry) => void) {
    this.logCallbacks.push(callback);
    // Return unsubscribe function if needed, but for now simple push
    return () => {
        this.logCallbacks = this.logCallbacks.filter(cb => cb !== callback);
    };
  }

  onScreenFrame(callback: (base64: string) => void) {
    this.screenCallbacks.push(callback);
    return () => {
        this.screenCallbacks = this.screenCallbacks.filter(cb => cb !== callback);
    };
  }

  disconnectSocket() {
    this.socket?.disconnect();
    this.socket = null;
    this.logCallbacks = [];
    this.screenCallbacks = [];
  }

  private ensureConnection(action: () => void) {
    if (!this.socket || !this.socket.connected) {
      this.connectSocket();
      this.socket?.once('connect', action);
    } else {
      action();
    }
  }
}

export const apiClient = new ApiClient();