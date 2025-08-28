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
      // Call the enhanced provision_tenant function with all the new data
      const { data: result, error } = await supabase.rpc('provision_tenant', {
        p_user_id: data.ownerEmail, // Will be replaced with actual user creation in future
        p_restaurant_name: data.restaurantName,
        p_restaurant_slug: data.slug,
        p_timezone: data.timezone,
        p_currency: 'USD'
      })

      if (error) throw error

      // TODO: Create additional data (business hours, party size config, subscription, etc.)
      // This will be implemented with proper edge functions in the future

      toast({
        title: "Success!",
        description: `${data.restaurantName} has been successfully created!`,
      })

      // Navigate back to tenants list
      navigate('/admin/tenants')
    } catch (error) {
      console.error('Provisioning error:', error)
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