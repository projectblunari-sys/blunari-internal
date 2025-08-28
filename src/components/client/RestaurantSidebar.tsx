import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home,
  Calendar, 
  Users, 
  MapPin,
  BarChart3,
  Settings, 
  CreditCard,
  Bell,
  HelpCircle,
  Utensils,
  Clock,
  Star,
  TrendingUp,
  Shield,
  ChevronDown,
  Plus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview & quick actions"
  },
  {
    title: "Bookings",
    icon: Calendar,
    items: [
      { title: "All Bookings", url: "/dashboard/bookings", icon: Calendar },
      { title: "Today's Schedule", url: "/dashboard/bookings/today", icon: Clock },
      { title: "Add Booking", url: "/dashboard/bookings/new", icon: Plus }
    ]
  },
  {
    title: "Table Management",
    icon: MapPin,
    items: [
      { title: "Floor Plan", url: "/dashboard/tables/floor-plan", icon: MapPin },
      { title: "Table Status", url: "/dashboard/tables/status", icon: Utensils },
      { title: "Seating Settings", url: "/dashboard/tables/settings", icon: Settings }
    ]
  },
  {
    title: "Analytics & Reports",
    icon: BarChart3,
    items: [
      { title: "Performance Overview", url: "/dashboard/analytics/overview", icon: TrendingUp },
      { title: "Revenue Reports", url: "/dashboard/analytics/revenue", icon: CreditCard },
      { title: "Customer Insights", url: "/dashboard/analytics/customers", icon: Users },
      { title: "Export Data", url: "/dashboard/analytics/export", icon: BarChart3 }
    ]
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
    description: "Guest management & history"
  },
  {
    title: "Reviews & Feedback",
    url: "/dashboard/reviews",
    icon: Star,
    description: "Customer reviews & ratings"
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "Restaurant Profile", url: "/dashboard/settings/profile", icon: Utensils },
      { title: "Booking Settings", url: "/dashboard/settings/bookings", icon: Calendar },
      { title: "Notifications", url: "/dashboard/settings/notifications", icon: Bell },
      { title: "Security", url: "/dashboard/settings/security", icon: Shield }
    ]
  },
  {
    title: "Billing & Plan",
    url: "/dashboard/billing",
    icon: CreditCard,
    description: "Subscription & payments"
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: HelpCircle,
    description: "Help & documentation"
  }
];

export function RestaurantSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>(['Bookings']);
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: any[]) => items?.some(item => currentPath === item.url);

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-primary text-primary-foreground font-medium shadow-sm" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} border-r bg-background transition-all duration-300`}
      collapsible="icon"
    >
      {/* Header */}
      <div className="p-4 border-b">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                alt="Blunari Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div>
                <span className="font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Restaurant Dashboard
                </span>
              </div>
            </div>
            <SidebarTrigger />
          </div>
        ) : (
          <div className="flex justify-center">
            <SidebarTrigger />
          </div>
        )}
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    // Collapsible group
                    <Collapsible
                      open={openGroups.includes(item.title)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between ${
                            isGroupActive(item.items) ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronDown className={`w-4 h-4 transition-transform ${
                              openGroups.includes(item.title) ? "rotate-180" : ""
                            }`} />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent className="mt-2 ml-6 space-y-1">
                          {item.items.map((subItem) => (
                            <NavLink
                              key={subItem.url}
                              to={subItem.url}
                              className={getNavClassName}
                            >
                              <subItem.icon className="w-3 h-3" />
                              <span className="text-sm">{subItem.title}</span>
                            </NavLink>
                          ))}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    // Single item
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url!}
                        className={getNavClassName}
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && (
                          <div>
                            <span>{item.title}</span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Today's Summary */}
        {!collapsed && (
          <div className="mt-6 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Today's Summary</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookings:</span>
                <span className="font-medium">23 / 40</span>
              </div>
              <Progress value={57.5} className="h-1" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seated:</span>
                <span className="text-success font-medium">18 guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="text-primary font-medium">$2,340</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-4 space-y-2">
            <Button variant="default" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              View Floor Plan
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}