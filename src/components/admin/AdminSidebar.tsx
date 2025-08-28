import React, { memo, useMemo } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  CreditCard, 
  Activity, 
  Shield, 
  Utensils, 
  Globe, 
  Building2, 
  BarChart3, 
  User, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plug,
  Rocket
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  badge?: string | null;
  description?: string;
}

const mainNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
    description: "Overview and key metrics"
  },
  {
    title: "Tenants", 
    url: "/admin/tenants",
    icon: Building,
    badge: "4",
    description: "Manage restaurant tenants"
  },
  {
    title: "Employees",
    url: "/admin/employees", 
    icon: Users,
    badge: null,
    description: "Team and permissions"
  },
  {
    title: "Billing",
    url: "/admin/billing", 
    icon: CreditCard,
    badge: null,
    description: "Subscriptions and payments"
  }
];

const operationsNavigation: NavigationItem[] = [
  {
    title: "Operations",
    url: "/admin/operations", 
    icon: Activity,
    badge: null,
    description: "Deployments and monitoring"
  },
  {
    title: "Analytics",
    url: "/admin/analytics", 
    icon: BarChart3,
    badge: null,
    description: "Reports and insights"
  },
  {
    title: "Observability",
    url: "/admin/observability", 
    icon: Shield,
    badge: null,
    description: "Metrics and alerts"
  },
  {
    title: "System Health",
    url: "/admin/system-health", 
    icon: Shield,
    badge: null,
    description: "Health checks and diagnostics"
  }
];

const platformNavigation: NavigationItem[] = [
  {
    title: "POS Systems",
    url: "/admin/pos-systems", 
    icon: Utensils,
    badge: null,
    description: "Point of sale integrations"
  },
  {
    title: "Domains",
    url: "/admin/domains", 
    icon: Globe,
    badge: null,
    description: "Domain management"
  },
  {
    title: "Agency Kit",
    url: "/admin/agency-kit", 
    icon: Building2,
    badge: null,
    description: "Partner and agency tools"
  },
  {
    title: "Integrations",
    url: "/admin/integrations", 
    icon: Plug,
    badge: null,
    description: "Third-party integrations"
  },
  {
    title: "Impersonate",
    url: "/admin/impersonate", 
    icon: Shield,
    badge: null,
    description: "User impersonation"
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    badge: null,
    description: "Data and insights"
  },
  {
    title: "Roadmap",
    url: "/admin/roadmap",
    icon: Rocket,
    badge: "New",
    description: "Future features"
  }
];

const bottomNavigation: NavigationItem[] = [
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
    badge: null,
    description: "User profile and preferences"
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    badge: "3",
    description: "System notifications"
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    badge: null,
    description: "System configuration"
  }
];

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  isActive: (path: string) => boolean;
  getNavClassName: (path: string) => string;
  showTooltips: boolean;
}

const NavigationSection = memo<NavigationSectionProps>(({ 
  title, 
  items, 
  isActive, 
  getNavClassName, 
  showTooltips 
}) => {
  const { open } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={!open ? "sr-only" : ""}>
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.url} 
                  className={getNavClassName(item.url)}
                  title={showTooltips ? item.description : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {open && (
                    <>
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActive(item.url) ? "secondary" : "outline"} 
                          className="ml-auto text-xs font-medium"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

NavigationSection.displayName = 'NavigationSection';

export const AdminSidebar = memo(() => {
  const { open } = useSidebar();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();
  const location = useLocation();

  const isActive = useMemo(() => (path: string) => {
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard" || location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const getNavClassName = useMemo(() => (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 hover:bg-accent/50";
    const activeClasses = "bg-accent text-accent-foreground font-medium";
    const inactiveClasses = "text-muted-foreground hover:text-foreground";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  }, [isActive]);

  return (
    <Sidebar className={`${!open ? "w-16" : "w-64"} border-r transition-all duration-300 bg-card`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50">
        {open && (
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
              alt="Blunari Admin"
              className="w-8 h-8 rounded object-cover"
              loading="lazy"
            />
            <span className="text-lg font-semibold text-foreground">Blunari Admin</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 hover:bg-accent"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {!open ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <SidebarContent className="flex flex-col justify-between">
        {/* Main Navigation */}
        <div className="space-y-4 py-4">
          <NavigationSection
            title="Main"
            items={mainNavigation}
            isActive={isActive}
            getNavClassName={getNavClassName}
            showTooltips={!open}
          />

          <NavigationSection
            title="Operations"
            items={operationsNavigation}
            isActive={isActive}
            getNavClassName={getNavClassName}
            showTooltips={!open}
          />

          <NavigationSection
            title="Platform"
            items={platformNavigation}
            isActive={isActive}
            getNavClassName={getNavClassName}
            showTooltips={!open}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-4 bg-card/50">
          <NavigationSection
            title="Account"
            items={bottomNavigation}
            isActive={isActive}
            getNavClassName={getNavClassName}
            showTooltips={!open}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  );
});

AdminSidebar.displayName = 'AdminSidebar';