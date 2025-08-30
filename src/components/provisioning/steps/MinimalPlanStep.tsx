import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap } from 'lucide-react'
import type { ProvisioningData } from '../ProvisioningWizard'
import { supabase } from '@/integrations/supabase/client'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthly_price: number
  yearly_price: number
  features: any // Database type is Json
  is_popular?: boolean
}

interface MinimalPlanStepProps {
  data: ProvisioningData
  updateData: (updates: Partial<ProvisioningData>) => void
}

export function MinimalPlanStep({ data, updateData }: MinimalPlanStepProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data: plansData } = await supabase
          .from('pricing_plans')
          .select('*')
          .eq('is_active', true)
          .order('monthly_price')
        
        // Ensure features is an array
        const processedPlans = (plansData || []).map(plan => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : []
        }))
        
        setPlans(processedPlans)
      } catch (error) {
        console.error('Error fetching plans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100)
  }

  const getDisplayPrice = (plan: PricingPlan) => {
    const price = data.billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
    const period = data.billingCycle === 'yearly' ? 'year' : 'month'
    return `${formatPrice(price)} / ${period}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Billing Cycle Toggle */}
      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            value={data.billingCycle}
            onValueChange={(value: 'monthly' | 'yearly') => updateData({ billingCycle: value })}
            className="flex justify-center gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label htmlFor="yearly" className="flex items-center gap-2">
                Yearly
                <Badge variant="secondary" className="text-xs">Save 20%</Badge>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <RadioGroup
        value={data.selectedPlanId}
        onValueChange={(value) => updateData({ selectedPlanId: value })}
        className="space-y-4"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem
              value={plan.id}
              id={plan.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={plan.id}
              className="flex cursor-pointer"
            >
              <Card className="w-full transition-all hover:shadow-md peer-checked:ring-2 peer-checked:ring-primary peer-checked:border-primary">
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        {getDisplayPrice(plan)}
                      </div>
                      {data.billingCycle === 'yearly' && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPrice(plan.monthly_price)} / month
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Selected Plan Summary */}
      {data.selectedPlanId && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Plan Selected</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your restaurant will be set up with the selected plan features. 
              You can upgrade or downgrade anytime from your dashboard.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}