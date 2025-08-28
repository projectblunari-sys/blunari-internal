import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Phone,
  Mail,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Download,
  MapPin
} from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  booking_time: string;
  duration_minutes: number;
  table_name?: string;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  deposit_required: boolean;
  deposit_paid: boolean;
  created_at: string;
  notes?: string;
}

export const EnhancedBookingsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [sortBy, setSortBy] = useState("booking_time");

  // Mock data - in real app this would come from API
  const bookings: Booking[] = [
    {
      id: "1",
      guest_name: "John Smith",
      guest_email: "john@example.com", 
      guest_phone: "+1 (555) 123-4567",
      party_size: 4,
      booking_time: "2024-02-28T19:00:00",
      duration_minutes: 120,
      table_name: "Table 12",
      status: "confirmed",
      special_requests: "Window seat preferred",
      deposit_required: false,
      deposit_paid: false,
      created_at: "2024-02-25T10:30:00",
      notes: "Regular customer, celebrating anniversary"
    },
    {
      id: "2",
      guest_name: "Maria Garcia",
      guest_email: "maria@example.com",
      guest_phone: "+1 (555) 234-5678", 
      party_size: 2,
      booking_time: "2024-02-28T19:30:00",
      duration_minutes: 90,
      table_name: "Table 8",
      status: "seated",
      deposit_required: true,
      deposit_paid: true,
      created_at: "2024-02-26T14:15:00"
    },
    {
      id: "3",
      guest_name: "David Wilson",
      guest_email: "david@example.com",
      guest_phone: "+1 (555) 345-6789",
      party_size: 6,
      booking_time: "2024-02-28T20:00:00", 
      duration_minutes: 150,
      table_name: "Table 15",
      status: "pending",
      special_requests: "Birthday celebration, need high chair",
      deposit_required: true,
      deposit_paid: false,
      created_at: "2024-02-27T09:45:00"
    },
    {
      id: "4",
      guest_name: "Lisa Chen",
      guest_email: "lisa@example.com",
      guest_phone: "+1 (555) 456-7890",
      party_size: 3,
      booking_time: "2024-02-28T18:30:00",
      duration_minutes: 120,
      status: "completed",
      deposit_required: false,
      deposit_paid: false,
      created_at: "2024-02-27T16:20:00"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'seated':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      case 'no_show':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'seated':
        return <Users className="w-4 h-4 text-success" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'no_show':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString();
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest_phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bookings Management</h2>
          <p className="text-muted-foreground">
            Manage all restaurant reservations and guest information
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="seated">Seated</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Dates</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking_time">Booking Time</SelectItem>
                  <SelectItem value="guest_name">Guest Name</SelectItem>
                  <SelectItem value="party_size">Party Size</SelectItem>
                  <SelectItem value="created_at">Date Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/guest-${booking.id}.jpg`} />
                    <AvatarFallback>{booking.guest_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Guest Info */}
                    <div>
                      <h3 className="font-semibold text-lg">{booking.guest_name}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{booking.guest_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{booking.guest_phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(booking.status)}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(booking.booking_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(booking.booking_time)} ({booking.duration_minutes}min)</span>
                        </div>
                      </div>
                    </div>

                    {/* Party & Table Info */}
                    <div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">Party of {booking.party_size}</span>
                        </div>
                        {booking.table_name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{booking.table_name}</span>
                          </div>
                        )}
                        {booking.deposit_required && (
                          <Badge 
                            variant="outline" 
                            className={booking.deposit_paid ? "border-success text-success" : "border-warning text-warning"}
                          >
                            Deposit {booking.deposit_paid ? "Paid" : "Required"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Special Requests & Notes */}
                    <div>
                      {booking.special_requests && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Special Requests:</p>
                          <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                        </div>
                      )}
                      {booking.notes && (
                        <div>
                          <p className="text-sm font-medium">Notes:</p>
                          <p className="text-sm text-muted-foreground">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Booking
                    </DropdownMenuItem>
                    {booking.status === 'confirmed' && (
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Mark as Seated
                      </DropdownMenuItem>
                    )}
                    {booking.status === 'seated' && (
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Guest
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{bookings.filter(b => b.status === 'confirmed').length} Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>{bookings.filter(b => b.status === 'seated').length} Seated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span>{bookings.filter(b => b.status === 'pending').length} Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};