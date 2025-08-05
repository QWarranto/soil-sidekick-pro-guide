export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adapt_api_usage: {
        Row: {
          created_at: string
          data_type: string
          endpoint: string
          error_message: string | null
          id: string
          integration_id: string | null
          request_size_kb: number | null
          request_type: string
          response_time_ms: number | null
          subscription_tier: string
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          data_type: string
          endpoint: string
          error_message?: string | null
          id?: string
          integration_id?: string | null
          request_size_kb?: number | null
          request_type: string
          response_time_ms?: number | null
          subscription_tier: string
          success?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          data_type?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          integration_id?: string | null
          request_size_kb?: number | null
          request_type?: string
          response_time_ms?: number | null
          subscription_tier?: string
          success?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adapt_api_usage_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "adapt_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      adapt_field_boundaries: {
        Row: {
          adapt_field_id: string | null
          area_acres: number | null
          boundary_geometry: Json
          created_at: string
          crop_type: string | null
          field_name: string
          field_reference: string | null
          id: string
          integration_id: string | null
          last_updated_external: string | null
          planting_year: number | null
          soil_type: string | null
          sync_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adapt_field_id?: string | null
          area_acres?: number | null
          boundary_geometry: Json
          created_at?: string
          crop_type?: string | null
          field_name: string
          field_reference?: string | null
          id?: string
          integration_id?: string | null
          last_updated_external?: string | null
          planting_year?: number | null
          soil_type?: string | null
          sync_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adapt_field_id?: string | null
          area_acres?: number | null
          boundary_geometry?: Json
          created_at?: string
          crop_type?: string | null
          field_name?: string
          field_reference?: string | null
          id?: string
          integration_id?: string | null
          last_updated_external?: string | null
          planting_year?: number | null
          soil_type?: string | null
          sync_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adapt_field_boundaries_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "adapt_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      adapt_integrations: {
        Row: {
          api_credentials: Json | null
          created_at: string
          id: string
          integration_name: string
          integration_status: string
          integration_type: string
          last_sync_at: string | null
          subscription_tier: string
          sync_frequency: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          integration_name: string
          integration_status?: string
          integration_type: string
          last_sync_at?: string | null
          subscription_tier?: string
          sync_frequency?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          integration_name?: string
          integration_status?: string
          integration_type?: string
          last_sync_at?: string | null
          subscription_tier?: string
          sync_frequency?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      adapt_soil_exports: {
        Row: {
          created_at: string
          export_data: Json
          export_format: string
          export_status: string
          external_reference: string | null
          file_path: string | null
          id: string
          integration_id: string | null
          soil_analysis_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          export_data: Json
          export_format?: string
          export_status?: string
          external_reference?: string | null
          file_path?: string | null
          id?: string
          integration_id?: string | null
          soil_analysis_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          export_data?: Json
          export_format?: string
          export_status?: string
          external_reference?: string | null
          file_path?: string | null
          id?: string
          integration_id?: string | null
          soil_analysis_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adapt_soil_exports_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "adapt_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adapt_soil_exports_soil_analysis_id_fkey"
            columns: ["soil_analysis_id"]
            isOneToOne: false
            referencedRelation: "soil_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          county_name: string
          created_at: string
          fips_code: string
          id: string
          state_code: string
          state_name: string
        }
        Insert: {
          county_name: string
          created_at?: string
          fips_code: string
          id?: string
          state_code: string
          state_name: string
        }
        Update: {
          county_name?: string
          created_at?: string
          fips_code?: string
          id?: string
          state_code?: string
          state_name?: string
        }
        Relationships: []
      }
      county_search_sessions: {
        Row: {
          created_at: string
          database_results: Json | null
          expires_at: string
          external_results: Json | null
          id: string
          search_context: Json
          selected_county: Json | null
          session_token: string
          state_transitions: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          database_results?: Json | null
          expires_at?: string
          external_results?: Json | null
          id?: string
          search_context: Json
          selected_county?: Json | null
          session_token: string
          state_transitions?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          database_results?: Json | null
          expires_at?: string
          external_results?: Json | null
          id?: string
          search_context?: Json
          selected_county?: Json | null
          session_token?: string
          state_transitions?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      environmental_impact_scores: {
        Row: {
          analysis_id: string | null
          biodiversity_impact: string | null
          carbon_footprint_score: number | null
          contamination_risk: string | null
          county_fips: string
          created_at: string
          eco_friendly_alternatives: Json | null
          id: string
          runoff_risk_score: number
          updated_at: string
          user_id: string
          water_body_proximity: number | null
        }
        Insert: {
          analysis_id?: string | null
          biodiversity_impact?: string | null
          carbon_footprint_score?: number | null
          contamination_risk?: string | null
          county_fips: string
          created_at?: string
          eco_friendly_alternatives?: Json | null
          id?: string
          runoff_risk_score: number
          updated_at?: string
          user_id: string
          water_body_proximity?: number | null
        }
        Update: {
          analysis_id?: string | null
          biodiversity_impact?: string | null
          carbon_footprint_score?: number | null
          contamination_risk?: string | null
          county_fips?: string
          created_at?: string
          eco_friendly_alternatives?: Json | null
          id?: string
          runoff_risk_score?: number
          updated_at?: string
          user_id?: string
          water_body_proximity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_impact_scores_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "soil_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      fips_data_cache: {
        Row: {
          access_count: number | null
          cache_key: string
          cache_level: number
          cached_data: Json
          county_fips: string
          created_at: string
          data_source: string
          expires_at: string
          id: string
          last_accessed: string | null
        }
        Insert: {
          access_count?: number | null
          cache_key: string
          cache_level: number
          cached_data: Json
          county_fips: string
          created_at?: string
          data_source: string
          expires_at?: string
          id?: string
          last_accessed?: string | null
        }
        Update: {
          access_count?: number | null
          cache_key?: string
          cache_level?: number
          cached_data?: Json
          county_fips?: string
          created_at?: string
          data_source?: string
          expires_at?: string
          id?: string
          last_accessed?: string | null
        }
        Relationships: []
      }
      geo_consumption_analytics: {
        Row: {
          consumption_frequency: number | null
          county_fips: string
          created_at: string
          geographic_cluster: string | null
          id: string
          month_year: string
          seasonal_pattern: Json | null
          state_code: string
          tier_progression_score: number | null
          updated_at: string
          upgrade_probability: number | null
          usage_pattern: Json
          user_id: string
        }
        Insert: {
          consumption_frequency?: number | null
          county_fips: string
          created_at?: string
          geographic_cluster?: string | null
          id?: string
          month_year?: string
          seasonal_pattern?: Json | null
          state_code: string
          tier_progression_score?: number | null
          updated_at?: string
          upgrade_probability?: number | null
          usage_pattern: Json
          user_id: string
        }
        Update: {
          consumption_frequency?: number | null
          county_fips?: string
          created_at?: string
          geographic_cluster?: string | null
          id?: string
          month_year?: string
          seasonal_pattern?: Json | null
          state_code?: string
          tier_progression_score?: number | null
          updated_at?: string
          upgrade_probability?: number | null
          usage_pattern?: Json
          user_id?: string
        }
        Relationships: []
      }
      planting_optimizations: {
        Row: {
          alternative_crops: Json | null
          climate_factors: Json
          county_fips: string
          created_at: string
          crop_type: string
          id: string
          optimal_planting_window: Json
          risk_assessment: Json | null
          soil_factors: Json
          sustainability_score: number | null
          updated_at: string
          user_id: string
          yield_prediction: number | null
        }
        Insert: {
          alternative_crops?: Json | null
          climate_factors: Json
          county_fips: string
          created_at?: string
          crop_type: string
          id?: string
          optimal_planting_window: Json
          risk_assessment?: Json | null
          soil_factors: Json
          sustainability_score?: number | null
          updated_at?: string
          user_id: string
          yield_prediction?: number | null
        }
        Update: {
          alternative_crops?: Json | null
          climate_factors?: Json
          county_fips?: string
          created_at?: string
          crop_type?: string
          id?: string
          optimal_planting_window?: Json
          risk_assessment?: Json | null
          soil_factors?: Json
          sustainability_score?: number | null
          updated_at?: string
          user_id?: string
          yield_prediction?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      soil_analyses: {
        Row: {
          analysis_data: Json | null
          county_fips: string
          county_name: string
          created_at: string
          id: string
          nitrogen_level: string | null
          organic_matter: number | null
          ph_level: number | null
          phosphorus_level: string | null
          potassium_level: string | null
          recommendations: string | null
          state_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          county_fips: string
          county_name: string
          created_at?: string
          id?: string
          nitrogen_level?: string | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus_level?: string | null
          potassium_level?: string | null
          recommendations?: string | null
          state_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          county_fips?: string
          county_name?: string
          created_at?: string
          id?: string
          nitrogen_level?: string | null
          organic_matter?: number | null
          ph_level?: number | null
          phosphorus_level?: string | null
          potassium_level?: string | null
          recommendations?: string | null
          state_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_interval: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_interval?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_interval?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_usages: {
        Row: {
          action_type: string
          county_fips: string | null
          id: string
          month_year: string
          used_at: string
          user_id: string
        }
        Insert: {
          action_type?: string
          county_fips?: string | null
          id?: string
          month_year?: string
          used_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          county_fips?: string | null
          id?: string
          month_year?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
