import { 
  GlobalSettings, 
  FeatureFlag, 
  EmailConfiguration, 
  EmailTemplate,
  SMSConfiguration, 
  SecuritySettings, 
  BackupConfiguration,
  MaintenanceWindow,
  SystemHealth
} from '@/types/settings';

export const mockGlobalSettings: GlobalSettings = {
  id: 'global-1',
  platformName: 'Blunari Restaurant Management',
  platformDescription: 'Complete restaurant booking and management platform',
  supportEmail: 'support@blunari.com',
  supportPhone: '+1 (555) 123-4567',
  defaultTimezone: 'America/New_York',
  defaultCurrency: 'USD',
  defaultLanguage: 'en',
  maintenanceMode: false,
  maintenanceMessage: 'System maintenance in progress. Please check back soon.',
  maxTenantsPerPlan: {
    'free': 1,
    'starter': 3,
    'professional': 10,
    'enterprise': -1
  },
  defaultBookingDuration: 120,
  maxAdvanceBookingDays: 90,
  updatedAt: '2024-01-27T10:30:00Z',
  updatedBy: 'admin@blunari.com'
};

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: 'feature-1',
    key: 'advanced_analytics',
    name: 'Advanced Analytics Dashboard',
    description: 'Enable advanced analytics and reporting features for tenants',
    enabled: true,
    rolloutPercentage: 100,
    environments: ['production', 'staging'],
    category: 'analytics',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-27T10:30:00Z'
  },
  {
    id: 'feature-2',
    key: 'ai_booking_assistant',
    name: 'AI Booking Assistant',
    description: 'AI-powered booking assistant for customer interactions',
    enabled: false,
    rolloutPercentage: 25,
    targetTenants: ['tenant-gold-1', 'tenant-gold-2'],
    environments: ['staging'],
    category: 'experimental',
    dependsOn: ['advanced_analytics'],
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-26T14:20:00Z'
  },
  {
    id: 'feature-3',
    key: 'pos_integration',
    name: 'POS System Integration',
    description: 'Enable integration with Point of Sale systems',
    enabled: true,
    rolloutPercentage: 80,
    environments: ['production', 'staging'],
    category: 'integrations',
    createdAt: '2024-01-10T07:30:00Z',
    updatedAt: '2024-01-25T11:45:00Z'
  },
  {
    id: 'feature-4',
    key: 'mobile_app_v2',
    name: 'Mobile App V2 Interface',
    description: 'New mobile application interface with enhanced UX',
    enabled: true,
    rolloutPercentage: 60,
    environments: ['staging'],
    category: 'ui',
    createdAt: '2024-01-22T16:00:00Z',
    updatedAt: '2024-01-27T09:10:00Z'
  },
  {
    id: 'feature-5',
    key: 'table_optimization',
    name: 'AI Table Optimization',
    description: 'Automatic table assignment optimization using machine learning',
    enabled: false,
    rolloutPercentage: 10,
    environments: ['staging'],
    category: 'booking',
    dependsOn: ['advanced_analytics'],
    createdAt: '2024-01-25T13:20:00Z',
    updatedAt: '2024-01-27T08:50:00Z'
  }
];

export const mockEmailConfiguration: EmailConfiguration = {
  id: 'email-1',
  provider: 'resend',
  fromEmail: 'noreply@blunari.com',
  fromName: 'Blunari Restaurants',
  replyToEmail: 'support@blunari.com',
  apiKey: '••••••••••••••••••••••••••••••••',
  webhookSecret: '••••••••••••••••••••••••••••••••',
  dailyLimit: 10000,
  monthlyLimit: 300000,
  rateLimitPerHour: 1000,
  enableDeliveryTracking: true,
  enableClickTracking: true,
  enableOpenTracking: true,
  bounceHandling: true,
  enabled: true,
  testMode: false,
  smtpEncryption: 'tls',
  updatedAt: '2024-01-27T10:30:00Z'
};

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'template-1',
    key: 'booking_confirmation',
    name: 'Booking Confirmation',
    description: 'Email sent to customers when they make a reservation',
    subject: 'Your reservation at {{restaurant_name}} is confirmed!',
    htmlContent: `<h1>Reservation Confirmed</h1><p>Dear {{guest_name}},</p><p>Your reservation for {{party_size}} people on {{booking_date}} at {{booking_time}} has been confirmed.</p>`,
    textContent: 'Dear {{guest_name}}, Your reservation for {{party_size}} people on {{booking_date}} at {{booking_time}} has been confirmed.',
    variables: [
      { key: 'guest_name', name: 'Guest Name', description: 'Name of the guest making the reservation', required: true },
      { key: 'restaurant_name', name: 'Restaurant Name', description: 'Name of the restaurant', required: true },
      { key: 'party_size', name: 'Party Size', description: 'Number of people in the reservation', required: true },
      { key: 'booking_date', name: 'Booking Date', description: 'Date of the reservation', required: true },
      { key: 'booking_time', name: 'Booking Time', description: 'Time of the reservation', required: true }
    ],
    category: 'booking',
    enabled: true,
    version: '1.2.0',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  },
  {
    id: 'template-2',
    key: 'booking_reminder',
    name: 'Booking Reminder',
    description: 'Reminder email sent 24 hours before the reservation',
    subject: 'Reminder: Your reservation at {{restaurant_name}} tomorrow',
    htmlContent: `<h1>Reservation Reminder</h1><p>Hi {{guest_name}},</p><p>This is a friendly reminder about your reservation tomorrow at {{booking_time}}.</p>`,
    textContent: 'Hi {{guest_name}}, This is a friendly reminder about your reservation tomorrow at {{booking_time}}.',
    variables: [
      { key: 'guest_name', name: 'Guest Name', description: 'Name of the guest', required: true },
      { key: 'restaurant_name', name: 'Restaurant Name', description: 'Name of the restaurant', required: true },
      { key: 'booking_time', name: 'Booking Time', description: 'Time of the reservation', required: true }
    ],
    category: 'booking',
    enabled: true,
    version: '1.1.0',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  },
  {
    id: 'template-3',
    key: 'password_reset',
    name: 'Password Reset',
    description: 'Email sent when users request a password reset',
    subject: 'Reset your Blunari password',
    htmlContent: `<h1>Password Reset</h1><p>Hi {{user_name}},</p><p>Click the link below to reset your password:</p><a href="{{reset_link}}">Reset Password</a>`,
    textContent: 'Hi {{user_name}}, Click the link below to reset your password: {{reset_link}}',
    variables: [
      { key: 'user_name', name: 'User Name', description: 'Name of the user', required: true },
      { key: 'reset_link', name: 'Reset Link', description: 'Password reset link', required: true }
    ],
    category: 'authentication',
    enabled: true,
    version: '1.0.0',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  }
];

export const mockSMSConfiguration: SMSConfiguration = {
  id: 'sms-1',
  provider: 'twilio',
  accountSid: '••••••••••••••••••••••••••••••••',
  authToken: '••••••••••••••••••••••••••••••••',
  fromNumber: '+1555123456789',
  dailyLimit: 1000,
  monthlyLimit: 30000,
  rateLimitPerHour: 100,
  enableDeliveryReceipts: true,
  webhookUrl: 'https://api.blunari.com/webhooks/sms',
  countryCodeWhitelist: ['US', 'CA', 'GB', 'AU'],
  messageTemplates: {
    'booking_confirmation': 'Hi {{guest_name}}! Your reservation at {{restaurant_name}} for {{party_size}} on {{booking_date}} at {{booking_time}} is confirmed.',
    'booking_reminder': 'Reminder: You have a reservation at {{restaurant_name}} tomorrow at {{booking_time}}.',
    'booking_cancellation': 'Your reservation at {{restaurant_name}} has been cancelled. Reply STOP to opt out.'
  },
  complianceSettings: {
    enableOptOut: true,
    optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'QUIT'],
    enableDoubleOptIn: true,
    retentionDays: 365
  },
  enabled: true,
  testMode: false,
  updatedAt: '2024-01-27T10:30:00Z'
};

export const mockSecuritySettings: SecuritySettings = {
  id: 'security-1',
  authenticationPolicy: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    passwordExpirationDays: 90,
    preventPasswordReuse: 5,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    enableTwoFactor: false,
    requireTwoFactorForAdmins: true
  },
  sessionManagement: {
    sessionTimeoutMinutes: 480,
    maxConcurrentSessions: 5,
    enableSessionTracking: true,
    invalidateOnPasswordChange: true,
    enableRememberMe: true,
    rememberMeDurationDays: 30
  },
  rateLimiting: {
    apiRequestsPerMinute: 1000,
    loginAttemptsPerMinute: 10,
    passwordResetAttemptsPerHour: 5,
    enableGlobalRateLimit: true,
    ipWhitelist: [],
    ipBlacklist: []
  },
  dataProtection: {
    enableEncryptionAtRest: true,
    enableEncryptionInTransit: true,
    dataRetentionDays: 2555, // 7 years
    enableActivityLogging: true,
    logRetentionDays: 365,
    enableGDPRCompliance: true
  },
  updatedAt: '2024-01-27T10:30:00Z'
};

export const mockBackupConfiguration: BackupConfiguration = {
  id: 'backup-1',
  automated: {
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    daysOfWeek: [0, 6], // Sunday and Saturday for weekly
    dayOfMonth: 1 // First day of month for monthly
  },
  retention: {
    keepDaily: 7,
    keepWeekly: 4,
    keepMonthly: 12,
    keepYearly: 3
  },
  storage: {
    provider: 's3',
    bucket: 'blunari-backups',
    region: 'us-east-1',
    accessKeyId: '••••••••••••••••••••',
    secretAccessKey: '••••••••••••••••••••••••••••••••••••••••',
    endpoint: 'https://s3.amazonaws.com'
  },
  encryption: {
    enabled: true,
    algorithm: 'AES-256',
    keyRotationDays: 30
  },
  verification: {
    enableIntegrityCheck: true,
    enableTestRestore: true,
    testRestoreFrequency: 'monthly'
  },
  notifications: {
    enableSuccessNotifications: false,
    enableFailureNotifications: true,
    notificationEmails: ['admin@blunari.com', 'devops@blunari.com'],
    webhookUrl: 'https://api.blunari.com/webhooks/backup'
  },
  updatedAt: '2024-01-27T10:30:00Z'
};

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: 'maint-1',
    title: 'Database Performance Optimization',
    description: 'Scheduled database maintenance to improve query performance and update indexes',
    scheduledStart: '2024-02-01T02:00:00Z',
    scheduledEnd: '2024-02-01T04:00:00Z',
    status: 'scheduled',
    impact: 'minimal',
    affectedServices: ['API', 'Database', 'Booking System'],
    notifications: {
      enableAdvanceNotification: true,
      advanceNoticeDays: 3,
      notificationChannels: ['email', 'dashboard']
    },
    rollbackPlan: 'Revert database changes if performance degrades beyond acceptable thresholds',
    contactPerson: 'DevOps Team (devops@blunari.com)',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-27T10:30:00Z'
  },
  {
    id: 'maint-2',
    title: 'Security Updates Deployment',
    description: 'Deploy critical security patches and framework updates',
    scheduledStart: '2024-02-15T01:00:00Z',
    scheduledEnd: '2024-02-15T03:00:00Z',
    status: 'scheduled',
    impact: 'partial',
    affectedServices: ['All Services'],
    notifications: {
      enableAdvanceNotification: true,
      advanceNoticeDays: 7,
      notificationChannels: ['email', 'sms', 'dashboard', 'webhook']
    },
    rollbackPlan: 'Automated rollback to previous version if health checks fail',
    contactPerson: 'Security Team (security@blunari.com)',
    createdAt: '2024-01-26T14:30:00Z',
    updatedAt: '2024-01-27T10:30:00Z'
  }
];

export const mockSystemHealth: SystemHealth = {
  overall: 'healthy',
  components: [
    {
      name: 'API Gateway',
      status: 'operational',
      responseTime: 145,
      uptime: 99.98,
      lastCheck: '2024-01-27T10:29:00Z'
    },
    {
      name: 'Database Primary',
      status: 'operational',
      responseTime: 23,
      uptime: 99.99,
      lastCheck: '2024-01-27T10:29:00Z'
    },
    {
      name: 'Database Replica',
      status: 'operational',
      responseTime: 28,
      uptime: 99.95,
      lastCheck: '2024-01-27T10:29:00Z'
    },
    {
      name: 'Email Service',
      status: 'operational',
      responseTime: 420,
      uptime: 99.92,
      lastCheck: '2024-01-27T10:29:00Z'
    },
    {
      name: 'SMS Service',
      status: 'degraded',
      responseTime: 1240,
      uptime: 98.76,
      lastCheck: '2024-01-27T10:29:00Z'
    },
    {
      name: 'Payment Processing',
      status: 'operational',
      responseTime: 890,
      uptime: 99.89,
      lastCheck: '2024-01-27T10:29:00Z'
    }
  ],
  metrics: {
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 35,
    databaseConnections: 127,
    activeUsers: 1847
  },
  alerts: [
    {
      id: 'alert-1',
      severity: 'warning',
      message: 'SMS service response time above threshold (1240ms > 1000ms)',
      timestamp: '2024-01-27T10:25:00Z',
      resolved: false
    },
    {
      id: 'alert-2',
      severity: 'info',
      message: 'Backup completed successfully at 02:00 UTC',
      timestamp: '2024-01-27T02:05:00Z',
      resolved: true
    }
  ]
};