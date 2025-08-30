import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Clock, 
  DollarSign, 
  Globe, 
  Bell, 
  Shield, 
  Palette,
  Save,
  RefreshCw,
  Key,
  User,
  Copy,
  RotateCcw,
  Eye,
  EyeOff,
  Edit,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TenantConfigurationProps {
  tenantId: string;
}

interface TenantSettings {
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  status: string;
}

interface TenantFeature {
  id: string;
  feature_key: string;
  enabled: boolean;
  feature_name?: string;
}

interface TenantCredentials {
  owner_email: string;
  tenant_slug: string;
  tenant_id: string;
  created_at: string;
}

export function TenantConfiguration({ tenantId }: TenantConfigurationProps) {
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [features, setFeatures] = useState<TenantFeature[]>([]);
  const [credentials, setCredentials] = useState<TenantCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changingCredentials, setChangingCredentials] = useState(false);
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // Only shows generated passwords
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTenantConfiguration();
  }, [tenantId]);

  const fetchTenantConfiguration = async () => {
    setLoading(true);
    try {
      // Fetch tenant settings
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (tenantError) throw tenantError;
      setSettings(tenantData);

      // Fetch tenant features
      const { data: featuresData, error: featuresError } = await supabase
        .from('tenant_features')
        .select('*')
        .eq('tenant_id', tenantId);

      if (featuresError) throw featuresError;
      setFeatures(featuresData || []);

      // Fetch tenant credentials (owner info)
      // First try to get from auto_provisioning
      const { data: provisioningData } = await supabase
        .from('auto_provisioning')
        .select('user_id, tenant_id, created_at')
        .eq('tenant_id', tenantId)
        .eq('status', 'completed')
        .maybeSingle();

      if (provisioningData) {
        // Fetch user profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', provisioningData.user_id)
          .single();

        if (profileData) {
          setCredentials({
            owner_email: profileData.email,
            tenant_slug: tenantData.slug,
            tenant_id: tenantId,
            created_at: provisioningData.created_at
          });
          // Don't set currentPassword - existing passwords can't be displayed
        }
      } else {
        // Fallback: use tenant's email if auto_provisioning not found
        if (tenantData.email) {
          setCredentials({
            owner_email: tenantData.email,
            tenant_slug: tenantData.slug,
            tenant_id: tenantId,
            created_at: tenantData.created_at
          });
          // Don't set currentPassword - existing passwords can't be displayed
          console.log('[CREDENTIALS] Using tenant email as fallback:', tenantData.email);
        } else {
          console.warn('[CREDENTIALS] No auto_provisioning record and no tenant email found');
          // Still set basic info even without email
          setCredentials({
            owner_email: 'admin@unknown.com', // Placeholder
            tenant_slug: tenantData.slug,
            tenant_id: tenantId,
            created_at: tenantData.created_at
          });
        }
      }

    } catch (error) {
      console.error('Error fetching tenant configuration:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenant configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name: settings.name,
          description: settings.description,
          phone: settings.phone,
          email: settings.email,
          website: settings.website,
          timezone: settings.timezone,
          currency: settings.currency,
          status: settings.status
        })
        .eq('id', tenantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant settings updated successfully"
      });
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureToggle = async (featureKey: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('tenant_features')
        .update({ enabled })
        .eq('tenant_id', tenantId)
        .eq('feature_key', featureKey);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(feature => 
          feature.feature_key === featureKey 
            ? { ...feature, enabled }
            : feature
        )
      );

      toast({
        title: "Success",
        description: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive"
      });
    }
  };

  const getFeatureName = (featureKey: string) => {
    const featureNames: Record<string, string> = {
      'basic_booking': 'Basic Booking System',
      'email_notifications': 'Email Notifications',
      'basic_analytics': 'Analytics Dashboard',
      'widget_integration': 'Widget Integration',
      'advanced_booking': 'Advanced Booking Features',
      'pos_integration': 'POS Integration',
      'custom_branding': 'Custom Branding',
      'api_access': 'API Access'
    };
    return featureNames[featureKey] || featureKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
  const statuses = ['active', 'inactive', 'suspended'];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateNewPassword = async () => {
    if (!credentials) return;

    setChangingCredentials(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-tenant-credentials', {
        body: {
          tenantId,
          action: 'reset_password'
        }
      });

      if (error) throw error;

      toast({
        title: "Password Reset",
        description: "Password reset email has been sent to the tenant owner",
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setChangingCredentials(false);
    }
  };

  const changeOwnerEmail = async () => {
    if (!newOwnerEmail || !credentials) return;
    
    setChangingCredentials(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-tenant-credentials', {
        body: {
          tenantId,
          action: 'update_email',
          newEmail: newOwnerEmail
        }
      });

      if (error) throw error;

      // Update local state
      setCredentials({
        ...credentials,
        owner_email: newOwnerEmail
      });

      setIsEditingEmail(false);
      setNewOwnerEmail('');

      toast({
        title: "Success",
        description: "Owner email updated successfully"
      });
    } catch (error) {
      console.error('Error updating owner email:', error);
      toast({
        title: "Error",
        description: "Failed to update owner email",
        variant: "destructive"
      });
    } finally {
      setChangingCredentials(false);
    }
  };

  const generateDirectPassword = async () => {
    if (!credentials) return;

    setChangingCredentials(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-tenant-credentials', {
        body: {
          tenantId,
          action: 'generate_password'
        }
      });

      if (error) throw error;

      const newPassword = data.newPassword;
      setCurrentPassword(newPassword);
      
      toast({
        title: "New Password Generated",
        description: `New password: ${newPassword}. Copied to clipboard. Share securely with tenant.`,
      });
      
      // Copy to clipboard automatically
      await navigator.clipboard.writeText(newPassword);
      
    } catch (error) {
      console.error('Error generating new password:', error);
      toast({
        title: "Error",
        description: "Failed to generate new password",
        variant: "destructive"
      });
    } finally {
      setChangingCredentials(false);
    }
  };

  const startEmailEdit = () => {
    if (credentials) {
      setNewOwnerEmail(credentials.owner_email);
      setIsEditingEmail(true);
    }
  };

  const cancelEmailEdit = () => {
    setNewOwnerEmail('');
    setIsEditingEmail(false);
  };

  const changePassword = async () => {
    if (!newPassword || !credentials) return;
    
    setChangingCredentials(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-tenant-credentials', {
        body: {
          tenantId,
          action: 'update_password',
          newPassword: newPassword
        }
      });

      if (error) throw error;

      // Update the current password state to reflect the change
      setCurrentPassword(newPassword);
      
      toast({
        title: "Password Updated",
        description: "Password has been successfully updated for the tenant owner",
      });
      
      setIsEditingPassword(false);
      setNewPassword('');
      
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setChangingCredentials(false);
    }
  };

  const startPasswordEdit = () => {
    setNewPassword('');
    setIsEditingPassword(true);
  };

  const cancelPasswordEdit = () => {
    setNewPassword('');
    setIsEditingPassword(false);
    setShowPassword(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Configuration not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Settings
          </CardTitle>
          <CardDescription>
            Core tenant information and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={settings.slug}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Slug cannot be changed after creation</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, email: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, phone: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={settings.website || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, website: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={settings.status}
                onValueChange={(value) => setSettings(prev => prev ? { ...prev, status: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, description: e.target.value } : null)}
              placeholder="Brief description of the restaurant..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Settings
          </CardTitle>
          <CardDescription>
            Timezone and currency configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings(prev => prev ? { ...prev, timezone: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings(prev => prev ? { ...prev, currency: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Feature Management
          </CardTitle>
          <CardDescription>
            Enable or disable specific features for this tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{getFeatureName(feature.feature_key)}</h4>
                    <Badge variant={feature.enabled ? "default" : "secondary"}>
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Feature key: {feature.feature_key}
                  </p>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={(checked) => handleFeatureToggle(feature.feature_key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Login Credentials
          </CardTitle>
          <CardDescription>
            Tenant owner login information and account access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {credentials ? (
            <div className="space-y-6">
              {credentials.owner_email === 'admin@unknown.com' && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Email Not Found</h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        No owner email found for this tenant. You can set one using the email field above, then use the credential management functions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Owner Email
                  </Label>
                  <div className="flex items-center gap-2">
                    {isEditingEmail ? (
                      <>
                        <Input
                          value={newOwnerEmail}
                          onChange={(e) => setNewOwnerEmail(e.target.value)}
                          placeholder="Enter new email"
                          className="flex-1"
                          type="email"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={changeOwnerEmail}
                          disabled={changingCredentials || !newOwnerEmail}
                        >
                          {changingCredentials ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={cancelEmailEdit}
                          disabled={changingCredentials}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          value={credentials.owner_email}
                          readOnly
                          className="bg-muted flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(credentials.owner_email, "Email")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startEmailEdit}
                          title="Change owner email"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isEditingEmail ? "Enter new email address for tenant owner" : "Primary login email address"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex items-center gap-2">
                    {isEditingPassword ? (
                      <>
                        <Input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="flex-1"
                          type={showPassword ? "text" : "password"}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={changePassword}
                          disabled={changingCredentials || !newPassword}
                        >
                          {changingCredentials ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={cancelPasswordEdit}
                          disabled={changingCredentials}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          value={currentPassword ? (showPassword ? currentPassword : "••••••••••••") : "••••••••••••"}
                          readOnly
                          type="password"
                          className="bg-muted flex-1"
                          placeholder={currentPassword ? "" : "Existing password (cannot be displayed)"}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={!currentPassword}
                          title={currentPassword ? "Toggle password visibility" : "Password can only be viewed after generating a new one"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={generateNewPassword}
                          title="Send password reset email"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startPasswordEdit}
                          title="Edit password directly"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isEditingPassword ? "Enter new password for tenant owner" : currentPassword ? "Click the eye to view generated password" : "Existing passwords cannot be displayed. Generate a new password to view it."}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Support Actions */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Support Actions</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                      Use these actions carefully. All credential changes are logged for security purposes.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={generateDirectPassword}
                        disabled={changingCredentials}
                      >
                        {changingCredentials ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                        Generate New Password
                      </Button>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                      Generates a temporary password and copies it to clipboard. Share securely with tenant.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Tenant ID</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={credentials.tenant_id}
                      readOnly
                      className="bg-muted font-mono text-xs flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(credentials.tenant_id, "Tenant ID")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Unique tenant identifier</p>
                </div>

                <div className="space-y-2">
                  <Label>Access URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`https://app.blunari.com/${credentials.tenant_slug}`}
                      readOnly
                      className="bg-muted flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(`https://app.blunari.com/${credentials.tenant_slug}`, "Access URL")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Direct login URL for this tenant</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Account Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(credentials.created_at).toLocaleDateString()} at {new Date(credentials.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No login credentials found for this tenant</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={fetchTenantConfiguration}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}