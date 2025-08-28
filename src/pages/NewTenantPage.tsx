import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Settings, 
  Globe, 
  Check,
  MapPin,
  Clock,
  CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TenantFormData {
  name: string;
  slug: string;
  description: string;
  timezone: string;
  currency: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Restaurant details and identification",
    icon: Building2
  },
  {
    id: 2,
    title: "Configuration",
    description: "Timezone, currency, and operational settings",
    icon: Settings
  },
  {
    id: 3,
    title: "Owner Details",
    description: "Primary contact and owner information",
    icon: MapPin
  },
  {
    id: 4,
    title: "Review & Deploy",
    description: "Confirm details and provision tenant",
    icon: Globe
  }
];

const timezones = [
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'JPY', name: 'Japanese Yen' }
];

const NewTenantPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    slug: '',
    description: '',
    timezone: 'America/New_York',
    currency: 'USD',
    ownerEmail: '',
    ownerName: '',
    ownerPhone: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: ''
  });

  const updateFormData = (field: keyof TenantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.slug);
      case 2:
        return !!(formData.timezone && formData.currency);
      case 3:
        return !!(formData.ownerEmail && formData.ownerName);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleProvision = async () => {
    setIsProvisioning(true);
    try {
      // Create the tenant
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          name: formData.name,
          slug: formData.slug,
          timezone: formData.timezone,
          currency: formData.currency,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Tenant "${formData.name}" has been successfully created.`,
      });

      navigate(`/admin/tenants/${data.id}`);
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tenant",
        variant: "destructive"
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/admin/tenants')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Add New Tenant
          </h1>
          <p className="text-muted-foreground">
            Set up a new restaurant tenant with guided provisioning
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.id === currentStep 
                    ? 'bg-primary/10 border border-primary/20' 
                    : step.id < currentStep 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-muted/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : step.id < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-muted-foreground/20 text-muted-foreground'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-medium text-sm ${
                    step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5" />;
            })()}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="The Italian Kitchen"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">blunari.com/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateFormData('slug', e.target.value)}
                    placeholder="italian-kitchen"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Authentic Italian cuisine in the heart of downtown..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Select value={formData.timezone} onValueChange={(value) => updateFormData('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {tz}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {currency.code} - {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Owner Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => updateFormData('ownerName', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => updateFormData('ownerEmail', e.target.value)}
                    placeholder="john@restaurant.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Phone Number</Label>
                  <Input
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={(e) => updateFormData('ownerPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Deploy */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg">Restaurant Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">URL:</span>
                      <p className="font-medium">blunari.com/{formData.slug}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Timezone:</span>
                      <p className="font-medium">{formData.timezone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Currency:</span>
                      <p className="font-medium">{formData.currency}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg">Owner Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{formData.ownerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium">{formData.ownerEmail}</p>
                    </div>
                    {formData.ownerPhone && (
                      <div>
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <p className="font-medium">{formData.ownerPhone}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-muted-foreground">Country:</span>
                      <p className="font-medium">{formData.country}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Tenant record will be created in the database</li>
                  <li>• Default restaurant tables will be provisioned</li>
                  <li>• Basic features will be enabled automatically</li>
                  <li>• Owner will receive welcome email with setup instructions</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleProvision}
            disabled={isProvisioning || !isStepValid(currentStep)}
            className="bg-primary hover:bg-primary/90"
          >
            {isProvisioning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Provisioning...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Create Tenant
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewTenantPage;