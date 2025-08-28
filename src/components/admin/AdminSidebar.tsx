import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  BarChart3, 
  TableProperties,
  Building,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Activity,
  Shield,
  Utensils,
  Globe
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/stores/dashboardStore"

const navigation = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: "Tenants", 
    url: "/admin/tenants",
    icon: Building,
    badge: "4"
  },
  {
    title: "Employees",
    url: "/admin/employees", 
    icon: Users,
    badge: null
  },
  {
    title: "Billing",
    url: "/admin/billing", 
    icon: CreditCard,
    badge: null
  },
  {
    title: "Observability",
    url: "/admin/observability", 
    icon: Activity,
    badge: null
  },
  {
    title: "System Health",
    url: "/admin/system-health", 
    icon: Shield,
    badge: null
  },
  {
    title: "POS Systems",
    url: "/admin/pos-systems", 
    icon: Utensils,
    badge: null
  },
  {
    title: "Domains",
    url: "/admin/domains", 
    icon: Globe,
    badge: null
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    badge: null
  }
]

const bottomNavigation = [
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    badge: "3"
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    badge: null
  }
]

export function AdminSidebar() {
  const { open } = useSidebar()
  const { sidebarOpen, toggleSidebar } = useDashboardStore()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard" || location.pathname === "/admin"
    }
    return location.pathname.startsWith(path)
  }

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200"
    const activeClasses = "bg-primary text-primary-foreground font-medium shadow-sm"
    const inactiveClasses = "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  return (
    <Sidebar className={`${!open ? "w-16" : "w-64"} border-r transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {open && (
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
              alt="Blunari Admin"
              className="w-8 h-8 rounded"
            />
            <span className="text-lg font-semibold">Blunari Admin</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {!open ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <SidebarContent className="flex flex-col justify-between">
        {/* Navigation Items */}
        <div className="space-y-4 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className={!open ? "sr-only" : ""}>
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {open && (
                          <>
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
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
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {open && (
                          <>
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="ml-auto text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
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
        </div>
      </SidebarContent>
    </Sidebar>
  )
}