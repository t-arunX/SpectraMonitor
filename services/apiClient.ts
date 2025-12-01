import { AppDefinition, Device, LogEntry, FeatureFlag } from '../types';

const API_URL = '/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:9090/ws';

class ApiClient {
  private socket: WebSocket | null = null;
  private logCallbacks: ((log: LogEntry) => void)[] = [];
  private screenCallbacks: ((base64: string) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

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

  async deleteApp(appId: string): Promise<void> {
    const res = await fetch(`${API_URL}/apps/${appId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to delete app');
  }

  async getDevices(appId: string): Promise<Device[]> {
    try {
      const res = await fetch(`${API_URL}/apps/${appId}/devices`);
      return res.json();
    } catch (e) { return []; }
  }

  async createDevice(appId: string, device: Partial<Device>): Promise<Device> {
    const res = await fetch(`${API_URL}/apps/${appId}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });
    if (!res.ok) throw new Error('Failed to create device');
    return res.json();
  }

  async getLogs(device: Device,deviceId: string): Promise<LogEntry[]> {
    try {
      console.log('deviceId'+ deviceId);
      console.log('device'+ device.userName);
      console.log('device'+ device.batteryLevel);
      console.log('device'+ device.osVersion);
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

  // --- Real-time Methods (Native WebSocket) ---

  connectSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('✅ WebSocket Connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { event: eventName, data } = message;

          if (eventName === 'log:new') {
            this.logCallbacks.forEach(cb => cb(data));
          } else if (eventName === 'screen:frame') {
            this.screenCallbacks.forEach(cb => cb(data));
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
      };

      this.socket.onclose = () => {
        console.log('❌ WebSocket Disconnected');
        this.attemptReconnect();
      };
    } catch (e) {
      console.error('Failed to connect WebSocket:', e);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      setTimeout(() => this.connectSocket(), delay);
    }
  }

  joinDeviceSession(deviceId: string) {
    this.ensureConnection(() => {
      this.sendMessage('join_device_session', { deviceId });
    });
  }

  onNewLog(callback: (log: LogEntry) => void) {
    this.logCallbacks.push(callback);
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
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.logCallbacks = [];
    this.screenCallbacks = [];
  }

  private sendMessage(event: string, data: unknown) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, data }));
    }
  }

  private ensureConnection(action: () => void) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.connectSocket();
      const checkConnection = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          clearInterval(checkConnection);
          action();
        }
      }, 100);
      setTimeout(() => clearInterval(checkConnection), 5000);
    } else {
      action();
    }
  }
}

export const apiClient = new ApiClient();