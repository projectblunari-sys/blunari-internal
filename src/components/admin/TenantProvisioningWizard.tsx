import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  User, 
  CreditCard, 
  Settings, 
  MessageSquare, 
  Phone,
  Globe,
  Eye,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAdminAPI } from '@/hooks/useAdminAPI';
import { useToast } from '@/hooks/use-toast';
import type { ProvisioningRequestData } from '@/types/admin';
import { ProvisioningRequestSchema } from '@/types/admin';
import { z } from 'zod';

interface ProvisioningWizardProps {
  onComplete?: (result: any) => void;
  onCancel?: () => void;
}

export function TenantProvisioningWizard({ onComplete, onCancel }: ProvisioningWizardProps) {
  const [loading, setLoading] = useState(false);
  const [idempotencyKey] = useState(crypto.randomUUID());
  const navigate = useNavigate();
  const { provisionTenant } = useAdminAPI();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProvisioningRequestData>({
    basics: {
      name: '',
      timezone: 'America/New_York',
      currency: 'USD',
      slug: '',
    },
    owner: {
      email: '',
      sendInvite: true,
    },
    access: {
      mode: 'standard',
    },
    seed: {
      seatingPreset: 'standard',
      enablePacing: false,
      enableDepositPolicy: false,
    },
    billing: {
      createSubscription: false,
      plan: 'basic',
    },
    sms: {
      startRegistration: false,
    },
    idempotencyKey,
  });

  const [result, setResult] = useState<any>(null);

  const handleInputChange = (section: keyof ProvisioningRequestData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  // Auto-generate slug from name
  React.useEffect(() => {
    if (formData.basics.name && !formData.basics.slug) {
      const slug = formData.basics.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      handleInputChange('basics', 'slug', slug);
    }
  }, [formData.basics.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      const validatedData = ProvisioningRequestSchema.parse(formData);
      
      // Submit provisioning request
      const provisioningResult = await provisionTenant(validatedData);
      
      setResult(provisioningResult);
      
      if (provisioningResult.success) {
        toast({
          title: "Tenant Provisioned Successfully! 🎉",
          description: provisioningResult.message || "Tenant has been created and configured.",
        });
        
        if (onComplete) {
          onComplete(provisioningResult);
        }
      } else {
        throw new Error(provisioningResult.error || 'Provisioning failed');
      }
    } catch (error) {
      console.error('Provisioning error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof z.ZodError) {
        errorMessage = error.errors[0]?.message || 'Validation failed';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Provisioning Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/admin/tenants');
    }
  };

  // Show results if provisioning completed
  if (result?.success) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <Building2 className="h-5 w-5" />
              Tenant Provisioned Successfully
            </CardTitle>
            <CardDescription>
              {formData.basics.name} has been successfully created and configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {result.runId && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Run ID</Label>
                  <p className="font-mono text-sm">{result.runId}</p>
                </div>
              )}
              {result.tenantId && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tenant ID</Label>
                  <p className="font-mono text-sm">{result.tenantId}</p>
                </div>
              )}
              {result.slug && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Slug</Label>
                  <p className="font-mono text-sm">/{result.slug}</p>
                </div>
              )}
              {result.primaryUrl && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Primary URL</Label>
                  <p className="font-mono text-sm">{result.primaryUrl}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => navigate(`/admin/tenants/${result.tenantId}`)}
                variant="default"
              >
                <Eye className="h-4 w-4 mr-2" />
                Go to Tenant
              </Button>
              
              {result.primaryUrl && (
                <Button
                  onClick={() => window.open(result.primaryUrl, '_blank')}
                  variant="outline"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Open Client Dashboard
                </Button>
              )}
              
              <Button
                onClick={() => navigate('/admin/operations')}
                variant="ghost"
              >
                <Settings className="h-4 w-4 mr-2" />
                View Observability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Provisioning</h1>
          <p className="text-muted-foreground">Create and configure a new restaurant tenant</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.basics.name}
                  onChange={(e) => handleInputChange('basics', 'name', e.target.value)}
                  placeholder="Amazing Restaurant"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.basics.slug}
                  onChange={(e) => handleInputChange('basics', 'slug', e.target.value)}
                  placeholder="amazing-restaurant"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.basics.timezone}
                  onValueChange={(value) => handleInputChange('basics', 'timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.basics.currency}
                  onValueChange={(value) => handleInputChange('basics', 'currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Owner Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="owner-email">Owner Email *</Label>
              <Input
                id="owner-email"
                type="email"
                value={formData.owner.email}
                onChange={(e) => handleInputChange('owner', 'email', e.target.value)}
                placeholder="owner@restaurant.com"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Send Welcome Email</Label>
                <p className="text-sm text-muted-foreground">
                  Send setup instructions to the owner
                </p>
              </div>
              <Switch
                checked={formData.owner.sendInvite}
                onCheckedChange={(checked) => handleInputChange('owner', 'sendInvite', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Access Mode</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  type="button"
                  variant={formData.access.mode === 'standard' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('access', 'mode', 'standard')}
                  className="justify-start"
                >
                  Standard
                </Button>
                <Button
                  type="button"
                  variant={formData.access.mode === 'premium' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('access', 'mode', 'premium')}
                  className="justify-start"
                >
                  Premium
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Deposit Policy</Label>
                  <p className="text-sm text-muted-foreground">
                    Require deposits for reservations (default: OFF)
                  </p>
                </div>
                <Switch
                  checked={formData.seed.enableDepositPolicy}
                  onCheckedChange={(checked) => handleInputChange('seed', 'enableDepositPolicy', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Pacing</Label>
                  <p className="text-sm text-muted-foreground">
                    Intelligent table pacing and optimization
                  </p>
                </div>
                <Switch
                  checked={formData.seed.enablePacing}
                  onCheckedChange={(checked) => handleInputChange('seed', 'enablePacing', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Plan</Label>
              <Select
                value={formData.billing.plan}
                onValueChange={(value) => handleInputChange('billing', 'plan', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Plan</SelectItem>
                  <SelectItem value="professional">Professional Plan</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Create Subscription</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create billing subscription
                </p>
              </div>
              <Switch
                checked={formData.billing.createSubscription}
                onCheckedChange={(checked) => handleInputChange('billing', 'createSubscription', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS & Communications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Start SMS Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable SMS notifications for this tenant
                </p>
              </div>
              <Switch
                checked={formData.sms.startRegistration}
                onCheckedChange={(checked) => handleInputChange('sms', 'startRegistration', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Idempotency Key Display */}
        <Card className="bg-muted/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Idempotency Key</Label>
                <p className="text-xs text-muted-foreground font-mono">{idempotencyKey}</p>
              </div>
              <Badge variant="outline">Unique Request</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Provisioning...
              </>
            ) : (
              'Create Tenant'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}