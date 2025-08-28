import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target, Shield, Users, Zap, Building, Award, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every feature is built with meticulous attention to detail and real-world restaurant needs"
    },
    {
      icon: Heart,
      title: "Hospitality-First",
      description: "We understand that technology should enhance human connections, not replace them"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Enterprise-grade security and compliance protect your business and customer data"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Company Founded",
      description: "Blunari was born from the vision to revolutionize restaurant operations through AI"
    },
    {
      year: "2024",
      title: "Product Development", 
      description: "Intensive R&D phase building our core AI engine and booking platform"
    },
    {
      year: "2025",
      title: "Market Launch",
      description: "Official launch with enterprise-ready platform and first restaurant partners"
    },
    {
      year: "2025",
      title: "Scale & Growth",
      description: "Expanding to serve restaurants across multiple markets and cuisines"
    }
  ];

  const stats = [
    {
      number: "500M+",
      label: "Potential Market Size",
      description: "Independent restaurants globally"
    },
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Enterprise-grade reliability"
    },
    {
      number: "<200ms",
      label: "Response Time",
      description: "Lightning-fast performance"
    },
    {
      number: "24/7",
      label: "Support",
      description: "Always here when you need us"
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
            <Link to="/industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</Link>
            <Link to="/about" className="text-foreground font-medium">About</Link>
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
          <Badge variant="outline" className="mb-4">Our Mission</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Who We Are
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            To bring intelligence, clarity, and elegance to modern hospitality.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Future of Hospitality Intelligence
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Blunari is the future of hospitality intelligence. Born from the EndShark ecosystem, 
                  we blend cybersecurity, modern UX, and AI-powered operations to empower modern food 
                  & beverage leaders.
                </p>
                <p>
                  We understand that running a restaurant isn't just about food—it's about creating 
                  experiences, managing complex operations, and building lasting relationships with guests. 
                  That's why we've built technology that enhances human connection rather than replacing it.
                </p>
                <p>
                  Our platform combines the precision of enterprise software with the intuitive design 
                  that hospitality professionals deserve. Every feature is crafted based on real-world 
                  restaurant challenges and opportunities.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link to="/solutions">Explore Our Technology <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center space-x-3 mb-3">
                  <Building className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">EndShark Heritage</h3>
                </div>
                <p className="text-muted-foreground">Built on enterprise-grade infrastructure with proven security and scalability</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">AI-First Approach</h3>
                </div>
                <p className="text-muted-foreground">Every feature leverages machine learning to provide actionable insights</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Hospitality Focused</h3>
                </div>
                <p className="text-muted-foreground">Designed specifically for restaurant operations and guest experience</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build and every relationship we foster
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From concept to the leading AI platform for restaurant operations
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      <Badge variant="outline">{milestone.year}</Badge>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">By the Numbers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The scale and performance metrics that define our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EndShark Partnership */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Powered by EndShark</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise-Grade Foundation
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground mb-8">
                <p>
                  Blunari is built on the robust EndShark technology infrastructure, bringing 
                  enterprise-grade security, scalability, and reliability to the restaurant industry.
                </p>
                <p>
                  This partnership ensures that our platform meets the highest standards for 
                  data protection, system availability, and performance—critical requirements 
                  for businesses that never sleep.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>SOC 2 Type II certified security framework</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Global infrastructure with 99.9% uptime SLA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Industry-leading performance and reliability</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">EndShark</div>
                <p className="text-lg text-muted-foreground mb-6">
                  Your tech infrastructure partner providing the secure, scalable foundation for Blunari's innovation
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Security Standards:</span>
                    <span className="font-medium">Enterprise-Grade</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Global Presence:</span>
                    <span className="font-medium">Multi-Region</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance:</span>
                    <span className="font-medium">SOC 2, GDPR, CCPA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            We'd Love to Serve You
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Ready to see how Blunari can transform your restaurant operations? Let's start the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo">Schedule a Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/contact">Get in Touch</Link>
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
              © 2025 Blunari. Bringing intelligence to modern hospitality.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}