import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProvisioningWizard, type ProvisioningData } from '@/components/provisioning/ProvisioningWizard'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function NewTenantPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleProvisioningComplete = async (data: ProvisioningData) => {
    try {
      console.log('Starting tenant provisioning...', { restaurantName: data.restaurantName })
      console.log('Full provisioning data:', data)
      
      // Call the comprehensive provision-tenant edge function
      const response = await supabase.functions.invoke('provision-tenant', {
        body: data
      })

      console.log('Raw Supabase response:', response)
      console.log('Response data:', response.data)
      console.log('Response error:', response.error)

      if (response.error) {
        console.error('Supabase function error:', response.error)
        throw new Error(`Function error: ${response.error.message}`)
      }

      const result = response.data
      if (!result) {
        throw new Error('No response data received from provisioning function')
      }

      if (!result.success) {
        console.error('Provisioning failed:', result)
        throw new Error(result.error || 'Failed to provision tenant')
      }

      toast({
        title: "Success!",
        description: result.message || `${data.restaurantName} has been successfully created!`,
      })

      // Navigate back to tenants list
      navigate('/admin/tenants')
    } catch (error) {
      console.error('Provisioning error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleCancel = () => {
    navigate('/admin/tenants')
  }

  return (
    <ProvisioningWizard 
      onComplete={handleProvisioningComplete}
      onCancel={handleCancel}
    />
  )
}