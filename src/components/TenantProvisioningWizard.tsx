import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, Building2, Globe, CreditCard, Smartphone } from "lucide-react";

interface TenantProvisioningWizardProps {
  onClose: () => void;
}

interface ProvisioningData {
  name: string;
  slug: string;
  timezone: string;
  currency: string;
  ownerEmail: string;
  accessMode: 'your_subdomain' | 'customer_subdomain' | 'path';
  seatingPreset: string;
  enablePacing: boolean;
  plan: string;
}

const steps = [
  { id: 'basics', title: 'Restaurant Details', icon: Building2 },
  { id: 'access', title: 'Access Configuration', icon: Globe },
  { id: 'features', title: 'Features & Setup', icon: Check },
  { id: 'billing', title: 'Billing & Plans', icon: CreditCard },
  { id: 'complete', title: 'Complete Setup', icon: Smartphone }
];

export const TenantProvisioningWizard = ({ onClose }: TenantProvisioningWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<ProvisioningData>({
    name: '',
    slug: '',
    timezone: 'UTC',
    currency: 'USD',
    ownerEmail: '',
    accessMode: 'your_subdomain',
    seatingPreset: 'standard',
    enablePacing: true,
    plan: 'professional'
  });

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual provisioning API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Tenant Created Successfully",
        description: `${data.name} has been provisioned and is ready to use.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Provisioning Failed",
        description: "There was an error creating the tenant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basics
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
                placeholder="e.g., Bella Vista Restaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) => setData({...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                placeholder="bella-vista"
              />
              <p className="text-sm text-muted-foreground">
                This will be used in URLs: {data.slug}.blunari.com
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={data.timezone} onValueChange={(value) => setData({...data, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={data.currency} onValueChange={(value) => setData({...data, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={data.ownerEmail}
                onChange={(e) => setData({...data, ownerEmail: e.target.value})}
                placeholder="owner@bellavista.com"
              />
            </div>
          </div>
        );

      case 1: // Access
        return (
          <div className="space-y-6">
            <div>
              <Label>Access Mode</Label>
              <div className="grid gap-4 mt-3">
                {[
                  { 
                    value: 'your_subdomain', 
                    title: 'Your Subdomain', 
                    description: 'restaurant-name.blunari.com',
                    recommended: true
                  },
                  { 
                    value: 'customer_subdomain', 
                    title: 'Custom Domain', 
                    description: 'restaurant-name.com' 
                  },
                  { 
                    value: 'path', 
                    title: 'Path Based', 
                    description: 'blunari.com/restaurant-name' 
                  }
                ].map((option) => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      data.accessMode === option.value 
                        ? 'ring-2 ring-primary shadow-elegant' 
                        : 'hover:shadow-card'
                    }`}
                    onClick={() => setData({...data, accessMode: option.value as any})}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{option.title}</h3>
                            {option.recommended && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          data.accessMode === option.value 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Features
        return (
          <div className="space-y-6">
            <div>
              <Label>Seating Layout Preset</Label>
              <Select value={data.seatingPreset} onValueChange={(value) => setData({...data, seatingPreset: value})}>
                <SelectTrigger className="mt-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Layout (20-40 seats)</SelectItem>
                  <SelectItem value="intimate">Intimate Layout (10-20 seats)</SelectItem>
                  <SelectItem value="large">Large Layout (40+ seats)</SelectItem>
                  <SelectItem value="custom">Custom Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Pacing Engine</CardTitle>
                <CardDescription>
                  Optimize table turnover with intelligent booking distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Pacing</p>
                    <p className="text-sm text-muted-foreground">
                      Reduces wait times by 23% on average
                    </p>
                  </div>
                  <Button
                    variant={data.enablePacing ? "default" : "outline"}
                    onClick={() => setData({...data, enablePacing: !data.enablePacing})}
                    size="sm"
                  >
                    {data.enablePacing ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // Billing
        return (
          <div className="space-y-6">
            <div>
              <Label>Select Plan</Label>
              <div className="grid gap-4 mt-3">
                {[
                  {
                    value: 'starter',
                    title: 'Starter',
                    price: '$49/month',
                    features: ['Up to 500 bookings/month', 'Basic analytics', 'Email support']
                  },
                  {
                    value: 'professional',
                    title: 'Professional',
                    price: '$99/month',
                    features: ['Up to 2,000 bookings/month', 'Advanced analytics', 'Priority support', 'AI Pacing'],
                    recommended: true
                  },
                  {
                    value: 'enterprise',
                    title: 'Enterprise',
                    price: '$199/month',
                    features: ['Unlimited bookings', 'Custom integrations', 'Dedicated support', 'White-label']
                  }
                ].map((plan) => (
                  <Card 
                    key={plan.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      data.plan === plan.value 
                        ? 'ring-2 ring-primary shadow-elegant' 
                        : 'hover:shadow-card'
                    }`}
                    onClick={() => setData({...data, plan: plan.value})}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{plan.title}</h3>
                            {plan.recommended && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                Most Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary mb-3">{plan.price}</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <Check className="w-3 h-3 text-success" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          data.plan === plan.value 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Complete
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Create Tenant</h3>
              <p className="text-muted-foreground">
                Review your configuration below and click "Create Tenant" to provision the new restaurant.
              </p>
            </div>
            
            <Card className="text-left shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Restaurant:</span>
                  <span className="font-medium">{data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-medium">{data.slug}.blunari.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{data.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">
                    {data.plan}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Pacing:</span>
                  <Badge variant={data.enablePacing ? "default" : "outline"}>
                    {data.enablePacing ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Tenant</DialogTitle>
          <DialogDescription>
            Set up a new restaurant tenant with AI-powered booking capabilities
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Icons */}
        <div className="flex items-center justify-between py-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted bg-background text-muted-foreground'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1 text-center">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button 
              variant="hero" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tenant"}
            </Button>
          ) : (
            <Button variant="default" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};