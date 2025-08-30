import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Clock, Globe } from 'lucide-react'
import type { ProvisioningData } from '../ProvisioningWizard'

interface MinimalBusinessStepProps {
  data: ProvisioningData
  updateData: (updates: Partial<ProvisioningData>) => void
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
]

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function MinimalBusinessStep({ data, updateData }: MinimalBusinessStepProps) {
  const updateBusinessHours = (dayOfWeek: number, updates: Partial<typeof data.businessHours[0]>) => {
    const newHours = data.businessHours.map(h => 
      h.dayOfWeek === dayOfWeek ? { ...h, ...updates } : h
    )
    updateData({ businessHours: newHours })
  }

  const setAllDays = (isOpen: boolean, openTime = '09:00', closeTime = '22:00') => {
    const newHours = data.businessHours.map(h => ({
      ...h,
      isOpen,
      openTime: isOpen ? openTime : undefined,
      closeTime: isOpen ? closeTime : undefined
    }))
    updateData({ businessHours: newHours })
  }

  return (
    <div className="space-y-6">
      {/* Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Timezone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="timezone">Restaurant Timezone *</Label>
            <Select
              value={data.timezone}
              onValueChange={(value) => updateData({ timezone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
          <CardDescription>
            Set when your restaurant is open for bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Setup */}
          <div className="flex gap-2 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium">Quick setup:</div>
            <button
              type="button"
              onClick={() => setAllDays(true, '09:00', '22:00')}
              className="text-xs text-primary hover:underline"
            >
              9AM-10PM Daily
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              type="button"
              onClick={() => setAllDays(false)}
              className="text-xs text-primary hover:underline"
            >
              Closed All Days
            </button>
          </div>

          {/* Days */}
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const dayHours = data.businessHours.find(h => h.dayOfWeek === index)
              return (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="min-w-24">
                    <span className="font-medium">{day}</span>
                  </div>
                  
                  <Switch
                    checked={dayHours?.isOpen || false}
                    onCheckedChange={(checked) => 
                      updateBusinessHours(index, { 
                        isOpen: checked,
                        openTime: checked ? '09:00' : undefined,
                        closeTime: checked ? '22:00' : undefined
                      })
                    }
                  />

                  {dayHours?.isOpen && (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={dayHours.openTime || '09:00'}
                        onChange={(e) => updateBusinessHours(index, { openTime: e.target.value })}
                        className="w-auto"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={dayHours.closeTime || '22:00'}
                        onChange={(e) => updateBusinessHours(index, { closeTime: e.target.value })}
                        className="w-auto"
                      />
                    </div>
                  )}

                  {!dayHours?.isOpen && (
                    <span className="text-muted-foreground text-sm">Closed</span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}