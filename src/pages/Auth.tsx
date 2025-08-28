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
  AlertTriangle,
  ArrowRight
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


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                alt="Blunari Logo"
                className="w-12 h-12 rounded-xl"
              />
              <span className="text-2xl font-heading font-bold text-foreground">
                Blunari Admin
              </span>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-xl font-heading font-semibold text-foreground">
                Admin Login
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Access the admin dashboard
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

              </CardContent>
            </Card>
          </div>
        </div>
  );
};

export default Auth;