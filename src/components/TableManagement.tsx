import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  MapPin,
  Settings,
  Eye,
  Copy
} from "lucide-react";

interface RestaurantTable {
  id: string;
  name: string;
  capacity: number;
  table_type: 'standard' | 'booth' | 'bar' | 'outdoor' | 'private';
  position_x?: number;
  position_y?: number;
  active: boolean;
  current_booking?: {
    guest_name: string;
    party_size: number;
    end_time: string;
  };
}

// Mock data - in real app this would come from API
const mockTables: RestaurantTable[] = [
  {
    id: '1',
    name: 'Table 1',
    capacity: 2,
    table_type: 'standard',
    active: true,
    position_x: 100,
    position_y: 100
  },
  {
    id: '2',
    name: 'Table 2',
    capacity: 4,
    table_type: 'standard',
    active: true,
    position_x: 200,
    position_y: 100,
    current_booking: {
      guest_name: 'John Smith',
      party_size: 4,
      end_time: '2024-01-28T21:00:00Z'
    }
  },
  {
    id: '3',
    name: 'Booth A',
    capacity: 6,
    table_type: 'booth',
    active: true,
    position_x: 300,
    position_y: 200
  },
  {
    id: '4',
    name: 'Table 4',
    capacity: 2,
    table_type: 'standard',
    active: true,
    position_x: 150,
    position_y: 250
  },
  {
    id: '5',
    name: 'Bar 1',
    capacity: 4,
    table_type: 'bar',
    active: true,
    position_x: 50,
    position_y: 300
  },
  {
    id: '6',
    name: 'Outdoor 1',
    capacity: 4,
    table_type: 'outdoor',
    active: false,
    position_x: 400,
    position_y: 150
  },
  {
    id: '7',
    name: 'Private Room',
    capacity: 12,
    table_type: 'private',
    active: true,
    position_x: 350,
    position_y: 300
  },
  {
    id: '8',
    name: 'Table 8',
    capacity: 3,
    table_type: 'standard',
    active: true,
    position_x: 250,
    position_y: 180,
    current_booking: {
      guest_name: 'Maria Garcia',
      party_size: 2,
      end_time: '2024-01-28T21:30:00Z'
    }
  }
];

export const TableManagement = () => {
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [viewMode, setViewMode] = useState<'grid' | 'layout'>('grid');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTableTypeBadge = (type: string) => {
    const colors = {
      standard: 'default',
      booth: 'secondary',
      bar: 'warning',
      outdoor: 'success',
      private: 'premium'
    };
    return <Badge variant={colors[type as keyof typeof colors] as any}>{type}</Badge>;
  };

  const getTableStatus = (table: RestaurantTable) => {
    if (!table.active) {
      return { status: 'inactive', badge: <Badge variant="destructive">Inactive</Badge> };
    }
    if (table.current_booking) {
      return { status: 'occupied', badge: <Badge variant="warning">Occupied</Badge> };
    }
    return { status: 'available', badge: <Badge variant="success">Available</Badge> };
  };

  const tableStats = {
    total: tables.length,
    active: tables.filter(t => t.active).length,
    occupied: tables.filter(t => t.current_booking && t.active).length,
    available: tables.filter(t => !t.current_booking && t.active).length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{tableStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tables</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{tableStats.available}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">{tableStats.occupied}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {Math.round((tableStats.occupied / tableStats.active) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Utilization</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Table Management</CardTitle>
              <CardDescription>
                Manage your restaurant's seating layout and availability
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </Button>
                <Button 
                  variant={viewMode === 'layout' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('layout')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Layout
                </Button>
              </div>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTables.map((table) => {
                const tableStatus = getTableStatus(table);
                
                return (
                  <Card key={table.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{table.name}</h3>
                          {tableStatus.badge}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Table
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Table Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Table
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacity:</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{table.capacity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        {getTableTypeBadge(table.table_type)}
                      </div>

                      {table.current_booking && (
                        <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                          <div className="text-sm">
                            <p className="font-medium text-warning-foreground">
                              {table.current_booking.guest_name}
                            </p>
                            <p className="text-warning-foreground/80">
                              Party of {table.current_booking.party_size}
                            </p>
                            <p className="text-xs text-warning-foreground/60 mt-1">
                              Until {new Date(table.current_booking.end_time).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <div className="bg-muted/30 rounded-lg p-8 min-h-[500px] relative border-2 border-dashed border-muted-foreground/20">
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">Restaurant Layout</Badge>
                </div>
                
                {/* Simple layout visualization */}
                <div className="grid grid-cols-6 gap-4 h-full">
                  {filteredTables.map((table) => {
                    const status = getTableStatus(table);
                    
                    return (
                      <div
                        key={table.id}
                        className={`
                          relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${status.status === 'available' ? 'bg-success/10 border-success hover:bg-success/20' : ''}
                          ${status.status === 'occupied' ? 'bg-warning/10 border-warning hover:bg-warning/20' : ''}
                          ${status.status === 'inactive' ? 'bg-muted border-muted-foreground hover:bg-muted/50' : ''}
                        `}
                        style={{
                          gridColumn: `span ${Math.min(2, Math.ceil(table.capacity / 2))}`,
                        }}
                      >
                        <div className="text-center">
                          <div className="font-medium text-sm">{table.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <Users className="w-3 h-3 inline mr-1" />
                            {table.capacity}
                          </div>
                          {table.current_booking && (
                            <div className="text-xs font-medium mt-1">
                              {table.current_booking.guest_name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                  Click and drag to arrange tables
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};