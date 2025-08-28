export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          employee_id: string
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          employee_id: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          employee_id?: string
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          tenant_id: string
          user_agent: string | null
          user_session: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          tenant_id: string
          user_agent?: string | null
          user_session?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          tenant_id?: string
          user_agent?: string | null
          user_session?: string | null
        }
        Relationships: []
      }
      auto_provisioning: {
        Row: {
          completed_at: string | null
          created_at: string
          currency: string
          error_message: string | null
          id: string
          restaurant_name: string
          restaurant_slug: string
          status: string
          tenant_id: string | null
          timezone: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          restaurant_name: string
          restaurant_slug: string
          status?: string
          tenant_id?: string | null
          timezone?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          restaurant_name?: string
          restaurant_slug?: string
          status?: string
          tenant_id?: string | null
          timezone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_provisioning_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_holds: {
        Row: {
          booking_time: string
          created_at: string
          duration_minutes: number
          expires_at: string
          id: string
          party_size: number
          session_id: string
          table_id: string | null
          tenant_id: string
        }
        Insert: {
          booking_time: string
          created_at?: string
          duration_minutes?: number
          expires_at: string
          id?: string
          party_size: number
          session_id: string
          table_id?: string | null
          tenant_id: string
        }
        Update: {
          booking_time?: string
          created_at?: string
          duration_minutes?: number
          expires_at?: string
          id?: string
          party_size?: number
          session_id?: string
          table_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_holds_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_holds_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_time: string
          created_at: string
          deposit_amount: number | null
          deposit_paid: boolean
          deposit_required: boolean
          duration_minutes: number
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          party_size: number
          special_requests: string | null
          status: string
          table_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          booking_time: string
          created_at?: string
          deposit_amount?: number | null
          deposit_paid?: boolean
          deposit_required?: boolean
          duration_minutes?: number
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          party_size: number
          special_requests?: string | null
          status?: string
          table_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          booking_time?: string
          created_at?: string
          deposit_amount?: number | null
          deposit_paid?: boolean
          deposit_required?: boolean
          duration_minutes?: number
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          party_size?: number
          special_requests?: string | null
          status?: string
          table_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_time: string | null
          created_at: string
          day_of_week: number
          id: string
          is_open: boolean
          open_time: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          close_time?: string | null
          created_at?: string
          day_of_week: number
          id?: string
          is_open?: boolean
          open_time?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          close_time?: string | null
          created_at?: string
          day_of_week?: number
          id?: string
          is_open?: boolean
          open_time?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      cuisine_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          parent_department_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string
          domain: string
          domain_type: string
          id: string
          ssl_status: string
          status: string
          tenant_id: string
          updated_at: string
          verification_record: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          domain_type: string
          id?: string
          ssl_status?: string
          status?: string
          tenant_id: string
          updated_at?: string
          verification_record?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          domain_type?: string
          id?: string
          ssl_status?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          verification_record?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          department_id: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by: string
          role: Database["public"]["Enums"]["employee_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_token: string
          invited_by: string
          role: Database["public"]["Enums"]["employee_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["employee_role"]
        }
        Relationships: [
          {
            foreignKeyName: "employee_invitations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department_id: string | null
          employee_id: string
          hire_date: string | null
          id: string
          last_activity: string | null
          last_login: string | null
          manager_id: string | null
          metadata: Json
          permissions: Json
          role: Database["public"]["Enums"]["employee_role"]
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          employee_id: string
          hire_date?: string | null
          id?: string
          last_activity?: string | null
          last_login?: string | null
          manager_id?: string | null
          metadata?: Json
          permissions?: Json
          role?: Database["public"]["Enums"]["employee_role"]
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          employee_id?: string
          hire_date?: string | null
          id?: string
          last_activity?: string | null
          last_login?: string | null
          manager_id?: string | null
          metadata?: Json
          permissions?: Json
          role?: Database["public"]["Enums"]["employee_role"]
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      event_outbox: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          max_retries: number
          payload: Json
          processed_at: string | null
          retry_count: number
          scheduled_at: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          max_retries?: number
          payload: Json
          processed_at?: string | null
          retry_count?: number
          scheduled_at?: string
          status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          max_retries?: number
          payload?: Json
          processed_at?: string | null
          retry_count?: number
          scheduled_at?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_outbox_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      party_size_configs: {
        Row: {
          allow_large_parties: boolean
          created_at: string
          default_party_size: number
          id: string
          large_party_threshold: number
          max_party_size: number
          min_party_size: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          allow_large_parties?: boolean
          created_at?: string
          default_party_size?: number
          id?: string
          large_party_threshold?: number
          max_party_size?: number
          min_party_size?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          allow_large_parties?: boolean
          created_at?: string
          default_party_size?: number
          id?: string
          large_party_threshold?: number
          max_party_size?: number
          min_party_size?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          max_bookings_per_month: number | null
          max_staff_accounts: number | null
          max_tables: number | null
          monthly_price: number
          name: string
          slug: string
          stripe_price_id: string | null
          stripe_yearly_price_id: string | null
          updated_at: string
          yearly_price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bookings_per_month?: number | null
          max_staff_accounts?: number | null
          max_tables?: number | null
          monthly_price: number
          name: string
          slug: string
          stripe_price_id?: string | null
          stripe_yearly_price_id?: string | null
          updated_at?: string
          yearly_price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          max_bookings_per_month?: number | null
          max_staff_accounts?: number | null
          max_tables?: number | null
          monthly_price?: number
          name?: string
          slug?: string
          stripe_price_id?: string | null
          stripe_yearly_price_id?: string | null
          updated_at?: string
          yearly_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      provisioning_runs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          idempotency_key: string
          request_data: Json
          result_data: Json | null
          status: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key: string
          request_data: Json
          result_data?: Json | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string
          request_data?: Json
          result_data?: Json | null
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisioning_runs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      provisioning_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          run_id: string
          started_at: string | null
          status: string
          step_data: Json | null
          step_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          run_id: string
          started_at?: string | null
          status?: string
          step_data?: Json | null
          step_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          run_id?: string
          started_at?: string | null
          status?: string
          step_data?: Json | null
          step_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisioning_steps_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "provisioning_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          active: boolean
          capacity: number
          created_at: string
          id: string
          name: string
          position_x: number | null
          position_y: number | null
          table_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          capacity: number
          created_at?: string
          id?: string
          name: string
          position_x?: number | null
          position_y?: number | null
          table_type?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          position_x?: number | null
          position_y?: number | null
          table_type?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_features: {
        Row: {
          created_at: string
          enabled: boolean
          feature_key: string
          id: string
          source: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_key: string
          id?: string
          source?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_key?: string
          id?: string
          source?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_features_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          address: Json | null
          cover_image_url: string | null
          created_at: string
          cuisine_type_id: string | null
          currency: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          slug: string
          status: string
          timezone: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          cover_image_url?: string | null
          created_at?: string
          cuisine_type_id?: string | null
          currency?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          slug: string
          status?: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          cover_image_url?: string | null
          created_at?: string
          cuisine_type_id?: string | null
          currency?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string
          status?: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_cuisine_type_id_fkey"
            columns: ["cuisine_type_id"]
            isOneToOne: false
            referencedRelation: "cuisine_types"
            referencedColumns: ["id"]
          },
        ]
      }
      widget_configs: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          is_active: boolean
          tenant_id: string
          updated_at: string
          widget_type: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          tenant_id: string
          updated_at?: string
          widget_type?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          tenant_id?: string
          updated_at?: string
          widget_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_employee: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_tenant: {
        Args: { p_user_id: string }
        Returns: {
          provisioning_status: string
          tenant_id: string
          tenant_name: string
          tenant_slug: string
          tenant_status: string
        }[]
      }
      has_employee_role: {
        Args: { required_role: Database["public"]["Enums"]["employee_role"] }
        Returns: boolean
      }
      log_employee_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: undefined
      }
      provision_tenant: {
        Args:
          | {
              p_address?: Json
              p_cuisine_type_id?: string
              p_currency?: string
              p_description?: string
              p_email?: string
              p_phone?: string
              p_restaurant_name: string
              p_restaurant_slug: string
              p_timezone?: string
              p_user_id: string
              p_website?: string
            }
          | {
              p_currency?: string
              p_restaurant_name: string
              p_restaurant_slug: string
              p_timezone?: string
              p_user_id: string
            }
        Returns: string
      }
      user_has_tenant_access: {
        Args: { target_tenant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      employee_role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "OPS" | "VIEWER"
      employee_status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employee_role: ["SUPER_ADMIN", "ADMIN", "SUPPORT", "OPS", "VIEWER"],
      employee_status: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
    },
  },
} as const
