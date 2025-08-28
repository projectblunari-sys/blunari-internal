import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Copy, 
  Download, 
  Eye, 
  Code2, 
  Palette, 
  Settings,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  ExternalLink,
  Zap,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WidgetConfig {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  borderRadius: number;
  size: 'compact' | 'standard' | 'large';
  layout: 'inline' | 'modal' | 'sidebar';
  features: {
    timeSlots: boolean;
    partySize: boolean;
    specialRequests: boolean;
    guestInfo: boolean;
    instantConfirm: boolean;
  };
  branding: {
    showLogo: boolean;
    customLogo?: string;
    poweredBy: boolean;
  };
  language: string;
  timezone: string;
}

export const WidgetIntegration = () => {
  // Mock current restaurant data - in real app this would come from auth context
  const currentRestaurant = {
    id: "bella-vista", 
    name: "Bella Vista Restaurant", 
    domain: "bellavista.com",
    slug: "bella-vista"
  };
  
  const [activeTab, setActiveTab] = useState("configure");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const { toast } = useToast();

  const [config, setConfig] = useState<WidgetConfig>({
    theme: 'light',
    primaryColor: '#3b82f6',
    borderRadius: 8,
    size: 'standard',
    layout: 'inline',
    features: {
      timeSlots: true,
      partySize: true,
      specialRequests: true,
      guestInfo: true,
      instantConfirm: true
    },
    branding: {
      showLogo: true,
      poweredBy: true
    },
    language: 'en',
    timezone: 'America/New_York'
  });

  const generateEmbedCode = () => {
    const baseUrl = "https://widgets.blunari.com";
    const tenantSlug = currentRestaurant.slug;
    
    return `<!-- Blunari Booking Widget -->
<div id="blunari-widget" data-tenant="${tenantSlug}"></div>
<script>
(function() {
  var config = ${JSON.stringify(config, null, 2)};
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.dataset.config = JSON.stringify(config);
  script.async = true;
  document.head.appendChild(script);
})();
</script>
<style>
  #blunari-widget {
    max-width: 100%;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>`;
  };

  const generateWordPressCode = () => {
    const configStr = Object.entries(config.features)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key)
      .join(',');

    return `[blunari_booking 
  tenant="${currentRestaurant.slug}"
  theme="${config.theme}"
  color="${config.primaryColor.replace('#', '')}"
  size="${config.size}"
  layout="${config.layout}"
  features="${configStr}"
  language="${config.language}"
]`;
  };

  const generateReactCode = () => {
    return `import { BlunariWidget } from '@blunari/react-widget';

function MyBookingPage() {
  const widgetConfig = ${JSON.stringify(config, null, 2)};

  return (
    <div className="booking-section">
      <h2>Make a Reservation</h2>
      <BlunariWidget
        tenant="${currentRestaurant.slug}"
        config={widgetConfig}
        onBookingComplete={(booking) => {
          console.log('Booking completed:', booking);
          // Handle successful booking
        }}
        onError={(error) => {
          console.error('Booking error:', error);
          // Handle booking errors
        }}
      />
    </div>
  );
}

export default MyBookingPage;`;
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `${type} code copied to clipboard`,
    });
  };

  const getPreviewSize = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-[500px]';
      default:
        return 'w-full h-[600px]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Website Integration</h2>
          <p className="text-muted-foreground">
            Create and customize booking widgets for your website
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button variant="default" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>

      {/* Restaurant Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Your Restaurant Widget
          </CardTitle>
          <CardDescription>
            Customize and embed booking widgets for {currentRestaurant.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium">{currentRestaurant.name}</p>
              <p className="text-sm text-muted-foreground">{currentRestaurant.domain}</p>
            </div>
            <Badge variant="secondary">
              {currentRestaurant.slug}.blunari.com
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="style">
                <Palette className="w-4 h-4 mr-2" />
                Style
              </TabsTrigger>
              <TabsTrigger value="features">
                <Layers className="w-4 h-4 mr-2" />
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Basic Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Widget Size</Label>
                      <Select 
                        value={config.size} 
                        onValueChange={(value: any) => setConfig({...config, size: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="layout">Layout Type</Label>
                      <Select 
                        value={config.layout} 
                        onValueChange={(value: any) => setConfig({...config, layout: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="modal">Modal</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={config.language} 
                        onValueChange={(value) => setConfig({...config, language: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={config.timezone} 
                        onValueChange={(value) => setConfig({...config, timezone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={config.theme} 
                      onValueChange={(value: any) => setConfig({...config, theme: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="borderRadius">Border Radius: {config.borderRadius}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={config.borderRadius}
                      onChange={(e) => setConfig({...config, borderRadius: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLogo">Show Restaurant Logo</Label>
                      <Switch
                        checked={config.branding.showLogo}
                        onCheckedChange={(checked) => 
                          setConfig({
                            ...config, 
                            branding: {...config.branding, showLogo: checked}
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="poweredBy">Show "Powered by Blunari Developers"</Label>
                      <Switch
                        checked={config.branding.poweredBy}
                        onCheckedChange={(checked) => 
                          setConfig({
                            ...config, 
                            branding: {...config.branding, poweredBy: checked}
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Feature Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(config.features).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setConfig({
                            ...config, 
                            features: {...config.features, [key]: checked}
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto border rounded-lg overflow-hidden ${getPreviewSize()}`}>
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: config.theme === 'dark' ? '#1a1a1a' : '#ffffff',
                    color: config.theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                >
                  <div 
                    className="p-6 rounded-lg border"
                    style={{
                      backgroundColor: config.primaryColor + '10',
                      borderColor: config.primaryColor,
                      borderRadius: `${config.borderRadius}px`
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Book a Table</h3>
                    <div className="space-y-3">
                      {config.features.timeSlots && (
                        <div className="p-2 bg-muted/30 rounded text-sm">📅 Date & Time Selection</div>
                      )}
                      {config.features.partySize && (
                        <div className="p-2 bg-muted/30 rounded text-sm">👥 Party Size</div>
                      )}
                      {config.features.guestInfo && (
                        <div className="p-2 bg-muted/30 rounded text-sm">📝 Guest Information</div>
                      )}
                      {config.features.specialRequests && (
                        <div className="p-2 bg-muted/30 rounded text-sm">💬 Special Requests</div>
                      )}
                      <button 
                        className="w-full p-2 rounded text-white font-medium"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        {config.features.instantConfirm ? 'Book Now' : 'Request Reservation'}
                      </button>
                      {config.branding.poweredBy && (
                        <div className="text-xs text-muted-foreground text-center">
                          Powered by Blunari Developers
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Codes */}
      <Tabs defaultValue="html" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="html">
            <Code2 className="w-4 h-4 mr-2" />
            HTML/JavaScript
          </TabsTrigger>
          <TabsTrigger value="wordpress">WordPress Shortcode</TabsTrigger>
          <TabsTrigger value="react">React Component</TabsTrigger>
        </TabsList>

        <TabsContent value="html">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>HTML/JavaScript Embed Code</CardTitle>
              <CardDescription>
                Copy and paste this code into any HTML page to embed the booking widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateEmbedCode(), "HTML/JavaScript")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download as File
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test in CodePen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wordpress">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>WordPress Shortcode</CardTitle>
              <CardDescription>
                Install the Blunari WordPress plugin and use this shortcode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateWordPressCode()}
                    readOnly
                    className="min-h-[100px] font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateWordPressCode(), "WordPress shortcode")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Plugin
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Plugin Documentation
                  </Button>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Installation Steps:
                  </h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Download and install the Blunari WordPress plugin</li>
                    <li>Activate the plugin in your WordPress admin</li>
                    <li>Go to Settings → Blunari and enter your API key</li>
                    <li>Use the shortcode above in any post or page</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>React Component</CardTitle>
              <CardDescription>
                Install the Blunari React package and use this component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateReactCode()}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateReactCode(), "React component")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Package
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    NPM Package
                  </Button>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Installation:
                  </h4>
                  <div className="space-y-2">
                    <code className="block bg-black text-green-400 p-2 rounded text-sm">
                      npm install @blunari/react-widget
                    </code>
                    <code className="block bg-black text-green-400 p-2 rounded text-sm">
                      yarn add @blunari/react-widget
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};