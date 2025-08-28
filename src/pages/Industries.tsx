import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils, Wine, Coffee, Gamepad2, Building, Users, TrendingUp, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Industries() {
  const industries = [
    {
      icon: Utensils,
      title: "Restaurants",
      description: "Fine dining to casual eateries",
      features: [
        "Increase order value and reduce waste with AI menu optimization",
        "Peak hour analysis enables precise staffing schedules", 
        "Dynamic pricing maximizes revenue during high-demand periods",
        "Predictive analytics reduce food waste by 25-30%"
      ],
      metrics: {
        efficiency: "35% faster table turnover",
        revenue: "18% increase in average order value",
        satisfaction: "96% customer satisfaction rate"
      }
    },
    {
      icon: Wine,
      title: "Bars & Lounges", 
      description: "Cocktail bars and social venues",
      features: [
        "AI cocktail menu optimization based on ingredient costs and popularity",
        "Real-time crowd analysis for optimal pricing and promotions",
        "Smart inventory management prevents stockouts during peak hours",
        "Personalized drink recommendations boost upselling"
      ],
      metrics: {
        efficiency: "40% reduction in inventory waste",
        revenue: "22% increase in per-customer spend",
        satisfaction: "94% customer retention rate"
      }
    },
    {
      icon: Coffee,
      title: "Cafés & Brunch Spots",
      description: "Coffee shops and breakfast venues", 
      features: [
        "Morning rush optimization with predictive ordering",
        "Seasonal menu adaptation based on weather and trends",
        "Mobile order integration with wait time predictions",
        "Loyalty program automation drives repeat business"
      ],
      metrics: {
        efficiency: "50% faster service during rush hours",
        revenue: "15% increase in daily revenue",
        satisfaction: "92% mobile order accuracy"
      }
    },
    {
      icon: Gamepad2,
      title: "Hookah & Hybrid Concepts",
      description: "Entertainment and social venues",
      features: [
        "Session-based pricing optimization for hookah rentals",
        "Group booking management with automated table assignments",
        "Event planning tools with capacity management",
        "Multi-revenue stream tracking (food, drinks, entertainment)"
      ],
      metrics: {
        efficiency: "30% improvement in table utilization",
        revenue: "25% increase in average session value",
        satisfaction: "89% group booking satisfaction"
      }
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Optimization",
      description: "AI-driven pricing and menu optimization increase profitability across all concepts",
      impact: "15-25% revenue increase"
    },
    {
      icon: Clock,
      title: "Operational Efficiency", 
      description: "Streamlined workflows and predictive analytics reduce costs and improve service",
      impact: "30-40% efficiency gain"
    },
    {
      icon: Users,
      title: "Guest Experience",
      description: "Personalized service and reduced wait times create memorable dining experiences",
      impact: "90%+ satisfaction rates"
    },
    {
      icon: Target,
      title: "Competitive Advantage",
      description: "Advanced analytics and AI insights keep you ahead of market trends",
      impact: "Industry-leading performance"
    }
  ];

  const testimonials = [
    {
      quote: "Blunari transformed our fine dining restaurant. The AI menu optimization alone increased our profit margins by 23% in just two months.",
      author: "Sarah Chen",
      title: "Owner, Meridian Restaurant",
      location: "San Francisco, CA"
    },
    {
      quote: "The predictive analytics help us staff perfectly for every shift. We've reduced labor costs by 18% while improving service quality.",
      author: "Marcus Rodriguez", 
      title: "General Manager, Downtown Bistro",
      location: "Austin, TX"
    },
    {
      quote: "Our cocktail bar saw a 30% increase in revenue per customer after implementing Blunari's dynamic pricing and personalization features.",
      author: "Lisa Thompson",
      title: "Bar Manager, Skyline Lounge", 
      location: "Miami, FL"
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
            <Link to="/solutions" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
            <Link to="/industries" className="text-foreground font-medium">Industries</Link>
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
          <Badge variant="outline" className="mb-4">Industry Solutions</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tailored for Every Hospitality Space
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Whether you serve cocktails, coffee, or three-course meals, Blunari adapts to your flow and optimizes your operations.
          </p>
          <Button size="lg" asChild className="mr-4">
            <Link to="/demo">See Your Industry Solution</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Talk to an Expert</Link>
          </Button>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{industry.title}</CardTitle>
                        <CardDescription className="text-base">{industry.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {industry.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Proven Results:</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Efficiency:</span>
                          <span className="font-medium text-primary">{industry.metrics.efficiency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium text-primary">{industry.metrics.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Satisfaction:</span>
                          <span className="font-medium text-primary">{industry.metrics.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Universal Benefits Across All Industries</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No matter your concept, Blunari delivers measurable improvements to your bottom line
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
                  <p className="text-muted-foreground mb-3">{benefit.description}</p>
                  <Badge variant="secondary" className="font-medium">{benefit.impact}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how restaurants, bars, and cafés are transforming their operations with Blunari
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <blockquote className="text-lg mb-4 italic">"{testimonial.quote}"</blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Market Opportunity</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Future of Hospitality is Here
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Building className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">1M+ Independent Restaurants</h4>
                    <p className="text-muted-foreground">In the U.S. alone seeking technology solutions to compete</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">$100B+ Global Market</h4>
                    <p className="text-muted-foreground">Restaurant technology market growing 15% annually</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Rising Demand</h4>
                    <p className="text-muted-foreground">For smarter operations and enhanced guest experiences</p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link to="/demo">See Industry-Specific Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-xl font-semibold mb-3">Quick Setup</h3>
                <p className="text-muted-foreground mb-4">Get up and running in under 30 minutes with our industry-specific templates</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    Pre-configured dashboards for your industry
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    Sample menus and pricing strategies
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    Integration with popular POS systems
                  </li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Ongoing Support</h3>
                <p className="text-muted-foreground mb-4">Dedicated industry experts help optimize your specific use case</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Talk to an Expert</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to See Blunari Work for Your Industry?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get a personalized demo showing exactly how Blunari optimizes your specific type of venue
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo">Get Industry-Specific Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/contact">Speak with Industry Expert</Link>
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
              © 2025 Blunari. Transforming hospitality through intelligent technology.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}