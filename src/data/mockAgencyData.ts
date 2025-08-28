import { AgencyPartner, DemoTenant, AgencyKit, RevenueAnalytics, DemoTemplate } from '@/types/agency';

export const mockPartners: AgencyPartner[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@digitalrestaurants.com',
    company: 'Digital Restaurants Pro',
    tier: 'Gold',
    status: 'Active',
    joinedAt: '2023-03-15',
    lastActive: '2024-01-27',
    totalCommission: 24500,
    monthlyCommission: 3200,
    conversionRate: 68,
    satisfactionScore: 4.8,
    demoTenantsCreated: 45,
    activeDemos: 8,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c4?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    website: 'https://digitalrestaurants.com'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@hospitalitytech.io',
    company: 'Hospitality Tech Solutions',
    tier: 'Silver',
    status: 'Active',
    joinedAt: '2023-08-22',
    lastActive: '2024-01-26',
    totalCommission: 15800,
    monthlyCommission: 1950,
    conversionRate: 52,
    satisfactionScore: 4.5,
    demoTenantsCreated: 28,
    activeDemos: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 987-6543',
    website: 'https://hospitalitytech.io'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily@localwebpartners.com',
    company: 'Local Web Partners',
    tier: 'Bronze',
    status: 'Active',
    joinedAt: '2023-11-10',
    lastActive: '2024-01-25',
    totalCommission: 8200,
    monthlyCommission: 1100,
    conversionRate: 41,
    satisfactionScore: 4.2,
    demoTenantsCreated: 19,
    activeDemos: 3,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
    website: 'https://localwebpartners.com'
  }
];

export const mockDemoTenants: DemoTenant[] = [
  {
    id: 'demo-1',
    name: 'Bella Vista Ristorante',
    template: 'Italian',
    createdAt: '2024-01-20',
    expiresAt: '2024-01-27',
    status: 'Active',
    partnerId: '1',
    partnerName: 'Sarah Chen',
    demoUrl: 'https://demo.blunari.com/bella-vista-ristorante',
    views: 147,
    bookings: 12,
    lastAccessed: '2024-01-26',
    clientEmail: 'owner@bellavista.com',
    notes: 'High-end Italian restaurant chain expansion demo'
  },
  {
    id: 'demo-2',
    name: 'The Golden Spoon',
    template: 'Fine Dining',
    createdAt: '2024-01-22',
    expiresAt: '2024-01-29',
    status: 'Active',
    partnerId: '2',
    partnerName: 'Marcus Rodriguez',
    demoUrl: 'https://demo.blunari.com/golden-spoon',
    views: 89,
    bookings: 8,
    lastAccessed: '2024-01-25',
    clientEmail: 'mgr@goldenspoon.com',
    notes: 'Michelin-starred restaurant looking for booking solution'
  },
  {
    id: 'demo-3',
    name: 'Corner Café',
    template: 'Coffee Shop',
    createdAt: '2024-01-18',
    expiresAt: '2024-01-25',
    status: 'Expired',
    partnerId: '3',
    partnerName: 'Emily Watson',
    demoUrl: 'https://demo.blunari.com/corner-cafe',
    views: 234,
    bookings: 18,
    lastAccessed: '2024-01-24',
    clientEmail: 'hello@cornercafe.local',
    notes: 'Local coffee shop chain pilot program'
  }
];

export const mockAgencyKits: AgencyKit[] = [
  {
    id: 'kit-1',
    name: 'WordPress Booking Plugin',
    version: '2.1.4',
    description: 'Complete WordPress plugin with booking widget integration',
    downloadUrl: '/downloads/blunari-wp-plugin-v2.1.4.zip',
    fileSize: '2.3 MB',
    lastUpdated: '2024-01-15',
    downloadCount: 1247,
    type: 'WordPress Plugin'
  },
  {
    id: 'kit-2',
    name: 'HTML Integration Kit',
    version: '1.8.2',
    description: 'Standalone HTML/CSS/JS widgets for any website',
    downloadUrl: '/downloads/blunari-html-kit-v1.8.2.zip',
    fileSize: '890 KB',
    lastUpdated: '2024-01-10',
    downloadCount: 892,
    type: 'HTML Kit'
  },
  {
    id: 'kit-3',
    name: 'Integration Documentation',
    version: '3.0.1',
    description: 'Complete API documentation and integration guides',
    downloadUrl: '/downloads/blunari-docs-v3.0.1.pdf',
    fileSize: '1.1 MB',
    lastUpdated: '2024-01-20',
    downloadCount: 2156,
    type: 'Documentation'
  },
  {
    id: 'kit-4',
    name: 'Brand Assets Package',
    version: '1.2.0',
    description: 'Logos, marketing materials, and presentation templates',
    downloadUrl: '/downloads/blunari-brand-assets-v1.2.0.zip',
    fileSize: '4.7 MB',
    lastUpdated: '2024-01-12',
    downloadCount: 654,
    type: 'Branding Assets'
  }
];

export const mockRevenueAnalytics: RevenueAnalytics = {
  period: 'January 2024',
  totalRevenue: 89500,
  commissionPaid: 6250,
  averageCommissionRate: 12.5,
  topPartners: [
    { partnerId: '1', name: 'Sarah Chen', revenue: 3200, growth: 15.2 },
    { partnerId: '2', name: 'Marcus Rodriguez', revenue: 1950, growth: 8.7 },
    { partnerId: '3', name: 'Emily Watson', revenue: 1100, growth: 22.1 }
  ],
  conversionMetrics: {
    demoToTrial: 34.5,
    trialToPayment: 68.2,
    overallConversion: 23.5
  }
};

export const mockDemoTemplates: DemoTemplate[] = [
  {
    id: 'Italian',
    name: 'Italian Restaurant',
    description: 'Perfect for authentic Italian dining experiences with warm, family-oriented atmosphere',
    features: ['Wine pairing recommendations', 'Large party booking', 'Chef specials rotation', 'Allergen management'],
    previewImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    estimatedSetupTime: '3 minutes',
    category: 'Ethnic Cuisine',
    popularityScore: 92
  },
  {
    id: 'Fine Dining',
    name: 'Fine Dining',
    description: 'Elegant solution for upscale restaurants focusing on exceptional service and ambiance',
    features: ['Tasting menu management', 'VIP reservation tiers', 'Sommelier notes', 'Private dining rooms'],
    previewImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    estimatedSetupTime: '4 minutes',
    category: 'Premium Dining',
    popularityScore: 87
  },
  {
    id: 'Casual',
    name: 'Casual Dining',
    description: 'Flexible template for family restaurants, sports bars, and casual dining establishments',
    features: ['Quick booking flow', 'Group reservations', 'Takeout integration', 'Event hosting'],
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    estimatedSetupTime: '2 minutes',
    category: 'Family Friendly',
    popularityScore: 95
  },
  {
    id: 'Coffee Shop',
    name: 'Coffee Shop',
    description: 'Streamlined booking for cafés, coffee shops, and quick-service establishments',
    features: ['Express booking', 'Table time limits', 'Study space booking', 'Event reservations'],
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
    estimatedSetupTime: '90 seconds',
    category: 'Quick Service',
    popularityScore: 78
  }
];