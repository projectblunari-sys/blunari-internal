import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Mail, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProvisioningData } from '../ProvisioningWizard'
import { supabase } from '@/integrations/supabase/client'

interface CuisineType {
  id: string
  name: string
  icon: string
}

interface MinimalBasicStepProps {
  data: ProvisioningData
  updateData: (updates: Partial<ProvisioningData>) => void
}

export function MinimalBasicStep({ data, updateData }: MinimalBasicStepProps) {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([])
  const [showPassword, setShowPassword] = useState(false)

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

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    updateData({ ownerPassword: password })
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Restaurant Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name *</Label>
              <Input
                id="restaurantName"
                placeholder="e.g., Bella Vista Italian"
                value={data.restaurantName}
                onChange={(e) => updateData({ restaurantName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type *</Label>
              <Select
                value={data.cuisineTypeId}
                onValueChange={(value) => updateData({ cuisineTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine type" />
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
            <Label htmlFor="email">Restaurant Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@restaurant.com"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Owner Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Admin Account
          </CardTitle>
          <CardDescription>
            Create your administrator account to manage the restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerFirstName">First Name *</Label>
              <Input
                id="ownerFirstName"
                placeholder="John"
                value={data.ownerFirstName}
                onChange={(e) => updateData({ ownerFirstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerLastName">Last Name *</Label>
              <Input
                id="ownerLastName"
                placeholder="Doe"
                value={data.ownerLastName}
                onChange={(e) => updateData({ ownerLastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Admin Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="ownerEmail"
                type="email"
                placeholder="admin@restaurant.com"
                value={data.ownerEmail}
                onChange={(e) => updateData({ ownerEmail: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPassword">Password *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="ownerPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Strong password"
                  value={data.ownerPassword}
                  onChange={(e) => updateData({ ownerPassword: e.target.value })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                className="shrink-0"
              >
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}