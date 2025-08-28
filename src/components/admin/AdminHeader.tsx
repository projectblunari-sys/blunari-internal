import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useCallback } from "react"
import { 
  Bell, 
  Search, 
  Plus, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Command,
  CreditCard,
  Activity
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  const initials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}` 
    : user?.email?.[0]?.toUpperCase() || "A"

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email?.split('@')[0] || "Admin"

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery)
    }
  }, [searchQuery])

  const handleNotificationClick = useCallback(() => {
    navigate('/admin/notifications')
  }, [navigate])

  const handleQuickAction = useCallback(() => {
    navigate('/admin/tenants/new')
  }, [navigate])

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/dashboard')) return 'Dashboard'
    if (path.includes('/tenants')) return 'Tenants'
    if (path.includes('/employees')) return 'Employees'
    if (path.includes('/billing')) return 'Billing'
    if (path.includes('/operations')) return 'Operations'
    if (path.includes('/analytics')) return 'Analytics'
    if (path.includes('/observability')) return 'Observability'
    if (path.includes('/system-health')) return 'System Health'
    if (path.includes('/pos-systems')) return 'POS Systems'
    if (path.includes('/domains')) return 'Domains'
    if (path.includes('/agency-kit')) return 'Agency Kit'
    if (path.includes('/profile')) return 'Profile'
    if (path.includes('/impersonate')) return 'Impersonation'
    if (path.includes('/integrations')) return 'Integrations'
    if (path.includes('/notifications')) return 'Notifications'
    if (path.includes('/roadmap')) return 'Roadmap'
    if (path.includes('/settings')) return 'Settings'
    return 'Blunari Admin'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-glass backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <SidebarTrigger className="h-9 w-9 rounded-md hover:bg-accent/50 transition-colors duration-200" />
          
          {/* Enhanced Search */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
              <Command className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants, employees, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-80 pl-10 pr-10 bg-muted/30 border-border/30 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Action */}
          <Button 
            size="sm" 
            onClick={handleQuickAction}
            className="hidden md:flex bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Tenant
          </Button>

          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-accent/50 transition-colors duration-200"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Enhanced Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-md hover:bg-accent/50 hover:scale-105 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-primary text-primary-foreground border-2 border-background animate-pulse shadow-glow">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-background/95 backdrop-blur-xl border-border/50 shadow-premium animate-scale-in-center"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Notifications</span>
                  <Badge variant="secondary" className="text-xs">3 new</Badge>
                </div>
              </DropdownMenuLabel>
              
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="p-4 hover:bg-accent/30 cursor-pointer border-b border-border/30">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson joined your platform</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 hover:bg-accent/30 cursor-pointer border-b border-border/30">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">$299 from Premium subscription</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-4 hover:bg-accent/30 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">System update</p>
                      <p className="text-xs text-muted-foreground">Platform maintenance completed</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              
              <div className="p-3 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNotificationClick}
                  className="w-full justify-center hover:bg-accent/50"
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-auto pl-2 pr-3 rounded-full hover:scale-105 transition-all duration-200 ring-2 ring-transparent hover:ring-primary/20 hover:shadow-glow"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Administrator
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 bg-background/95 backdrop-blur-xl border-border/50 shadow-premium animate-scale-in-center" 
              align="end" 
              sideOffset={8}
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none text-foreground">
                        {displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary" className="text-xs">
                      Administrator
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Online
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/admin/profile')}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/admin/settings')}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={signOut}
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}