import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Database,
  Zap,
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Password strength calculation
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      return strength;
    };
    
    setPasswordStrength(calculateStrength(signInForm.password));
  }, [signInForm.password]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(signInForm.email, signInForm.password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message.includes('Email not confirmed')) {
        setError("Please check your email and click the confirmation link before signing in.");
      } else {
        setError(error.message);
      }
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your admin dashboard.",
      });
      navigate('/admin/dashboard');
    }

    setLoading(false);
  };

  const features = [
    { 
      icon: Shield, 
      title: "Advanced Security", 
      description: "Enterprise-grade security with multi-factor authentication and encrypted data storage.",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: BarChart3, 
      title: "Real-time Analytics", 
      description: "Comprehensive dashboard with live metrics, performance tracking, and business insights.",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Users, 
      title: "Multi-tenant Management", 
      description: "Centralized platform to manage multiple restaurant operations and customer experiences.",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Database, 
      title: "Cloud Infrastructure", 
      description: "Scalable cloud-based architecture with 99.9% uptime and automatic backups.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Active Restaurants", value: "1,247", trend: "+12%" },
    { label: "Monthly Bookings", value: "45.2K", trend: "+23%" },
    { label: "Platform Uptime", value: "99.98%", trend: "Stable" },
    { label: "Customer Satisfaction", value: "4.9/5", trend: "+0.2" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-2xl animate-slide-in-left">
            {/* Logo and Title */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                    alt="Blunari Logo"
                    className="w-16 h-16 rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl animate-glow"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Blunari Admin
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Restaurant Platform Command Center
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                  Next-Generation Restaurant Platform Administration
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Empower your restaurant ecosystem with advanced analytics, real-time insights, 
                  and comprehensive management tools designed for operational excellence.
                </p>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-slate-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                SOC 2 Compliant
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Globe className="h-3 w-3 mr-1" />
                Global Infrastructure
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <Zap className="h-3 w-3 mr-1" />
                99.9% Uptime SLA
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-slide-in-right">
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-8">
                <div className="lg:hidden mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img 
                      src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                      alt="Blunari Logo"
                      className="w-12 h-12 rounded-xl"
                    />
                    <span className="text-2xl font-heading font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Blunari Admin
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Sign in to access your admin dashboard and manage platform operations
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-scale-in">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="admin@blunari.com"
                          value={signInForm.email}
                          onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={cn(
                            "pl-10 pr-4 py-3 border-2 transition-all duration-300",
                            focusedField === 'email' 
                              ? "border-blue-500 ring-4 ring-blue-500/10 shadow-lg" 
                              : "border-slate-200 dark:border-slate-700"
                          )}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className={cn(
                            "pl-10 pr-12 py-3 border-2 transition-all duration-300",
                            focusedField === 'password' 
                              ? "border-blue-500 ring-4 ring-blue-500/10 shadow-lg" 
                              : "border-slate-200 dark:border-slate-700"
                          )}
                          required
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? 
                            <EyeOff className="w-4 h-4 text-slate-400" /> : 
                            <Eye className="w-4 h-4 text-slate-400" />
                          }
                        </Button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {signInForm.password && (
                        <div className="space-y-1 animate-fade-in">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Password Strength</span>
                            <span className={cn(
                              "font-medium",
                              passwordStrength < 50 ? "text-red-500" : 
                              passwordStrength < 75 ? "text-yellow-500" : "text-green-500"
                            )}>
                              {passwordStrength < 50 ? "Weak" : 
                               passwordStrength < 75 ? "Good" : "Strong"}
                            </span>
                          </div>
                          <Progress 
                            value={passwordStrength} 
                            className="h-1.5"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Access Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Demo Access Credentials
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Email:</span>
                      <code className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-blue-600 font-mono text-xs">
                        admin@admin.com
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Password:</span>
                      <code className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-blue-600 font-mono text-xs">
                        admin123
                      </code>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
                    For security, please update these credentials after first login.
                  </p>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Protected by enterprise-grade security • 
                    <span className="text-blue-600 dark:text-blue-400 ml-1">256-bit SSL encryption</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;