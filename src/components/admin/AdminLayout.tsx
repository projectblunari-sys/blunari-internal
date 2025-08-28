import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { useDashboardStore } from "@/stores/dashboardStore"
import { Outlet } from "react-router-dom"

interface AdminLayoutProps {
  children?: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { sidebarOpen } = useDashboardStore()

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-auto p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}