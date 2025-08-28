import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Globe, 
  Shield, 
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Database,
  Activity,
  Zap,
  UserCog
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: BarChart3,
    description: "Platform metrics & KPIs"
  },
  {
    title: "Tenant Management",
    icon: Building2,
    items: [
      { title: "All Tenants", url: "/admin/tenants", icon: Building2 },
      { title: "Provisioning", url: "/admin/tenants/provision", icon: Zap },
      { title: "Billing & Plans", url: "/admin/tenants/billing", icon: CreditCard }
    ]
  },
  {
    title: "Platform Analytics",
    icon: BarChart3,
    items: [
      { title: "Performance Metrics", url: "/admin/analytics/performance", icon: Activity },
      { title: "Usage Statistics", url: "/admin/analytics/usage", icon: BarChart3 },
      { title: "Revenue Analytics", url: "/admin/analytics/revenue", icon: CreditCard }
    ]
  },
  {
    title: "System Administration",
    icon: Settings,
    items: [
      { title: "Database Health", url: "/admin/system/database", icon: Database },
      { title: "API Monitoring", url: "/admin/system/api", icon: Activity },
      { title: "Security Center", url: "/admin/system/security", icon: Shield },
      { title: "Domain Management", url: "/admin/system/domains", icon: Globe }
    ]
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: UserCog,
    description: "Admin users & permissions"
  },
  {
    title: "Support Center",
    icon: HelpCircle,
    items: [
      { title: "Support Tickets", url: "/admin/support/tickets", icon: HelpCircle },
      { title: "System Alerts", url: "/admin/support/alerts", icon: Bell },
      { title: "Documentation", url: "/admin/support/docs", icon: HelpCircle }
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>(['Tenant Management']);

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

  const collapsed = state === "collapsed";
  
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
                  Blunari Admin
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  Platform
                </Badge>
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

        {/* Platform Status */}
        {!collapsed && (
          <div className="mt-6 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">Platform Status</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="text-success">99.97%</span>
              </div>
              <div className="flex justify-between">
                <span>Response:</span>
                <span className="text-primary">142ms</span>
              </div>
              <div className="flex justify-between">
                <span>Tenants:</span>
                <span>24 active</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/admin-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Platform Admin</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/admin-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </Sidebar>
  );
}