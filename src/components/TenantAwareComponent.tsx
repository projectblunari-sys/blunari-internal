import { useTenant } from '@/hooks/useSubdomainRouting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TenantAwareComponentProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const TenantAwareComponent = ({ children, fallback }: TenantAwareComponentProps) => {
  const { tenant, subdomain, isLoading } = useTenant();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-muted rounded"></div>
      </div>
    );
  }

  if (!tenant && fallback) {
    return <>{fallback}</>;
  }

  if (!tenant) {
    return null;
  }

  return <>{children}</>;
};

export const TenantInfo = () => {
  const { tenant, subdomain } = useTenant();

  if (!tenant) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Current Restaurant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Name:</span>
          <span className="font-medium">{tenant.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subdomain:</span>
          <Badge variant="secondary">{subdomain}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
            {tenant.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};