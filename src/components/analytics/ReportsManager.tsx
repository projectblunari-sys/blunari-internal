import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Download, 
  Settings, 
  Clock,
  TrendingUp,
  Filter,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import { useDataExport } from '@/hooks/useDataExport';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'custom' | 'template';
  schedule?: string;
  filters: Record<string, any>;
  format: 'csv' | 'json';
  recipients: string[];
  lastRun?: Date;
  nextRun?: Date;
  status: 'active' | 'paused' | 'draft';
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Weekly Performance Summary',
    description: 'Comprehensive weekly performance metrics and KPIs',
    type: 'scheduled',
    schedule: 'weekly',
    filters: { dateRange: '7d', includeMetrics: true, includeTrends: true },
    format: 'csv',
    recipients: ['admin@example.com', 'team@example.com'],
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: '2',
    name: 'Daily Operations Report',
    description: 'Daily booking and operational metrics',
    type: 'scheduled',
    schedule: 'daily',
    filters: { dateRange: '1d', includeBookings: true, includeErrors: true },
    format: 'csv',
    recipients: ['operations@example.com'],
    lastRun: new Date(Date.now() - 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 23 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: '3',
    name: 'Monthly Revenue Analysis',
    description: 'Detailed monthly revenue breakdown and trends',
    type: 'scheduled',
    schedule: 'monthly',
    filters: { dateRange: '30d', includeRevenue: true, includeForecasts: true },
    format: 'csv',
    recipients: ['finance@example.com'],
    lastRun: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'active'
  }
];

export const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    name: '',
    description: '',
    type: 'custom',
    format: 'csv',
    filters: {},
    recipients: [],
    status: 'draft'
  });

  const { exportDashboardData } = useDataExport();
  const { trackFeatureUsage } = useAnalyticsTracking();

  useEffect(() => {
    trackFeatureUsage('analytics', 'reports_manager_view');
  }, [trackFeatureUsage]);

  const handleCreateReport = () => {
    const report: Report = {
      id: Date.now().toString(),
      name: newReport.name || 'Untitled Report',
      description: newReport.description || '',
      type: newReport.type || 'custom',
      filters: newReport.filters || {},
      format: newReport.format || 'csv',
      recipients: newReport.recipients || [],
      status: newReport.status || 'draft'
    };

    setReports(prev => [...prev, report]);
    setNewReport({
      name: '',
      description: '',
      type: 'custom',
      format: 'csv',
      filters: {},
      recipients: [],
      status: 'draft'
    });
    setIsCreateDialogOpen(false);
    
    trackFeatureUsage('analytics', 'report_created', { reportType: report.type });
  };

  const handleRunReport = async (report: Report) => {
    trackFeatureUsage('analytics', 'report_executed', { reportId: report.id });
    
    await exportDashboardData({
      format: report.format,
      dateRange: dateRange || undefined,
      includeMetrics: report.filters.includeMetrics || false
    });

    // Update last run time
    setReports(prev => prev.map(r => 
      r.id === report.id 
        ? { ...r, lastRun: new Date() }
        : r
    ));
  };

  const handleToggleReportStatus = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
        : r
    ));
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    trackFeatureUsage('analytics', 'report_deleted', { reportId });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScheduleBadge = (schedule?: string) => {
    if (!schedule) return null;
    
    const scheduleColors = {
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-purple-100 text-purple-800',
      monthly: 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={scheduleColors[schedule as keyof typeof scheduleColors] || 'bg-gray-100 text-gray-800'}>
        <Clock className="h-3 w-3 mr-1" />
        {schedule}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports Manager</h2>
          <p className="text-muted-foreground">
            Create, schedule, and manage custom reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter
            value={dateRange}
            onChange={setDateRange}
            onRefresh={() => {}}
          />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Configure a new custom report with specific filters and scheduling
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={newReport.name || ''}
                      onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Type</Label>
                    <Select
                      value={newReport.type}
                      onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value as Report['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-description">Description</Label>
                  <Textarea
                    id="report-description"
                    value={newReport.description || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this report includes"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select
                      value={newReport.format}
                      onValueChange={(value) => setNewReport(prev => ({ ...prev, format: value as 'csv' | 'json' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients (emails)</Label>
                    <Input
                      id="recipients"
                      placeholder="email1@example.com, email2@example.com"
                      onChange={(e) => {
                        const emails = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                        setNewReport(prev => ({ ...prev, recipients: emails }));
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Include Data</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-metrics"
                        checked={newReport.filters?.includeMetrics || false}
                        onCheckedChange={(checked) =>
                          setNewReport(prev => ({
                            ...prev,
                            filters: { ...prev.filters, includeMetrics: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="include-metrics" className="text-sm">
                        Performance Metrics
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-bookings"
                        checked={newReport.filters?.includeBookings || false}
                        onCheckedChange={(checked) =>
                          setNewReport(prev => ({
                            ...prev,
                            filters: { ...prev.filters, includeBookings: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="include-bookings" className="text-sm">
                        Booking Data
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-revenue"
                        checked={newReport.filters?.includeRevenue || false}
                        onCheckedChange={(checked) =>
                          setNewReport(prev => ({
                            ...prev,
                            filters: { ...prev.filters, includeRevenue: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="include-revenue" className="text-sm">
                        Revenue Analytics
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-trends"
                        checked={newReport.filters?.includeTrends || false}
                        onCheckedChange={(checked) =>
                          setNewReport(prev => ({
                            ...prev,
                            filters: { ...prev.filters, includeTrends: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="include-trends" className="text-sm">
                        Trend Analysis
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport}>
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                All Reports
              </CardTitle>
              <CardDescription>
                Manage and execute all your analytics reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{getScheduleBadge(report.schedule)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.lastRun?.toLocaleDateString() || 'Never'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.nextRun?.toLocaleDateString() || 'Not scheduled'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunReport(report)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleReportStatus(report.id)}
                          >
                            {report.status === 'active' ? 'Pause' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingReport(report)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated reports that run on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.type === 'scheduled').map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                      <div className="flex items-center gap-2">
                        {getScheduleBadge(report.schedule)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleRunReport(report)}>
                        <Download className="h-3 w-3 mr-1" />
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                One-time or manually triggered reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.type === 'custom').map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleRunReport(report)}>
                        <Download className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Pre-configured templates for common reporting needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Dashboard</CardTitle>
                    <CardDescription>
                      Complete system performance overview with key metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                    <CardDescription>
                      Revenue, bookings, and financial performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Operational Report</CardTitle>
                    <CardDescription>
                      Daily operations, errors, and system health status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};