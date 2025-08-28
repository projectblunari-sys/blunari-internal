import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Zap, Users, TrendingUp, Clock, Shield, Globe, Cpu, BarChart3, MessageSquare, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Solutions() {
  const coreFeatures = [
    {
      icon: Brain,
      name: "MenuIQ™",
      description: "AI-powered menu optimization and analytics",
      features: ["Dynamic menu optimization", "Revenue impact analysis", "Customer preference tracking", "Seasonal trend analysis"]
    },
    {
      icon: Zap,
      name: "PricePilot™", 
      description: "Dynamic pricing for margins & customer flow",
      features: ["Real-time demand pricing", "Peak hour optimization", "Competitor analysis", "Revenue maximization"]
    },
    {
      icon: TrendingUp,
      name: "Forecast Fork™",
      description: "Predictive demand and ingredient forecasting",
      features: ["7-day demand prediction", "Inventory optimization", "Weather impact analysis", "Supply chain intelligence"]
    },
    {
      icon: MessageSquare,
      name: "SentiScoop™",
      description: "AI-powered guest sentiment analysis",
      features: ["Real-time feedback processing", "Sentiment trend tracking", "Review response automation", "Customer satisfaction scoring"]
    },
    {
      icon: Users,
      name: "SpeakServe™",
      description: "Voice assistant for staff training",
      features: ["Natural language processing", "Interactive training modules", "Performance analytics", "Multi-language support"]
    },
    {
      icon: Target,
      name: "EcoChef™",
      description: "Sustainability + cost-saving recommendations",
      features: ["Waste reduction insights", "Carbon footprint tracking", "Sustainable sourcing", "Cost optimization"]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "25-30% Faster Operations",
      description: "Streamlined workflows and automated processes reduce service time"
    },
    {
      icon: TrendingUp,
      title: "15-20% Revenue Increase",
      description: "Dynamic pricing and menu optimization boost profitability"
    },
    {
      icon: Users,
      title: "94% Customer Satisfaction",
      description: "Personalized experiences and reduced wait times delight guests"
    },
    {
      icon: Shield,
      title: "99.9% Uptime Guarantee",
      description: "Enterprise-grade reliability ensures your operations never stop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
              alt="Blunari" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">Blunari</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/solutions" className="text-foreground font-medium">Solutions</Link>
            <Link to="/industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Button asChild>
              <Link to="/demo">Request Demo</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container">
          <Badge variant="outline" className="mb-4">AI-Powered Solutions</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            More Than Software. <br />A Guest Experience Engine.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Blunari is built to optimize your restaurant or lounge — from the front of house to your bottom line.
          </p>
          <Button size="lg" asChild className="mr-4">
            <Link to="/demo">See Blunari in Action</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Talk to Sales</Link>
          </Button>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core AI-Powered Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary AI modules that transform every aspect of your hospitality operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Business Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from restaurants using Blunari's AI-powered platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dashboard Showcase</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how restaurant owners use Blunari's analytics dashboard with menu heatmaps, pricing tools, and guest satisfaction trends
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Interactive Dashboard Preview</p>
                  <p className="text-sm text-muted-foreground">Real-time analytics and AI insights</p>
                </div>
              </div>
              <div className="text-center">
                <Button size="lg" asChild>
                  <Link to="/demo">Experience the Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration & Performance */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Enterprise Integration</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Seamless Integration with Your Existing Systems
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>POS system compatibility and real-time sync</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Inventory management integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Staff scheduling and payroll systems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Marketing automation platforms</span>
                </div>
              </div>
              <Button asChild>
                <Link to="/demo">See Integration in Action <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Global Scale</h3>
                </div>
                <p className="text-muted-foreground">Multi-language support and currency handling for international operations</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Cpu className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">High Performance</h3>
                </div>
                <p className="text-muted-foreground">Sub-200ms response times with 99.9% uptime guarantee</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Enterprise Security</h3>
                </div>
                <p className="text-muted-foreground">SOC 2 compliance with end-to-end encryption and audit trails</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of restaurants already using Blunari to optimize operations and delight guests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo">Schedule Your Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/contact">Talk to Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                alt="Blunari" 
                className="h-6 w-auto"
              />
              <span className="font-semibold">Blunari</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Blunari. Elevating hospitality through AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}