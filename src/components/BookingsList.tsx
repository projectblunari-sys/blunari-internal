import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Edit,
  Trash2,
  User
} from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  booking_time: string;
  table_name: string;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  created_at: string;
}

// Mock data - in real app this would come from API
const mockBookings: Booking[] = [
  {
    id: '1',
    guest_name: 'John Smith',
    guest_email: 'john@example.com',
    guest_phone: '+1 (555) 123-4567',
    party_size: 4,
    booking_time: '2024-01-28T19:00:00Z',
    table_name: 'Table 12',
    status: 'confirmed',
    special_requests: 'Window seat preferred',
    created_at: '2024-01-27T10:30:00Z'
  },
  {
    id: '2',
    guest_name: 'Maria Garcia',
    guest_email: 'maria@example.com',
    guest_phone: '+1 (555) 234-5678',
    party_size: 2,
    booking_time: '2024-01-28T19:30:00Z',
    table_name: 'Table 8',
    status: 'confirmed',
    created_at: '2024-01-27T14:15:00Z'
  },
  {
    id: '3',
    guest_name: 'David Wilson',
    guest_email: 'david@example.com',
    guest_phone: '+1 (555) 345-6789',
    party_size: 6,
    booking_time: '2024-01-28T20:00:00Z',
    table_name: 'Table 15',
    status: 'pending',
    special_requests: 'Birthday celebration - cake needed',
    created_at: '2024-01-27T16:45:00Z'
  },
  {
    id: '4',
    guest_name: 'Sarah Johnson',
    guest_email: 'sarah@example.com',
    guest_phone: '+1 (555) 456-7890',
    party_size: 3,
    booking_time: '2024-01-27T18:30:00Z',
    table_name: 'Table 5',
    status: 'completed',
    created_at: '2024-01-26T12:00:00Z'
  },
  {
    id: '5',
    guest_name: 'Michael Brown',
    guest_email: 'michael@example.com',
    guest_phone: '+1 (555) 567-8901',
    party_size: 2,
    booking_time: '2024-01-27T20:30:00Z',
    table_name: 'Table 3',
    status: 'no_show',
    created_at: '2024-01-26T15:30:00Z'
  }
];

export const BookingsList = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest_phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Confirmed
        </Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>;
      case 'seated':
        return <Badge variant="default" className="flex items-center gap-1">
          <User className="w-3 h-3" />
          Seated
        </Badge>;
      case 'completed':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </Badge>;
      case 'no_show':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          No Show
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    no_show: bookings.filter(b => b.status === 'no_show').length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "All", value: statusCounts.all, status: "all" },
          { label: "Confirmed", value: statusCounts.confirmed, status: "confirmed" },
          { label: "Pending", value: statusCounts.pending, status: "pending" },
          { label: "Completed", value: statusCounts.completed, status: "completed" },
          { label: "Cancelled", value: statusCounts.cancelled, status: "cancelled" },
          { label: "No Show", value: statusCounts.no_show, status: "no_show" }
        ].map((item) => (
          <Card 
            key={item.status}
            className={`shadow-card cursor-pointer transition-all duration-200 ${
              filterStatus === item.status ? 'ring-2 ring-primary' : 'hover:shadow-elegant'
            }`}
            onClick={() => setFilterStatus(item.status)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bookings Management</CardTitle>
              <CardDescription>
                View and manage all restaurant bookings
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Special Requests</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{booking.guest_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{booking.guest_phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {booking.party_size} {booking.party_size === 1 ? 'guest' : 'guests'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatDateTime(booking.booking_time)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {booking.table_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell>
                    {booking.special_requests ? (
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {booking.special_requests}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(booking.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Seated
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Guest
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};