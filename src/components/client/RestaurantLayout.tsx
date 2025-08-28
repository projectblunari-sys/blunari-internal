import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/client/RestaurantSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Settings, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RestaurantLayoutProps {
  children: React.ReactNode;
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
  // Mock restaurant data - in real app this would come from auth context
  const restaurant = {
    name: "Bella Vista Restaurant",
    plan: "Professional",
    owner: "Sarah Chen",
    notifications: 3
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-subtle">
        <RestaurantSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden md:flex items-center gap-3">
                <img 
                  src="https://raw.githubusercontent.com/3sc0rp/Blunari/refs/heads/main/logo-bg.png" 
                  alt="Blunari Logo"
                  className="w-6 h-6 rounded"
                />
                <span className="font-bold bg-gradient-hero bg-clip-text text-transparent">
                  {restaurant.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {restaurant.plan}
                </Badge>
              </div>
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings, tables, or guests..."
                  className="pl-10 w-80"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Quick Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-success/10">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">23 Bookings Today</span>
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {restaurant.notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {restaurant.notifications}
                  </Badge>
                )}
              </Button>
              
              {/* Help */}
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              
              {/* Settings */}
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/restaurant-owner.jpg" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{restaurant.owner}</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Restaurant Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing & Plans</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}