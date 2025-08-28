import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface SubdomainRoutingResult {
  type: 'main_app' | 'tenant_app' | 'tenant_not_found' | 'invalid_domain' | 'error' | 'loading';
  subdomain: string | null;
  tenant: TenantInfo | null;
  redirectTo: string | null;
  error?: string;
}

export const useSubdomainRouting = () => {
  const [routingInfo, setRoutingInfo] = useState<SubdomainRoutingResult>({
    type: 'loading',
    subdomain: null,
    tenant: null,
    redirectTo: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleSubdomainRouting = async () => {
      try {
        // Get current host
        const host = window.location.host;
        
        // For development - check if we're on localhost without subdomain
        if (host === 'localhost:5173' || host === 'localhost:3000' || !host.includes('.')) {
          setRoutingInfo({
            type: 'main_app',
            subdomain: null,
            tenant: null,
            redirectTo: '/dashboard'
          });
          return;
        }

        // Call subdomain router edge function
        const { data, error } = await supabase.functions.invoke('subdomain-router', {
          body: {},
          headers: {
            'host': host
          }
        });

        if (error) {
          console.error('Subdomain routing error:', error);
          setRoutingInfo({
            type: 'error',
            subdomain: null,
            tenant: null,
            redirectTo: '/not-found',
            error: error.message
          });
          return;
        }

        console.log('Subdomain routing result:', data);
        setRoutingInfo(data);

        // Handle automatic redirects based on routing type
        if (data.type === 'tenant_app' && window.location.pathname === '/') {
          navigate('/client');
        } else if (data.type === 'main_app' && window.location.pathname === '/') {
          navigate('/dashboard');
        } else if (data.type === 'tenant_not_found') {
          navigate('/not-found');
        }

      } catch (error) {
        console.error('Subdomain routing error:', error);
        setRoutingInfo({
          type: 'error',
          subdomain: null,
          tenant: null,
          redirectTo: '/not-found',
          error: 'Failed to determine routing'
        });
      }
    };

    handleSubdomainRouting();
  }, [navigate]);

  return routingInfo;
};

// Context for sharing tenant information across components
import { createContext, useContext } from 'react';

interface TenantContextType {
  tenant: TenantInfo | null;
  subdomain: string | null;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const routingInfo = useSubdomainRouting();

  const value = {
    tenant: routingInfo.tenant,
    subdomain: routingInfo.subdomain,
    isLoading: routingInfo.type === 'loading'
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};