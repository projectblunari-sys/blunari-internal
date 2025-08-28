import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExportOptions {
  format: 'csv' | 'json';
  dateRange?: { from: Date; to: Date };
  includeMetrics?: boolean;
}

export const useDataExport = () => {
  const { toast } = useToast();

  const exportDashboardData = useCallback(async (options: ExportOptions) => {
    const { format, dateRange, includeMetrics = true } = options;
    
    try {
      toast({
        title: "Preparing Export",
        description: "Gathering data for export...",
      });

      // Fetch comprehensive data
      const [tenantsResult, bookingsResult] = await Promise.all([
        supabase.from('tenants').select('*'),
        dateRange 
          ? supabase
              .from('bookings')
              .select('*')
              .gte('created_at', dateRange.from.toISOString())
              .lte('created_at', dateRange.to.toISOString())
          : supabase.from('bookings').select('*')
      ]);

      if (tenantsResult.error) throw tenantsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          dateRange: dateRange ? {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString()
          } : null,
          totalRecords: {
            tenants: tenantsResult.data?.length || 0,
            bookings: bookingsResult.data?.length || 0
          }
        },
        tenants: tenantsResult.data || [],
        bookings: bookingsResult.data || [],
        ...(includeMetrics && {
          metrics: {
            totalTenants: tenantsResult.data?.length || 0,
            activeTenants: tenantsResult.data?.filter(t => t.status === 'active').length || 0,
            totalBookings: bookingsResult.data?.length || 0,
            averageBookingsPerTenant: Math.round((bookingsResult.data?.length || 0) / Math.max(tenantsResult.data?.length || 1, 1)),
            revenueSummary: {
              mrr: (tenantsResult.data?.filter(t => t.status === 'active').length || 0) * 49.99,
              projectedAnnualRevenue: (tenantsResult.data?.filter(t => t.status === 'active').length || 0) * 49.99 * 12
            }
          }
        })
      };

      // Generate file content
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        content = generateCSV(exportData);
        filename = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(exportData, null, 2);
        filename = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Data exported successfully as ${filename}`,
      });

    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateCSV = (data: any): string => {
    const rows: string[] = [];
    
    // Add metadata
    rows.push('# Dashboard Export Metadata');
    rows.push(`Export Date,${data.metadata.exportDate}`);
    rows.push(`Total Tenants,${data.metadata.totalRecords.tenants}`);
    rows.push(`Total Bookings,${data.metadata.totalRecords.bookings}`);
    rows.push('');
    
    // Add tenants section
    if (data.tenants.length > 0) {
      rows.push('# Tenants Data');
      const tenantHeaders = Object.keys(data.tenants[0]);
      rows.push(tenantHeaders.join(','));
      
      data.tenants.forEach((tenant: any) => {
        const values = tenantHeaders.map(header => {
          const value = tenant[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value?.toString() || '';
        });
        rows.push(values.join(','));
      });
      rows.push('');
    }

    // Add metrics section
    if (data.metrics) {
      rows.push('# Metrics Summary');
      rows.push('Metric,Value');
      rows.push(`Total Tenants,${data.metrics.totalTenants}`);
      rows.push(`Active Tenants,${data.metrics.activeTenants}`);
      rows.push(`Total Bookings,${data.metrics.totalBookings}`);
      rows.push(`Average Bookings Per Tenant,${data.metrics.averageBookingsPerTenant}`);
      rows.push(`Monthly Recurring Revenue,$${data.metrics.revenueSummary.mrr}`);
      rows.push(`Projected Annual Revenue,$${data.metrics.revenueSummary.projectedAnnualRevenue}`);
    }

    return rows.join('\n');
  };

  return { exportDashboardData };
};