import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Store, Globe, Mail, Phone, MapPin } from 'lucide-react'
import type { ProvisioningData } from '../ProvisioningWizard'
import { supabase } from '@/integrations/supabase/client'

interface CuisineType {
  id: string
  name: string
  icon: string
}

interface RestaurantInfoStepProps {
  data: ProvisioningData
  updateData: (updates: Partial<ProvisioningData>) => void
}

export function RestaurantInfoStep({ data, updateData }: RestaurantInfoStepProps) {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([])

  useEffect(() => {
    const fetchCuisineTypes = async () => {
      const { data: cuisines } = await supabase
        .from('cuisine_types')
        .select('*')
        .order('name')
      setCuisineTypes(cuisines || [])
    }
    fetchCuisineTypes()
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Restaurant Information</h2>
        <p className="text-muted-foreground">Tell us about your restaurant to create your business profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Essential details about your restaurant that will appear on your client dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="restaurantName" className="text-sm font-medium">
                Restaurant Name *
              </Label>
              <Input
                id="restaurantName"
                placeholder="e.g., Bella Vista Ristorante"
                value={data.restaurantName}
                onChange={(e) => updateData({ restaurantName: e.target.value })}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">This will be your business display name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisineType" className="text-sm font-medium">
                Cuisine Type *
              </Label>
              <Select
                value={data.cuisineTypeId}
                onValueChange={(value) => updateData({ cuisineTypeId: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your cuisine style" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine.id} value={cuisine.id}>
                      <div className="flex items-center gap-2">
                        <span>{cuisine.icon}</span>
                        <span>{cuisine.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Business Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of your restaurant, ambiance, and specialties..."
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">Optional: Help customers understand your unique offering</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Contact Information
          </CardTitle>
          <CardDescription>
            How customers and partners can reach your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Business Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@restaurant.com"
                  value={data.email}
                  onChange={(e) => updateData({ email: e.target.value })}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={data.phone}
                  onChange={(e) => updateData({ phone: e.target.value })}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://www.restaurant.com"
                value={data.website}
                onChange={(e) => updateData({ website: e.target.value })}
                className="h-11 pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
          <CardDescription>
            Restaurant address for customer navigation and delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-sm font-medium">
              Street Address
            </Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              value={data.address.street}
              onChange={(e) => updateData({ 
                address: { ...data.address, street: e.target.value }
              })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Input
                id="city"
                placeholder="New York"
                value={data.address.city}
                onChange={(e) => updateData({ 
                  address: { ...data.address, city: e.target.value }
                })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                placeholder="NY"
                value={data.address.state}
                onChange={(e) => updateData({ 
                  address: { ...data.address, state: e.target.value }
                })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={data.address.zipCode}
                onChange={(e) => updateData({ 
                  address: { ...data.address, zipCode: e.target.value }
                })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              <Select
                value={data.address.country}
                onValueChange={(value) => updateData({ 
                  address: { ...data.address, country: value }
                })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.slug && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Your restaurant slug:</strong> <code className="bg-background px-2 py-1 rounded text-foreground">{data.slug}</code>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This unique identifier will be used for your restaurant's booking URLs and API endpoints
          </p>
        </div>
      )}
    </div>
  )
}