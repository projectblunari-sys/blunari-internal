import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Calendar, Brain, Shield, Zap, Star, Quote } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Index = () => {

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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Owner, Bella Vista Restaurant",
      content: "Blunari increased our booking conversions by 34% and virtually eliminated double bookings. The AI pacing is incredible.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "GM, Ocean Breeze Bistro",
      content: "The analytics help us optimize our operations daily. We've reduced no-shows by 40% since implementing Blunari.",
      rating: 5
    },
    {
      name: "Elena Dubois",
      role: "Owner, Mountain View Cafe", 
      content: "Setup was seamless and the support team is outstanding. Our customers love the smooth booking experience.",
      rating: 5
    }
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
            <Button variant="ghost">Support</Button>
            <Button variant="outline">Sign In</Button>
            <Button variant="default">Get Started</Button>
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
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule Demo
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

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Trusted by Restaurants
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of restaurant owners who have transformed their booking experience with Blunari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <blockquote className="text-foreground leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Simple Pricing
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free, then pick a plan that fits your restaurant's needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Starter',
              price: '$49',
              period: 'per month',
              description: 'Perfect for small restaurants just getting started',
              features: [
                'Up to 500 bookings/month',
                'Basic booking widget', 
                'Email notifications',
                'Basic analytics',
                'Email support'
              ],
              popular: false
            },
            {
              name: 'Professional', 
              price: '$99',
              period: 'per month',
              description: 'Most popular for growing restaurants',
              features: [
                'Up to 2,000 bookings/month',
                'Advanced booking widget',
                'SMS notifications',
                'AI pacing optimization',
                'Advanced analytics',
                'Priority support',
                'Custom branding'
              ],
              popular: true
            },
            {
              name: 'Enterprise',
              price: '$199', 
              period: 'per month',
              description: 'For large restaurants and chains',
              features: [
                'Unlimited bookings',
                'Multi-location support',
                'Custom integrations',
                'White-label solution',
                'Advanced AI features',
                'Dedicated account manager',
                'SLA guarantee'
              ],
              popular: false
            }
          ].map((plan, index) => (
            <Card key={index} className={`shadow-card hover:shadow-elegant transition-all duration-300 relative ${
              plan.popular ? 'ring-2 ring-primary scale-105' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="premium">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full mt-6"
                  size="lg"
                >
                  Get Started
                </Button>
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
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
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
