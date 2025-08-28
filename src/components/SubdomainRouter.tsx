import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSubdomainRouting } from '@/hooks/useSubdomainRouting';
import { Card, CardContent } from '@/components/ui/card';

export const SubdomainRouter = () => {
  const routingInfo = useSubdomainRouting();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (routingInfo.type === 'loading') return;

    // Handle routing based on subdomain resolution
    switch (routingInfo.type) {
      case 'tenant_app':
        // If we're on a tenant subdomain, ensure we're on client routes
        if (!location.pathname.startsWith('/client')) {
          navigate('/client');
        }
        break;
      
      case 'main_app':
        // If we're on main app, ensure we're not on client routes
        if (location.pathname.startsWith('/client')) {
          navigate('/dashboard');
        }
        break;
      
      case 'tenant_not_found':
      case 'invalid_domain':
        navigate('/not-found');
        break;
      
      case 'error':
        navigate('/not-found');
        break;
    }
  }, [routingInfo.type, location.pathname, navigate]);

  // Show loading state while determining routing
  if (routingInfo.type === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Determining routing...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state for routing errors
  if (routingInfo.type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-destructive text-xl">!</span>
            </div>
            <h2 className="text-xl font-semibold">Routing Error</h2>
            <p className="text-muted-foreground">
              {routingInfo.error || 'Unable to determine routing'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show tenant not found state
  if (routingInfo.type === 'tenant_not_found') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-warning text-xl">?</span>
            </div>
            <h2 className="text-xl font-semibold">Restaurant Not Found</h2>
            <p className="text-muted-foreground">
              The restaurant "{routingInfo.subdomain}" could not be found.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check the URL and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the main application
  return <Outlet />;
};