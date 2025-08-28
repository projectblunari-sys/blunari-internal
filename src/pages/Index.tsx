import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Calendar, Brain, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";
import Dashboard from "./Dashboard";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Intelligent booking distribution and pacing reduces wait times by 23% on average"
    },
    {
      icon: Users,
      title: "Multi-Tenant Architecture",
      description: "Secure, scalable platform supporting unlimited restaurant tenants with full isolation"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics", 
      description: "Real-time insights and performance metrics to optimize operations and revenue"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with Row-Level Security and comprehensive audit logging"
    },
    {
      icon: Calendar,
      title: "Zero Double-Booking",
      description: "Distributed locks and transactional consistency guarantee booking integrity"
    },
    {
      icon: Zap,
      title: "Performance Guaranteed",
      description: "p95 API latency ≤ 200ms with 99.9% monthly availability SLA"
    }
  ];

  const stats = [
    { label: "Active Restaurants", value: "2,400+" },
    { label: "Monthly Bookings", value: "150K+" },
    { label: "Average Conversion", value: "87.3%" },
    { label: "Customer Satisfaction", value: "4.9/5" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Blunari
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Documentation</Button>
            <Button variant="outline">Sign In</Button>
            <Button 
              variant="hero"
              onClick={() => setShowDashboard(true)}
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="premium" className="mb-4">
                AI-Powered Restaurant Booking Platform
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  Restaurant Operations
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The world's most advanced multi-tenant SaaS platform for restaurant bookings. 
                Boost conversions, reduce no-shows, and optimize table turnover with AI-powered intelligence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowDashboard(true)}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Elegant restaurant interior with modern booking technology"
              className="relative rounded-3xl shadow-glow w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Enterprise Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Built for Scale, Designed for Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature engineered for production-grade performance, security, and scalability. 
            From small bistros to large restaurant chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="shadow-glow bg-gradient-subtle border-0 overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants already using Blunari to increase bookings, 
              reduce no-shows, and delight their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => setShowDashboard(true)}
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t">
        <div className="text-center text-muted-foreground">
          <p>© 2024 Blunari. Built with ❤️ for the restaurant industry.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
