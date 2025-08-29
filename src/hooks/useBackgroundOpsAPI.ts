import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface BackgroundJob {
  id: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  payload: Record<string, any>
  priority: number
  progress: number
  error?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

export interface SystemMetrics {
  name: string
  value: number
  unit: string
  metadata?: Record<string, any>
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  services: Record<string, any>
  uptime: number
  version?: string
}

export const useBackgroundOpsAPI = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const callAPI = async (functionName: string, options: any = {}) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke(functionName, options)

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error(`${functionName} API Error:`, error)
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Job Management
  const getJobs = async (): Promise<BackgroundJob[]> => {
    return callAPI('jobs-api', {
      body: { action: 'list' }
    })
  }

  const getJob = async (id: string): Promise<BackgroundJob> => {
    return callAPI('jobs-api', {
      body: { action: 'get', id }
    })
  }

  const createJob = async (jobData: {
    type: string
    payload: Record<string, any>
    priority?: number
  }): Promise<BackgroundJob> => {
    return callAPI('jobs-api', {
      body: { action: 'create', ...jobData }
    })
  }

  const cancelJob = async (id: string): Promise<boolean> => {
    return callAPI('jobs-api', {
      body: { action: 'cancel', id }
    })
  }

  const retryJob = async (id: string): Promise<BackgroundJob> => {
    return callAPI('jobs-api', {
      body: { action: 'retry', id }
    })
  }

  // Health Check
  const getHealthStatus = async (): Promise<HealthStatus> => {
    return callAPI('health-check-api')
  }

  // Metrics
  const getMetrics = async (type: 'system' | 'jobs' | 'database' = 'system'): Promise<{
    metrics: SystemMetrics[]
    timestamp: string
  }> => {
    return callAPI('metrics-api', {
      body: { type }
    })
  }

  // Generic proxy for other endpoints
  const proxyRequest = async (endpoint: string, params: Record<string, any> = {}) => {
    return callAPI('background-ops-proxy', {
      body: { endpoint, ...params }
    })
  }

  return {
    loading,
    
    // Job Management
    getJobs,
    getJob,
    createJob,
    cancelJob,
    retryJob,
    
    // Health & Metrics
    getHealthStatus,
    getMetrics,
    
    // Generic proxy
    proxyRequest,
  }
}