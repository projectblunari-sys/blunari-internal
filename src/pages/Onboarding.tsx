import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronLeft, 
  Utensils, 
  Globe, 
  CheckCircle,
  Zap,
  Clock,
  MapPin,
  DollarSign,
  Rocket
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { user, refreshProfile, tenant } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    restaurantSlug: "",
    timezone: "America/New_York",
    currency: "USD"
  });

  const steps = [
    { 
      id: 'restaurant', 
      title: 'Restaurant Details', 
      icon: Utensils,
      description: 'Tell us about your restaurant'
    },
    { 
      id: 'settings', 
      title: 'Basic Settings', 
      icon: Globe,
      description: 'Configure your preferences'
    },
    { 
      id: 'complete', 
      title: 'Go Live!', 
      icon: Rocket,
      description: 'Your restaurant is ready'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Redirect if not authenticated or already has tenant
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (tenant) {
      navigate('/dashboard');
    }
  }, [user, tenant, navigate]);

  // Auto-generate slug from restaurant name
  useEffect(() => {
    if (formData.restaurantName) {
      const slug = formData.restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, restaurantSlug: slug }));
    }
  }, [formData.restaurantName]);

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

  const handleComplete = async () => {
    if (!formData.restaurantName || !formData.restaurantSlug) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the automatic provisioning function
      const { data, error: provisionError } = await supabase
        .rpc('provision_tenant', {
          p_user_id: user?.id,
          p_restaurant_name: formData.restaurantName,
          p_restaurant_slug: formData.restaurantSlug,
          p_timezone: formData.timezone,
          p_currency: formData.currency
        });

      if (provisionError) {
        if (provisionError.message.includes('duplicate key')) {
          setError("A restaurant with this name already exists. Please choose a different name.");
        } else {
          setError(provisionError.message);
        }
        setLoading(false);
        return;
      }

      // Update profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user?.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      // Refresh profile and tenant data
      await refreshProfile();

      toast({
        title: "🎉 Restaurant Created!",
        description: `${formData.restaurantName} is now live and ready to accept bookings!`,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || "An error occurred during setup");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Restaurant Details
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Welcome to Blunari!</h3>
              <p className="text-muted-foreground">
                Let's get your restaurant set up in just a few quick steps
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name *</Label>
                <Input
                  id="restaurant-name"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  placeholder="e.g., Bella Vista Restaurant"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restaurant-slug">Your Booking URL</Label>
                <div className="flex items-center">
                  <Input
                    id="restaurant-slug"
                    value={formData.restaurantSlug}
                    onChange={(e) => setFormData({...formData, restaurantSlug: e.target.value})}
                    placeholder="bella-vista"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-muted-foreground">.blunari.com</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your booking widget URL that customers use
                </p>
              </div>
            </div>
          </div>
        );

      case 1: // Basic Settings
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Configure Your Settings</h3>
              <p className="text-muted-foreground">
                Set up your timezone and currency preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => setFormData({...formData, timezone: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (EST/EDT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CST/CDT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MST/MDT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PST/PDT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({...formData, currency: value})}
                  disabled={loading}
                >
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

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                What You're Getting:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Professional booking widget for your website
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  8 pre-configured restaurant tables
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Email notifications and basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Full dashboard access with booking management
                </li>
              </ul>
            </div>
          </div>
        );

      case 2: // Complete
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Rocket className="w-10 h-10 text-success" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to Launch! 🚀</h3>
              <p className="text-muted-foreground">
                Click the button below to create your restaurant and access your dashboard
              </p>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Setup Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Restaurant:</span>
                  <span className="font-medium">{formData.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking URL:</span>
                  <span className="font-medium">{formData.restaurantSlug}.blunari.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{formData.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="font-medium">{formData.currency}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Setup takes less than 30 seconds</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-glow">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                alt="Blunari Logo"
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Blunari Setup
              </span>
            </div>
            <CardTitle className="text-2xl">30-Second Restaurant Setup</CardTitle>
            <CardDescription>
              Get your booking system up and running in no time
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Icons */}
            <div className="flex items-center justify-between py-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    index <= currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted bg-background text-muted-foreground'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">{step.title}</span>
                  <span className="text-xs text-muted-foreground text-center">{step.description}</span>
                </div>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="py-6">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={loading || !formData.restaurantName}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Creating Restaurant..." : "Launch Restaurant 🚀"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;