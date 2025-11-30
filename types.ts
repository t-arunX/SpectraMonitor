
export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  platform: 'ios' | 'android' | 'flutter' | 'react-native';
  apiKey?: string;
  description?: string;
  createdAt?: string;
}

export interface AppHealth {
  score: number; // 0-100
  uxScore: number;
  performanceIndex: number;
  crashFreeSessions: number; // Percentage
  churnRisk: 'Low' | 'Medium' | 'High';
}

export interface Device {
  id: string;
  appId: string;
  model: string;
  osVersion: string;
  batteryLevel: number;
  userName: string;
  status: 'online' | 'background' | 'offline';
  ip: string;
  sessionDuration: string;
  networkSpeed: number; // Mbps
  health: AppHealth;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'fatal';
  message: string;
  tag?: string;
  isAnomaly?: boolean;
}

export interface CrashReport {
  id: string;
  timestamp: string;
  type: 'crash' | 'anr' | 'non-fatal';
  title: string;       // e.g. "RealmCoreAccessor.get"
  subtitle: string;    // e.g. "com.fleet_enable.fms"
  error: string;       // Full error message
  stackTrace: string;
  affectedFile: string;
  reproductionSteps?: string[];
  // Metrics for list view
  eventsCount: number;
  usersCount: number;
  versions: string;
  trend: number[]; // 7 days of data for sparkline
}

export interface DatabaseNode {
  key: string;
  value: any;
  type: 'object' | 'string' | 'number' | 'boolean' | 'array';
  children?: DatabaseNode[];
}

export interface ChatSession {
  id: string;
  status: 'active' | 'archived';
  startedAt: string;
  title: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface Tab {
  id: string;
  type: 'dashboard' | 'device' | 'settings' | 'profile' | 'app-overview';
  title: string;
  data?: any; 
}

export interface AppConfig {
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  showAnomalies: boolean;
}

// --- New Feature Types ---

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
}

export interface PushCampaign {
  id: string;
  name: string;
  topic: string; // e.g., 'all_users', 'beta_testers', 'ios_users'
  status: 'draft' | 'scheduled' | 'sent';
  sentCount: number;
  openRate: number;
  scheduledTime?: string;
}

export interface AnalyticsEvent {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface FunnelStep {
  name: string;
  count: number;
  dropOffRate: number;
}

export interface UserJourneyStep {
  id: string;
  screen: string;
  timestamp: string;
  duration: string;
  action: 'tap' | 'scroll' | 'input' | 'navigation';
  details: string;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified?: string;
  mimeType?: string;
  url?: string; // For images
  children?: FileNode[];
}

export interface SdkConfig {
  apiKey: string;
  endpoint: string;
  logLevel: 'debug' | 'info' | 'error';
  enableCrashReporting: boolean;
  enableAnalytics: boolean;
  sessionTimeout: number;
}

export interface NetworkRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number;
  duration: number; // ms
  timestamp: string;
  size: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
}
