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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_security: {
        Row: {
          account_locked: boolean | null
          backup_codes_generated: boolean | null
          created_at: string
          email_encryption_version: number | null
          encrypted_email: string | null
          encrypted_recovery_email: string | null
          failed_login_attempts: number | null
          id: string
          last_failed_login: string | null
          last_suspicious_activity: string | null
          lock_reason: string | null
          locked_until: string | null
          password_changed_at: string | null
          password_strength_score: number | null
          requires_password_change: boolean | null
          security_questions: Json | null
          suspicious_activity_count: number | null
          trusted_devices: Json | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_locked?: boolean | null
          backup_codes_generated?: boolean | null
          created_at?: string
          email_encryption_version?: number | null
          encrypted_email?: string | null
          encrypted_recovery_email?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_failed_login?: string | null
          last_suspicious_activity?: string | null
          lock_reason?: string | null
          locked_until?: string | null
          password_changed_at?: string | null
          password_strength_score?: number | null
          requires_password_change?: boolean | null
          security_questions?: Json | null
          suspicious_activity_count?: number | null
          trusted_devices?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_locked?: boolean | null
          backup_codes_generated?: boolean | null
          created_at?: string
          email_encryption_version?: number | null
          encrypted_email?: string | null
          encrypted_recovery_email?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_failed_login?: string | null
          last_suspicious_activity?: string | null
          lock_reason?: string | null
          locked_until?: string | null
          password_changed_at?: string | null
          password_strength_score?: number | null
          requires_password_change?: boolean | null
          security_questions?: Json | null
          suspicious_activity_count?: number | null
          trusted_devices?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
          encrypted_api_credentials: string | null
          encryption_version: number | null
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
          encrypted_api_credentials?: string | null
          encryption_version?: number | null
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
          encrypted_api_credentials?: string | null
          encryption_version?: number | null
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
      api_key_access_log: {
        Row: {
          access_time: string
          api_key_id: string | null
          endpoint: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          rate_limited: boolean | null
          request_size_bytes: number | null
          response_time_ms: number | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_time?: string
          api_key_id?: string | null
          endpoint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          rate_limited?: boolean | null
          request_size_bytes?: number | null
          response_time_ms?: number | null
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_time?: string
          api_key_id?: string | null
          endpoint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          rate_limited?: boolean | null
          request_size_bytes?: number | null
          response_time_ms?: number | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_access_log_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          access_count: number | null
          allowed_ips: string[] | null
          created_at: string | null
          expires_at: string | null
          failed_attempts: number | null
          id: string
          is_active: boolean | null
          is_locked: boolean | null
          key_hash: string
          key_name: string
          last_access_ip: unknown | null
          last_failed_attempt: string | null
          last_used_at: string | null
          lock_reason: string | null
          max_uses: number | null
          permissions: Json | null
          rate_limit: number | null
          rate_window_minutes: number | null
          rotation_required: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_count?: number | null
          allowed_ips?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          failed_attempts?: number | null
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          key_hash: string
          key_name: string
          last_access_ip?: unknown | null
          last_failed_attempt?: string | null
          last_used_at?: string | null
          lock_reason?: string | null
          max_uses?: number | null
          permissions?: Json | null
          rate_limit?: number | null
          rate_window_minutes?: number | null
          rotation_required?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_count?: number | null
          allowed_ips?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          failed_attempts?: number | null
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          key_hash?: string
          key_name?: string
          last_access_ip?: unknown | null
          last_failed_attempt?: string | null
          last_used_at?: string | null
          lock_reason?: string | null
          max_uses?: number | null
          permissions?: Json | null
          rate_limit?: number | null
          rate_window_minutes?: number | null
          rotation_required?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      auth_security_log: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          email: string | null
          event_type: string
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          location_data: Json | null
          metadata: Json | null
          risk_score: number | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          email?: string | null
          event_type: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          metadata?: Json | null
          risk_score?: number | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          email?: string | null
          event_type?: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          location_data?: Json | null
          metadata?: Json | null
          risk_score?: number | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      carbon_credit_transactions: {
        Row: {
          amount: number
          blockchain_tx_hash: string | null
          created_at: string
          credit_id: string
          from_user_id: string | null
          id: string
          price_per_credit: number | null
          status: string
          to_user_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          blockchain_tx_hash?: string | null
          created_at?: string
          credit_id: string
          from_user_id?: string | null
          id?: string
          price_per_credit?: number | null
          status?: string
          to_user_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          blockchain_tx_hash?: string | null
          created_at?: string
          credit_id?: string
          from_user_id?: string | null
          id?: string
          price_per_credit?: number | null
          status?: string
          to_user_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credit_transactions_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "carbon_credits"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credits: {
        Row: {
          blockchain_tx_hash: string | null
          calculation_date: string
          created_at: string
          credits_earned: number
          field_name: string
          field_size_acres: number
          id: string
          metadata: Json | null
          soil_organic_matter: number | null
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          calculation_date?: string
          created_at?: string
          credits_earned: number
          field_name: string
          field_size_acres: number
          id?: string
          metadata?: Json | null
          soil_organic_matter?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          calculation_date?: string
          created_at?: string
          credits_earned?: number
          field_name?: string
          field_size_acres?: number
          id?: string
          metadata?: Json | null
          soil_organic_matter?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      compliance_audit_log: {
        Row: {
          actual_completion_date: string | null
          compliance_domain: string
          control_objective: string
          corrective_actions: string[] | null
          created_at: string
          evidence_collected: Json | null
          finding_status: string
          id: string
          responsible_party: string | null
          risk_level: string | null
          target_completion_date: string | null
          test_procedure: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          compliance_domain: string
          control_objective: string
          corrective_actions?: string[] | null
          created_at?: string
          evidence_collected?: Json | null
          finding_status?: string
          id?: string
          responsible_party?: string | null
          risk_level?: string | null
          target_completion_date?: string | null
          test_procedure?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          compliance_domain?: string
          control_objective?: string
          corrective_actions?: string[] | null
          created_at?: string
          evidence_collected?: Json | null
          finding_status?: string
          id?: string
          responsible_party?: string | null
          risk_level?: string | null
          target_completion_date?: string | null
          test_procedure?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      comprehensive_audit_log: {
        Row: {
          changed_fields: string[] | null
          compliance_tags: string[] | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          operation: string
          record_id: string | null
          retention_period: unknown | null
          risk_level: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          changed_fields?: string[] | null
          compliance_tags?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          record_id?: string | null
          retention_period?: unknown | null
          risk_level?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          changed_fields?: string[] | null
          compliance_tags?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          record_id?: string | null
          retention_period?: unknown | null
          risk_level?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cost_alerts: {
        Row: {
          alert_frequency: string
          alert_name: string
          created_at: string
          current_amount: number
          id: string
          is_active: boolean
          last_triggered_at: string | null
          notification_emails: string[] | null
          service_provider: string | null
          threshold_amount: number
          threshold_percentage: number
          threshold_type: string
          updated_at: string
        }
        Insert: {
          alert_frequency?: string
          alert_name: string
          created_at?: string
          current_amount?: number
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          notification_emails?: string[] | null
          service_provider?: string | null
          threshold_amount: number
          threshold_percentage?: number
          threshold_type: string
          updated_at?: string
        }
        Update: {
          alert_frequency?: string
          alert_name?: string
          created_at?: string
          current_amount?: number
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          notification_emails?: string[] | null
          service_provider?: string | null
          threshold_amount?: number
          threshold_percentage?: number
          threshold_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cost_tracking: {
        Row: {
          cost_usd: number
          created_at: string
          date_bucket: string
          feature_name: string
          hour_bucket: string
          id: string
          request_details: Json | null
          service_provider: string
          service_type: string
          usage_count: number
          user_id: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          date_bucket?: string
          feature_name: string
          hour_bucket?: string
          id?: string
          request_details?: Json | null
          service_provider: string
          service_type: string
          usage_count?: number
          user_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string
          date_bucket?: string
          feature_name?: string
          hour_bucket?: string
          id?: string
          request_details?: Json | null
          service_provider?: string
          service_type?: string
          usage_count?: number
          user_id?: string | null
        }
        Relationships: []
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
      data_classification: {
        Row: {
          access_logging_required: boolean | null
          approval_required_for_access: boolean | null
          classification_level: string
          compliance_requirements: string[] | null
          created_at: string
          data_retention_days: number | null
          encryption_required: boolean | null
          id: string
          table_name: string
          updated_at: string
        }
        Insert: {
          access_logging_required?: boolean | null
          approval_required_for_access?: boolean | null
          classification_level: string
          compliance_requirements?: string[] | null
          created_at?: string
          data_retention_days?: number | null
          encryption_required?: boolean | null
          id?: string
          table_name: string
          updated_at?: string
        }
        Update: {
          access_logging_required?: boolean | null
          approval_required_for_access?: boolean | null
          classification_level?: string
          compliance_requirements?: string[] | null
          created_at?: string
          data_retention_days?: number | null
          encryption_required?: boolean | null
          id?: string
          table_name?: string
          updated_at?: string
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
      fields: {
        Row: {
          area_acres: number | null
          boundary_coordinates: Json
          created_at: string
          crop_type: string | null
          description: string | null
          harvest_date: string | null
          id: string
          name: string
          planting_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_acres?: number | null
          boundary_coordinates: Json
          created_at?: string
          crop_type?: string | null
          description?: string | null
          harvest_date?: string | null
          id?: string
          name: string
          planting_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_acres?: number | null
          boundary_coordinates?: Json
          created_at?: string
          crop_type?: string | null
          description?: string | null
          harvest_date?: string | null
          id?: string
          name?: string
          planting_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          subscription_ends_at: string | null
          subscription_starts_at: string | null
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
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
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
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_end?: string | null
          window_start?: string | null
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
      security_incidents: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          incident_details: Json | null
          incident_type: string
          request_payload: Json | null
          resolved_at: string | null
          response_status: number | null
          severity: string
          source_ip: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          incident_details?: Json | null
          incident_type: string
          request_payload?: Json | null
          resolved_at?: string | null
          response_status?: number | null
          severity: string
          source_ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          incident_details?: Json | null
          incident_type?: string
          request_payload?: Json | null
          resolved_at?: string | null
          response_status?: number | null
          severity?: string
          source_ip?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_monitoring: {
        Row: {
          auto_blocked: boolean | null
          created_at: string
          detection_rules: Json | null
          id: string
          investigation_status: string | null
          mitigation_actions: Json | null
          monitoring_type: string
          target_ip: unknown | null
          target_resource: string | null
          target_user_id: string | null
          threat_level: string
          updated_at: string
        }
        Insert: {
          auto_blocked?: boolean | null
          created_at?: string
          detection_rules?: Json | null
          id?: string
          investigation_status?: string | null
          mitigation_actions?: Json | null
          monitoring_type: string
          target_ip?: unknown | null
          target_resource?: string | null
          target_user_id?: string | null
          threat_level: string
          updated_at?: string
        }
        Update: {
          auto_blocked?: boolean | null
          created_at?: string
          detection_rules?: Json | null
          id?: string
          investigation_status?: string | null
          mitigation_actions?: Json | null
          monitoring_type?: string
          target_ip?: unknown | null
          target_resource?: string | null
          target_user_id?: string | null
          threat_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      soc2_compliance_checks: {
        Row: {
          check_name: string
          check_type: string
          compliance_score: number | null
          created_at: string
          details: Json | null
          id: string
          last_checked_at: string
          next_check_at: string | null
          remediation_actions: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          check_name: string
          check_type: string
          compliance_score?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          last_checked_at?: string
          next_check_at?: string | null
          remediation_actions?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_name?: string
          check_type?: string
          compliance_score?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          last_checked_at?: string
          next_check_at?: string | null
          remediation_actions?: string[] | null
          status?: string
          updated_at?: string
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
          encrypted_email: string | null
          encrypted_stripe_customer_id: string | null
          encryption_version: number | null
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
          encrypted_email?: string | null
          encrypted_stripe_customer_id?: string | null
          encryption_version?: number | null
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
          encrypted_email?: string | null
          encrypted_stripe_customer_id?: string | null
          encryption_version?: number | null
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
      usage_analytics: {
        Row: {
          action_type: string
          created_at: string
          date_bucket: string
          duration_seconds: number | null
          error_details: Json | null
          feature_name: string
          hour_bucket: string
          id: string
          metadata: Json | null
          session_id: string
          subscription_tier: string
          success_rate: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          date_bucket?: string
          duration_seconds?: number | null
          error_details?: Json | null
          feature_name: string
          hour_bucket?: string
          id?: string
          metadata?: Json | null
          session_id: string
          subscription_tier: string
          success_rate?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          date_bucket?: string
          duration_seconds?: number | null
          error_details?: Json | null
          feature_name?: string
          hour_bucket?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          subscription_tier?: string
          success_rate?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      usage_quotas: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          monthly_limit: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          monthly_limit: number
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          monthly_limit?: number
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          month_year: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          month_year?: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          month_year?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      visual_analysis_results: {
        Row: {
          analysis_result: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string
          crop_type: string | null
          id: string
          image_data: string | null
          location_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result: Json
          analysis_type: string
          confidence_score?: number | null
          created_at?: string
          crop_type?: string | null
          id?: string
          image_data?: string | null
          location_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          crop_type?: string | null
          id?: string
          image_data?: string | null
          location_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      cost_summary: {
        Row: {
          avg_cost_per_request: number | null
          date_bucket: string | null
          service_provider: string | null
          service_type: string | null
          total_cost: number | null
          total_usage: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      subscribers_security_view: {
        Row: {
          created_at: string | null
          encryption_version: number | null
          id: string | null
          masked_email: string | null
          masked_stripe_id: string | null
          subscribed: boolean | null
          subscription_end: string | null
          subscription_interval: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          encryption_version?: number | null
          id?: string | null
          masked_email?: never
          masked_stripe_id?: never
          subscribed?: boolean | null
          subscription_end?: string | null
          subscription_interval?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          encryption_version?: number | null
          id?: string | null
          masked_email?: never
          masked_stripe_id?: never
          subscribed?: boolean | null
          subscription_end?: string | null
          subscription_interval?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      usage_summary: {
        Row: {
          action_type: string | null
          avg_duration: number | null
          avg_success_rate: number | null
          date_bucket: string | null
          event_count: number | null
          feature_name: string | null
          subscription_tier: string | null
          unique_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_use_feature: {
        Args: { p_feature_name: string; p_user_id: string }
        Returns: boolean
      }
      check_cost_alerts: {
        Args: Record<PropertyKey, never>
        Returns: {
          alert_id: string
          alert_name: string
          current_amount: number
          percentage_used: number
          threshold_amount: number
        }[]
      }
      check_password_strength: {
        Args: { password_text: string }
        Returns: number
      }
      check_payment_data_security_compliance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_rls_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          anonymous_policies_count: number
          compliance_status: string
          risk_level: string
          rls_enabled: boolean
          table_name: string
        }[]
      }
      check_subscriber_security_compliance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_rate_limit_tracking: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrypt_email_address: {
        Args: { encrypted_email: string }
        Returns: string
      }
      decrypt_sensitive_payment_data: {
        Args: { encrypted_data: string }
        Returns: string
      }
      encrypt_email_address: {
        Args: { email_to_encrypt: string }
        Returns: string
      }
      encrypt_existing_sensitive_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      encrypt_sensitive_payment_data: {
        Args: { data_to_encrypt: string }
        Returns: string
      }
      generate_soc2_compliance_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_cost_summary: {
        Args: {
          p_end_date?: string
          p_service_provider?: string
          p_start_date?: string
        }
        Returns: {
          avg_cost_per_request: number
          date_bucket: string
          service_provider: string
          service_type: string
          total_cost: number
          total_usage: number
          unique_users: number
        }[]
      }
      get_decrypted_stripe_customer_id: {
        Args: { subscriber_id: string }
        Returns: string
      }
      get_masked_subscription_data: {
        Args: { target_user_id?: string }
        Returns: {
          created_at: string
          encryption_version: number
          id: string
          masked_email: string
          masked_stripe_id: string
          subscribed: boolean
          subscription_end: string
          subscription_interval: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }[]
      }
      get_secure_account_security_info: {
        Args: { target_user_id?: string }
        Returns: {
          account_locked: boolean
          backup_codes_generated: boolean
          created_at: string
          email_encryption_version: number
          failed_login_attempts: number
          id: string
          last_suspicious_activity: string
          lock_reason: string
          locked_until: string
          masked_email: string
          masked_recovery_email: string
          password_changed_at: string
          password_strength_score: number
          requires_password_change: boolean
          suspicious_activity_count: number
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
        }[]
      }
      get_usage_summary: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_subscription_tier?: string
        }
        Returns: {
          action_type: string
          avg_duration: number
          avg_success_rate: number
          date_bucket: string
          event_count: number
          feature_name: string
          subscription_tier: string
          unique_users: number
        }[]
      }
      get_user_email_for_security: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_email_secure: {
        Args: { target_user_id?: string }
        Returns: string
      }
      get_user_email_secure_only: {
        Args: { target_user_id?: string }
        Returns: string
      }
      get_user_email_securely: {
        Args: { target_user_id?: string }
        Returns: string
      }
      handle_login_attempt: {
        Args: {
          attempt_success: boolean
          client_ip?: unknown
          failure_reason_text?: string
          user_agent_string?: string
          user_email: string
        }
        Returns: Json
      }
      increment_usage: {
        Args: {
          p_feature_name: string
          p_increment?: number
          p_user_id: string
        }
        Returns: boolean
      }
      is_account_locked: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      migrate_account_security_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      migrate_subscriber_data_to_encrypted: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      refresh_cost_summaries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      rotate_api_key: {
        Args: { new_key_hash: string; old_key_id: string }
        Returns: string
      }
      sanitize_email_for_audit: {
        Args: { email_address: string }
        Returns: string
      }
      secure_get_subscriber_data: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string
          subscribed: boolean
          subscription_end: string
          subscription_interval: string
          subscription_tier: string
          updated_at: string
          user_id: string
        }[]
      }
      secure_upsert_subscriber: {
        Args: {
          p_email: string
          p_stripe_customer_id?: string
          p_subscribed?: boolean
          p_subscription_end?: string
          p_subscription_interval?: string
          p_subscription_tier?: string
          p_user_id: string
        }
        Returns: string
      }
      simple_email_mask: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_api_cost: {
        Args: {
          p_cost_usd: number
          p_feature_name: string
          p_request_details?: Json
          p_service_provider: string
          p_service_type: string
          p_user_id: string
        }
        Returns: string
      }
      track_usage_event: {
        Args: {
          p_action_type: string
          p_duration_seconds?: number
          p_error_details?: Json
          p_feature_name: string
          p_metadata?: Json
          p_session_id: string
          p_subscription_tier: string
          p_success_rate?: number
          p_user_id: string
        }
        Returns: string
      }
      unlock_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      validate_and_sanitize_input: {
        Args: {
          input_value: string
          max_length?: number
          validation_type?: string
        }
        Returns: string
      }
      validate_api_key: {
        Args: { client_ip?: unknown; key_hash: string } | { key_hash: string }
        Returns: {
          is_valid: boolean
          permissions: Json
          rate_limit: number
          rate_window_minutes: number
          user_id: string
        }[]
      }
      validate_service_operation: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_subscription_service_operation: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_tier: "free" | "starter" | "pro" | "enterprise"
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
      app_role: ["admin", "moderator", "user"],
      subscription_tier: ["free", "starter", "pro", "enterprise"],
    },
  },
} as const
