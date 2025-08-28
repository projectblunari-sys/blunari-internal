import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ProvisioningWizard, type ProvisioningData } from '@/components/provisioning/ProvisioningWizard'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function ProvisioningWizardPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleProvisioningComplete = async (data: ProvisioningData) => {
    try {
      // Call the enhanced provision_tenant function with all the new data
      const { data: result, error } = await supabase.rpc('provision_tenant', {
        p_user_id: data.ownerEmail, // Will be replaced with actual user creation
        p_restaurant_name: data.restaurantName,
        p_restaurant_slug: data.slug,
        p_timezone: data.timezone,
        p_currency: 'USD'
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your restaurant has been successfully provisioned!",
      })

      // Navigate to the admin dashboard
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Provisioning error:', error)
      throw error
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <ProvisioningWizard 
      onComplete={handleProvisioningComplete}
      onCancel={handleCancel}
    />
  )
}