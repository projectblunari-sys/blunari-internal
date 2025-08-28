import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/hooks/useSubdomainRouting";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubdomainRouter } from "@/components/SubdomainRouter";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import Industries from "./pages/Industries";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ClientDashboard from "./pages/ClientDashboard";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="blunari-theme">
      <AuthProvider>
        <TenantProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SubdomainRouter />}>
                {/* Main app routes */}
                <Route index element={<Index />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="industries" element={<Industries />} />
                <Route path="about" element={<About />} />
                <Route path="auth" element={<Auth />} />
                <Route path="onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                <Route path="dashboard" element={
                  <ProtectedRoute requireTenant={true}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin" element={<Dashboard />} />
                
                {/* Client routes for tenant subdomains */}
                <Route path="client" element={
                  <ProtectedRoute requireTenant={true}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="not-found" element={<NotFound />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TenantProvider>
    </AuthProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
