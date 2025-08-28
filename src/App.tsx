import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TenantsPage from "./pages/TenantsPage";
import SettingsPage from "./pages/SettingsPage";

import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="blunari-admin-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Login Page */}
              <Route path="/" element={<Auth />} />
              
              {/* Redirect /admin to dashboard if authenticated, otherwise to landing */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* Authentication */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Onboarding for new admin users */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              {/* Admin Dashboard - Main Application */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireTenant={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Sub-routes */}
              <Route path="/admin/tenants" element={
                <ProtectedRoute requireTenant={true}>
                  <TenantsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/settings" element={
                <ProtectedRoute requireTenant={true}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/*" element={
                <ProtectedRoute requireTenant={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 page */}
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;