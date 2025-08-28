import { 
  UserProfile, 
  SecuritySettings, 
  NotificationPreferences, 
  UserSession, 
  ActivityLog, 
  ThemePreferences,
  APIKey,
  TrustedDevice
} from '@/types/profile';

export const mockUserProfile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@blunari.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c4?w=150&h=150&fit=crop&crop=face',
  jobTitle: 'Senior Product Manager',
  department: 'Product',
  bio: 'Passionate about creating exceptional user experiences and driving product innovation in the restaurant technology space.',
  timezone: 'America/New_York',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  createdAt: '2023-03-15T08:00:00Z',
  updatedAt: '2024-01-27T14:30:00Z'
};

export const mockSecuritySettings: SecuritySettings = {
  id: 'security-1',
  userId: 'user-1',
  twoFactorEnabled: true,
  backupCodes: [
    '12345678',
    '87654321',
    '11223344',
    '44332211',
    '55667788'
  ],
  passwordLastChanged: '2024-01-15T10:00:00Z',
  sessionTimeout: 480, // 8 hours
  apiKeysEnabled: true,
  loginNotificationsEnabled: true,
  securityEmailsEnabled: true,
  trustedDevices: [
    {
      id: 'device-1',
      name: 'MacBook Pro',
      deviceType: 'desktop',
      browser: 'Chrome 120.0',
      os: 'macOS 14.0',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      lastSeen: '2024-01-27T14:25:00Z',
      trusted: true,
      createdAt: '2023-03-15T08:00:00Z'
    },
    {
      id: 'device-2',
      name: 'iPhone 15 Pro',
      deviceType: 'mobile',
      browser: 'Safari 17.0',
      os: 'iOS 17.2',
      location: 'New York, NY',
      ipAddress: '192.168.1.101',
      lastSeen: '2024-01-27T12:15:00Z',
      trusted: true,
      createdAt: '2023-08-20T14:30:00Z'
    }
  ],
  updatedAt: '2024-01-27T14:30:00Z'
};

export const mockNotificationPreferences: NotificationPreferences = {
  id: 'notifications-1',
  userId: 'user-1',
  emailNotifications: {
    bookingConfirmations: true,
    systemAlerts: true,
    weeklyReports: true,
    securityAlerts: true,
    accountUpdates: true,
    marketingEmails: false
  },
  smsNotifications: {
    urgentAlerts: true,
    bookingReminders: false,
    systemDowntime: true,
    securityAlerts: true
  },
  dashboardNotifications: {
    realTimeUpdates: true,
    showToasts: true,
    soundEnabled: false,
    desktopNotifications: true
  },
  frequency: 'immediate',
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
    timezone: 'America/New_York'
  },
  updatedAt: '2024-01-27T14:30:00Z'
};

export const mockUserSessions: UserSession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    sessionToken: 'session_current_token',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      browser: 'Chrome 120.0',
      os: 'macOS 14.0',
      device: 'MacBook Pro',
      isMobile: false
    },
    location: {
      ip: '192.168.1.100',
      country: 'United States',
      city: 'New York',
      region: 'NY'
    },
    createdAt: '2024-01-27T09:00:00Z',
    lastActiveAt: '2024-01-27T14:30:00Z',
    expiresAt: '2024-02-03T09:00:00Z',
    isActive: true,
    isCurrent: true
  },
  {
    id: 'session-2',
    userId: 'user-1',
    sessionToken: 'session_mobile_token',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15',
      browser: 'Safari 17.0',
      os: 'iOS 17.2',
      device: 'iPhone 15 Pro',
      isMobile: true
    },
    location: {
      ip: '192.168.1.101',
      country: 'United States',
      city: 'New York',
      region: 'NY'
    },
    createdAt: '2024-01-26T18:00:00Z',
    lastActiveAt: '2024-01-27T12:15:00Z',
    expiresAt: '2024-02-02T18:00:00Z',
    isActive: true,
    isCurrent: false
  },
  {
    id: 'session-3',
    userId: 'user-1',
    sessionToken: 'session_old_token',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      browser: 'Firefox 119.0',
      os: 'Windows 11',
      device: 'Dell XPS 13',
      isMobile: false
    },
    location: {
      ip: '203.0.113.50',
      country: 'United States',
      city: 'San Francisco',
      region: 'CA'
    },
    createdAt: '2024-01-20T10:00:00Z',
    lastActiveAt: '2024-01-25T16:30:00Z',
    expiresAt: '2024-01-27T10:00:00Z',
    isActive: false,
    isCurrent: false
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    action: 'login',
    actionType: 'authentication',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    metadata: {
      method: 'email_password',
      deviceTrusted: true,
      location: 'New York, NY'
    },
    success: true,
    timestamp: '2024-01-27T09:00:00Z'
  },
  {
    id: 'activity-2',
    userId: 'user-1',
    action: 'update_profile',
    actionType: 'profile',
    description: 'Profile information updated',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    metadata: {
      fieldsChanged: ['phone', 'bio'],
      previousValues: {
        phone: '+1 (555) 123-4566',
        bio: 'Previous bio content'
      }
    },
    success: true,
    timestamp: '2024-01-27T11:30:00Z'
  },
  {
    id: 'activity-3',
    userId: 'user-1',
    action: 'enable_2fa',
    actionType: 'security',
    description: 'Two-factor authentication enabled',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    metadata: {
      method: 'totp',
      backupCodesGenerated: 5
    },
    success: true,
    timestamp: '2024-01-26T14:15:00Z'
  },
  {
    id: 'activity-4',
    userId: 'user-1',
    action: 'create_api_key',
    actionType: 'security',
    description: 'API key created',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    metadata: {
      keyName: 'Analytics Integration',
      permissions: ['read:analytics', 'read:bookings']
    },
    resourceType: 'api_key',
    resourceId: 'api-key-1',
    success: true,
    timestamp: '2024-01-25T16:45:00Z'
  },
  {
    id: 'activity-5',
    userId: 'user-1',
    action: 'failed_login',
    actionType: 'authentication',
    description: 'Failed login attempt - incorrect password',
    ipAddress: '203.0.113.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    metadata: {
      method: 'email_password',
      reason: 'invalid_credentials',
      location: 'Unknown'
    },
    success: false,
    timestamp: '2024-01-24T03:22:00Z'
  }
];

export const mockThemePreferences: ThemePreferences = {
  id: 'theme-1',
  userId: 'user-1',
  theme: 'light',
  accentColor: '#3B82F6',
  compactMode: false,
  sidebarCollapsed: false,
  fontSize: 'medium',
  animationsEnabled: true,
  highContrast: false,
  reducedMotion: false,
  updatedAt: '2024-01-27T14:30:00Z'
};

export const mockAPIKeys: APIKey[] = [
  {
    id: 'api-key-1',
    userId: 'user-1',
    name: 'Analytics Integration',
    description: 'API key for external analytics dashboard integration',
    keyPreview: 'ak_live_12345678...',
    permissions: ['read:analytics', 'read:bookings', 'read:customers'],
    expiresAt: '2024-12-31T23:59:59Z',
    lastUsedAt: '2024-01-27T10:15:00Z',
    isActive: true,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-27T10:15:00Z'
  },
  {
    id: 'api-key-2',
    userId: 'user-1',
    name: 'Mobile App Development',
    description: 'Development API key for mobile application testing',
    keyPreview: 'ak_test_87654321...',
    permissions: ['read:tenants', 'write:bookings'],
    expiresAt: '2024-06-30T23:59:59Z',
    lastUsedAt: '2024-01-26T14:20:00Z',
    isActive: true,
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-26T14:20:00Z'
  },
  {
    id: 'api-key-3',
    userId: 'user-1',
    name: 'Webhook Testing',
    description: 'Temporary key for webhook endpoint testing',
    keyPreview: 'ak_live_99887766...',
    permissions: ['write:webhooks'],
    isActive: false,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-22T15:30:00Z'
  }
];