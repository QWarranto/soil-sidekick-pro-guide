/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SoilData {
  /** @format uuid */
  id?: string;
  county_fips?: string;
  county_name?: string;
  state_code?: string;
  /** @format float */
  ph_level?: number;
  /** @format float */
  organic_matter?: number;
  nitrogen_level?: string;
  phosphorus_level?: string;
  potassium_level?: string;
  recommendations?: string;
  analysis_data?: Record<string, any>;
}

export interface County {
  /** @format uuid */
  id?: string;
  county_name?: string;
  state_name?: string;
  state_code?: string;
  fips_code?: string;
}

export interface WaterQuality {
  county_fips?: string;
  /** @format float */
  ph?: number;
  /** @format float */
  dissolved_oxygen?: number;
  /** @format float */
  turbidity?: number;
  /** @format float */
  nitrates?: number;
  /** @format float */
  phosphates?: number;
  contamination_risk?: "low" | "medium" | "high";
}

export interface TerritorialWaterAnalytics {
  success?: boolean;
  analytics?: {
    territorial_coverage?: object;
    water_quality_metrics?: object;
    regional_insights?: object;
    compliance_status?: object;
  };
  /** @format date-time */
  generated_at?: string;
}

export interface PlantingCalendar {
  crop_type?: string;
  optimal_planting_window?: {
    /** @format date */
    start_date?: string;
    /** @format date */
    end_date?: string;
  };
  climate_factors?: object;
  soil_factors?: object;
  recommendations?: string[];
}

export interface LiveAgriculturalData {
  county_fips?: string;
  county_name?: string;
  state_code?: string;
  data?: {
    weather?: object;
    soil?: object;
    crop?: object;
    environmental?: object;
  };
  sources?: string[];
  /** @format date-time */
  timestamp?: string;
  cache_status?: "updated" | "fallback";
}

export interface EnvironmentalImpact {
  impact_assessment?: {
    runoff_risk_score?: number;
    water_body_proximity?: number;
    contamination_risk?: string;
    carbon_footprint_score?: number;
    biodiversity_impact?: string;
  };
  detailed_analysis?: {
    runoff_risk?: {
      score?: number;
      risk_level?: "low" | "medium" | "high";
      contributing_factors?: object;
    };
    contamination_assessment?: object;
    eco_alternatives?: {
      alternatives?: {
        category?: string;
        alternative?: string;
        description?: string;
        environmental_benefit?: string;
        effectiveness_score?: number;
      }[];
    };
    carbon_analysis?: object;
    biodiversity_assessment?: object;
  };
  recommendations?: string[];
}

export interface SatelliteData {
  /**
   * Normalized Difference Vegetation Index
   * @format float
   */
  ndvi?: number;
  /**
   * Enhanced Vegetation Index
   * @format float
   */
  evi?: number;
  /** @format float */
  soil_moisture?: number;
  /** @format float */
  temperature?: number;
  /** @format float */
  cloud_cover?: number;
}

export interface AIAnalysis {
  analysis_type?: string;
  /** @format float */
  confidence_score?: number;
  recommendations?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }[];
}

export interface SeasonalPlanningResponse {
  success?: boolean;
  recommendations?: {
    seasonal_tasks?: object[];
    crop_recommendations?: string[];
    timing_guidance?: object;
  };
  weatherData?: {
    currentSeason?: string;
    temperature?: string;
    rainfall?: string;
    frostDates?: object;
    growingSeason?: string;
    zone?: string;
  };
  modelUsed?: string;
}

export interface SmartReportSummary {
  success?: boolean;
  summary?: {
    executive_summary?: string;
    key_findings?: string[];
    recommendations?: string[];
    risk_assessment?: string;
  };
  modelUsed?: string;
}

export interface CarbonCreditCalculation {
  success?: boolean;
  credit_record?: {
    /** @format uuid */
    id?: string;
    field_name?: string;
    field_size_acres?: number;
    credits_earned?: number;
    verification_status?: "pending" | "verified";
  };
  calculation_details?: {
    credits_earned?: number;
    calculation_method?: string;
    baseline_carbon?: number;
    enhanced_carbon?: number;
    verification_confidence?: number;
    metadata?: {
      calculation_factors?: object;
      data_sources?: string[];
      confidence_score?: number;
    };
  };
}

export interface VRTPrescription {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  field_id?: string;
  application_type?: string;
  zones?: {
    zone_id?: number;
    application_rate?: number;
    geometry?: object;
  }[];
}

export interface LeafEnginesCompatibility {
  success?: boolean;
  data?: {
    /** Overall compatibility score (0-100) */
    overall_score?: number;
    soil_compatibility?: number;
    water_compatibility?: number;
    climate_compatibility?: number;
    breakdown?: {
      soil?: {
        score?: number;
        factors?: string[];
        concerns?: string[];
      };
      water?: object;
      climate?: object;
    };
    recommendations?: string[];
    risk_level?: "low" | "medium" | "high";
    metadata?: {
      location?: string;
      /** @format date-time */
      timestamp?: string;
      data_sources?: string[];
    };
  };
  usage?: {
    credits_used?: number;
    response_time_ms?: number;
  };
}

export interface VisualCropAnalysis {
  success?: boolean;
  analysis?: {
    analysis_type?: string;
    confidence?: number;
    findings?: object;
    recommendations?: string[];
    severity?: "low" | "medium" | "high";
  };
  /** @format uuid */
  analysis_id?: string;
  /** @format date-time */
  timestamp?: string;
}

/** Safe plant identification response with toxic lookalike analysis */
export interface SafeIdentification {
  success?: boolean;
  identification?: {
    primary_match?: {
      common_name?: string;
      scientific_name?: string;
      /** Confidence percentage (0-100) */
      confidence?: number;
      family?: string;
    };
    /** Likelihood this plant exists in the given environment */
    environmental_probability?: number;
    growth_stage_detected?:
      | "seedling"
      | "juvenile"
      | "mature"
      | "flowering"
      | "fruiting";
  };
  safety_analysis?: {
    toxicity_level?: "safe" | "mildly_toxic" | "toxic" | "highly_toxic";
    /** List of animals/people this is toxic to (e.g., cats, dogs, children) */
    toxic_to?: string[];
    lookalikes?: {
      plant_name?: string;
      /** Visual similarity score (0-100) */
      visual_similarity?: number;
      toxicity_level?: string;
      distinguishing_features?: string[];
    }[];
    warnings?: string[];
  };
  confidence_breakdown?: {
    visual_match?: number;
    environmental_context?: number;
    regional_prevalence?: number;
    growth_stage_alignment?: number;
  };
  metadata?: {
    /** @format uuid */
    analysis_id?: string;
    /** @format date-time */
    timestamp?: string;
    environmental_data_used?: string[];
  };
}

/** Dynamic, environment-aware plant care recommendations */
export interface DynamicCare {
  success?: boolean;
  plant?: {
    common_name?: string;
    scientific_name?: string;
    care_difficulty?: "easy" | "moderate" | "challenging";
  };
  current_conditions?: {
    temperature_f?: number;
    humidity_percent?: number;
    recent_rainfall_inches?: number;
    season?: string;
    days_since_watered?: number;
  };
  care_recommendations?: {
    watering?: {
      action?: "water_now" | "wait" | "check_soil" | "reduce_frequency";
      reasoning?: string;
      next_check_days?: number;
      amount_guidance?: string;
    };
    light?: {
      current_assessment?: string;
      adjustment_needed?: boolean;
      recommendation?: string;
    };
    humidity?: {
      current_level?: string;
      ideal_range?: string;
      adjustment_recommendation?: string;
    };
    /** Season-specific care adjustments */
    seasonal_notes?: string;
  };
  /** Any urgent care warnings */
  warnings?: string[];
  metadata?: {
    location_data_used?: boolean;
    weather_data_freshness?: string;
    confidence?: number;
  };
}

/** Beginner-friendly plant guidance response */
export interface BeginnerGuidance {
  success?: boolean;
  /** Plain-language answer without jargon, 1-2 sentences */
  simple_answer?: string;
  /** Immediate actionable step */
  what_to_do_now?: string;
  /** Simple explanation of the cause */
  why_this_happens?: string;
  /** More details for users who want to learn */
  detailed_explanation?: {
    technical_term?: string;
    plain_english?: string;
    common_causes?: string[];
    prevention_tips?: string[];
  };
  /** Supportive message for the user */
  encouragement?: string;
  /** Common follow-up questions */
  related_questions?: string[];
  /** Confidence in the guidance (0-100) */
  confidence?: number;
  metadata?: {
    expertise_level_used?: string;
    plant_identified?: boolean;
    environmental_context?: boolean;
  };
}

export interface TurboQuantCapabilities {
  /** Whether TurboQuant is supported on this device */
  supported?: boolean;
  /** Recommended model for the device */
  recommended_model?: "gemma-2b" | "gemma-7b" | "gemma-7b-tq";
  /**
   * Maximum context window feasible on this device
   * @example 24576
   */
  max_context_tokens?: number;
  /**
   * Estimated KV cache size in GB
   * @example 1.3
   */
  estimated_kv_cache_gb?: number;
  /**
   * Compression ratio vs 16-bit baseline
   * @example "5.3x"
   */
  kv_compression_ratio?: string;
  estimated_latency_ms?: {
    /** @example 180 */
    first_token?: number;
    /** @example 12 */
    per_token?: number;
  };
  /** Detected or recommended runtime */
  runtime_tier?: "webgpu" | "wasm_tq" | "wasm_standard" | "cloud_fallback";
}

export interface ManagedAsset {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  user_id?: string;
  name?: string;
  asset_type?: string;
  species?: string;
  common_name?: string;
  latitude?: number;
  longitude?: number;
  /** GeoJSON geometry object */
  geometry?: object;
  dbh_inches?: number;
  height_feet?: number;
  canopy_spread_feet?: number;
  condition_rating?: string;
  risk_rating?: string;
  maintenance_priority?: string;
  notes?: string;
  custom_fields?: object;
  sync_source?: string;
  external_id?: string;
  sync_status?: string;
  /** @format date-time */
  last_synced_at?: string;
  is_deleted?: boolean;
  is_public?: boolean;
  version?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface ManagedAssetInput {
  name: string;
  asset_type?: string;
  species?: string;
  common_name?: string;
  latitude?: number;
  longitude?: number;
  geometry?: object;
  dbh_inches?: number;
  height_feet?: number;
  canopy_spread_feet?: number;
  condition_rating?: string;
  risk_rating?: string;
  maintenance_priority?: string;
  notes?: string;
  custom_fields?: object;
  sync_source?: string;
  external_id?: string;
}

export interface FeatureCollection {
  type?: "FeatureCollection";
  features?: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type?: "Feature";
  id?: string;
  geometry?: object;
  properties?: object;
}

export interface Error {
  error?: string;
  message?: string;
  code?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string =
    "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title SoilSidekick Pro API
 * @version 1.2.0
 * @license Commercial License (https://soilsidekick.com/license)
 * @baseUrl https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1
 * @contact SoilSidekick Support <support@soilsidekickpro.com> (https://soilsidekick.com/support)
 *
 * Agricultural intelligence and soil analysis API with tier-based access control.
 *
 * ## What's New in 1.2.0
 * - **Consumer Plant Care APIs**: Three new endpoints addressing top pain points in plant ID apps:
 *   - `/safe-identification`: Toxic lookalike warnings and environmental context
 *   - `/dynamic-care`: Hyper-localized, real-time care recommendations
 *   - `/beginner-guidance`: Judgment-free, jargon-free plant guidance
 *
 * ## Authentication
 * All endpoints require an API key passed via the `x-api-key` header:
 * ```
 * x-api-key: ak_your_api_key_here
 * ```
 *
 * API keys are generated through the dashboard and use the `ak_*` format.
 *
 * ## Rate Limiting
 * Rate limits are enforced based on your subscription tier:
 * - **Free**: 10 req/min, 100 req/hour, 1,000 req/day
 * - **Starter**: 30 req/min, 500 req/hour, 5,000 req/day
 * - **Pro**: 100 req/min, 2,000 req/hour, 25,000 req/day
 * - **Enterprise**: 500 req/min, 10,000 req/hour, 100,000 req/day
 *
 * Rate limit information is returned in response headers:
 * - `X-RateLimit-Limit`: Maximum requests in window
 * - `X-RateLimit-Remaining`: Remaining requests in window
 * - `X-RateLimit-Reset`: Unix timestamp when limit resets
 *
 * ## Response Time SLAs
 * All endpoints return response time headers for performance monitoring:
 * - `X-Response-Time`: Human-readable response time (e.g., "245ms")
 * - `X-Response-Time-Ms`: Response time in milliseconds
 * - `X-Response-Time-Target`: Target response time for this endpoint
 * - `X-Response-Time-Max`: Maximum acceptable response time
 * - `X-Response-Time-Status`: Performance status (`optimal`, `acceptable`, `exceeded`)
 *
 * ### Response Time Targets by Category
 *
 * | Category | Target | Maximum | Endpoints |
 * |----------|--------|---------|-----------|
 * | **Fast** | 200ms | 500ms | county-lookup, check-subscription |
 * | **Standard** | 500ms | 1,500ms | get-soil-data, territorial-water-quality |
 * | **Complex** | 2,000ms | 5,000ms | agricultural-intelligence, gpt5-chat, visual-crop-analysis |
 * | **Heavy** | 5,000ms | 15,000ms | live-agricultural-data, generate-vrt-prescription |
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  turboQuantCapabilities = {
    /**
     * @description Returns hardware-specific model recommendations and estimated performance based on detected device capabilities. Use this to determine the optimal local inference configuration for the end-user's device. **Tier requirement:** Pro or Enterprise
     *
     * @tags TurboQuant
     * @name TurboQuantCapabilities
     * @summary Query TurboQuant device capabilities
     * @request POST:/turbo-quant-capabilities
     * @secure
     */
    turboQuantCapabilities: (
      data: {
        /**
         * Device RAM in GB
         * @example 4
         */
        device_memory_gb?: number;
        /**
         * Whether WebGPU is available
         * @example true
         */
        has_webgpu?: boolean;
        /** @example "mobile" */
        platform?: "mobile" | "tablet" | "desktop" | "server";
      },
      params: RequestParams = {},
    ) =>
      this.request<TurboQuantCapabilities, Error>({
        path: `/turbo-quant-capabilities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  getSoilData = {
    /**
     * @description Retrieve comprehensive soil analysis for a specific county
     *
     * @tags Soil Analysis
     * @name GetSoilData
     * @summary Get soil analysis data
     * @request POST:/get-soil-data
     * @secure
     */
    getSoilData: (
      data: {
        /**
         * 5-digit FIPS code
         * @pattern ^[0-9]{5}$
         * @example "12345"
         */
        county_fips: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SoilData, Error>({
        path: `/get-soil-data`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  countyLookup = {
    /**
     * @description Search counties by name, state, or FIPS code
     *
     * @tags Geographic
     * @name CountyLookup
     * @summary Search for counties
     * @request POST:/county-lookup
     * @secure
     */
    countyLookup: (
      data: {
        /**
         * Search term (county name, state, or FIPS)
         * @minLength 2
         * @maxLength 100
         * @example "Miami-Dade"
         */
        term: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          counties?: County[];
        },
        Error
      >({
        path: `/county-lookup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  territorialWaterQuality = {
    /**
     * @description Retrieve water quality metrics for a specific county
     *
     * @tags Water Quality
     * @name GetWaterQuality
     * @summary Get water quality data
     * @request POST:/territorial-water-quality
     * @secure
     */
    getWaterQuality: (
      data: {
        /**
         * @pattern ^[0-9]{5}$
         * @example "12345"
         */
        county_fips: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<WaterQuality, Error>({
        path: `/territorial-water-quality`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  territorialWaterAnalytics = {
    /**
     * @description Generate territorial water quality analytics across regions
     *
     * @tags Water Quality
     * @name GetTerritorialWaterAnalytics
     * @summary Get territorial water analytics
     * @request POST:/territorial-water-analytics
     * @secure
     */
    getTerritorialWaterAnalytics: (
      data: {
        /** Type of territory to analyze */
        territory_type?: "state" | "territory" | "compact_state";
        /** EPA region identifier */
        epa_region?: string;
        date_range?: {
          /** @format date */
          start_date?: string;
          /** @format date */
          end_date?: string;
        };
      },
      params: RequestParams = {},
    ) =>
      this.request<TerritorialWaterAnalytics, Error>({
        path: `/territorial-water-analytics`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  multiParameterPlantingCalendar = {
    /**
     * @description Multi-parameter planting calendar with climate and soil factors
     *
     * @tags Soil Analysis
     * @name GetPlantingCalendar
     * @summary Get planting calendar recommendations
     * @request POST:/multi-parameter-planting-calendar
     * @secure
     */
    getPlantingCalendar: (
      data: {
        /** @pattern ^[0-9]{5}$ */
        county_fips: string;
        /** @example "corn" */
        crop_type: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PlantingCalendar, Error>({
        path: `/multi-parameter-planting-calendar`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  liveAgriculturalData = {
    /**
     * @description Fetch real-time agricultural data from multiple federal sources (NOAA, USDA, EPA)
     *
     * @tags Soil Analysis
     * @name GetLiveAgriculturalData
     * @summary Get live agricultural data
     * @request POST:/live-agricultural-data
     * @secure
     */
    getLiveAgriculturalData: (
      data: {
        /** @pattern ^[0-9]{5}$ */
        county_fips: string;
        /** Types of data to fetch */
        data_types: ("weather" | "soil" | "crop" | "environmental")[];
        /** @maxLength 2 */
        state_code: string;
        county_name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LiveAgriculturalData, Error>({
        path: `/live-agricultural-data`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  environmentalImpactEngine = {
    /**
     * @description Assess environmental impact including runoff risk, contamination, and eco-friendly alternatives
     *
     * @tags Environmental
     * @name CalculateEnvironmentalImpact
     * @summary Calculate environmental impact
     * @request POST:/environmental-impact-engine
     * @secure
     */
    calculateEnvironmentalImpact: (
      data: {
        /** @format uuid */
        analysis_id: string;
        /** @pattern ^[0-9]{5}$ */
        county_fips: string;
        soil_data: {
          ph_level?: number;
          organic_matter?: number;
          slope?: "flat" | "gentle" | "moderate" | "steep" | "very_steep";
          drainage?: "poor" | "moderate" | "good" | "excessive";
          nitrogen_level?: string;
          phosphorus_level?: string;
        };
        proposed_treatments?: {
          type?: "nitrogen_fertilizer" | "phosphorus_fertilizer" | "pesticide";
        }[];
        water_body_data?: {
          distance_miles?: number;
        };
      },
      params: RequestParams = {},
    ) =>
      this.request<EnvironmentalImpact, Error>({
        path: `/environmental-impact-engine`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  alphaEarthEnvironmentalEnhancement = {
    /**
     * @description AlphaEarth satellite intelligence integration
     *
     * @tags Satellite Data
     * @name GetSatelliteData
     * @summary Get satellite environmental data
     * @request POST:/alpha-earth-environmental-enhancement
     * @secure
     */
    getSatelliteData: (
      data: {
        /**
         * @format float
         * @min -90
         * @max 90
         */
        latitude: number;
        /**
         * @format float
         * @min -180
         * @max 180
         */
        longitude: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SatelliteData, Error>({
        path: `/alpha-earth-environmental-enhancement`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  agriculturalIntelligence = {
    /**
     * @description Agricultural intelligence with AI recommendations
     *
     * @tags AI Services
     * @name GetAgriculturalIntelligence
     * @summary Get AI-powered agricultural insights
     * @request POST:/agricultural-intelligence
     * @secure
     */
    getAgriculturalIntelligence: (
      data: {
        /** @pattern ^[0-9]{5}$ */
        county_fips: string;
        analysis_type:
          | "crop_recommendation"
          | "yield_prediction"
          | "pest_analysis";
      },
      params: RequestParams = {},
    ) =>
      this.request<AIAnalysis, Error>({
        path: `/agricultural-intelligence`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  seasonalPlanningAssistant = {
    /**
     * @description AI-powered seasonal planning with weather integration
     *
     * @tags AI Services
     * @name GetSeasonalPlanningAssistant
     * @summary Get seasonal planning recommendations
     * @request POST:/seasonal-planning-assistant
     * @secure
     */
    getSeasonalPlanningAssistant: (
      data: {
        location: {
          county_fips?: string;
          state_code?: string;
          county_name?: string;
        };
        /** Optional soil data for enhanced recommendations */
        soilData?: object;
        planningType:
          | "spring_planting"
          | "fall_harvest"
          | "winter_prep"
          | "year_round";
        cropPreferences?: string[];
        /** Planning timeframe (e.g., "3 months", "1 year") */
        timeframe?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SeasonalPlanningResponse, Error>({
        path: `/seasonal-planning-assistant`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  smartReportSummary = {
    /**
     * @description Generate AI-powered summaries for soil or water quality reports
     *
     * @tags AI Services
     * @name GenerateSmartReportSummary
     * @summary Generate AI report summary
     * @request POST:/smart-report-summary
     * @secure
     */
    generateSmartReportSummary: (
      data: {
        reportType: "soil" | "water_quality";
        /** Report data to summarize */
        reportData: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<SmartReportSummary, Error>({
        path: `/smart-report-summary`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  carbonCreditCalculator = {
    /**
     * @description Calculate carbon credits based on field data and soil organic matter
     *
     * @tags Carbon
     * @name CalculateCarbonCredits
     * @summary Calculate carbon credits
     * @request POST:/carbon-credit-calculator
     * @secure
     */
    calculateCarbonCredits: (
      data: {
        /** Name of the field */
        field_name: string;
        /**
         * Field size in acres
         * @min 0.1
         */
        field_size_acres: number;
        /** Soil organic matter percentage */
        soil_organic_matter?: number;
        /**
         * Reference to existing soil analysis
         * @format uuid
         */
        soil_analysis_id?: string;
        verification_type?: "self_reported" | "third_party" | "satellite";
      },
      params: RequestParams = {},
    ) =>
      this.request<CarbonCreditCalculation, Error>({
        path: `/carbon-credit-calculator`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  generateVrtPrescription = {
    /**
     * @description Generate variable rate technology prescription maps
     *
     * @tags VRT
     * @name GenerateVrtPrescription
     * @summary Generate VRT prescription map
     * @request POST:/generate-vrt-prescription
     * @secure
     */
    generateVrtPrescription: (
      data: {
        /** @format uuid */
        field_id: string;
        application_type: "fertilizer" | "seed" | "pesticide";
        /** @format uuid */
        soil_analysis_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VRTPrescription, Error>({
        path: `/generate-vrt-prescription`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  leafenginesQuery = {
    /**
     * @description LeafEngines API for plant compatibility scoring with environmental factors
     *
     * @tags LeafEngines
     * @name LeafenginesQuery
     * @summary Query plant-environment compatibility
     * @request POST:/leafengines-query
     * @secure
     */
    leafenginesQuery: (
      data: {
        location: {
          latitude?: number;
          longitude?: number;
          address?: string;
          county_fips?: string;
        };
        plant: {
          common_name?: string;
          scientific_name?: string;
          plant_id?: string;
          care_requirements?: {
            sun_exposure?: "full_sun" | "partial_shade" | "full_shade";
            water_needs?: "low" | "medium" | "high";
            soil_ph_range?: {
              min?: number;
              max?: number;
            };
          };
        };
        options?: {
          include_satellite_data?: boolean;
          include_water_quality?: boolean;
          include_recommendations?: boolean;
        };
      },
      params: RequestParams = {},
    ) =>
      this.request<LeafEnginesCompatibility, Error>({
        path: `/leafengines-query`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  safeIdentification = {
    /**
     * @description Environmentally-contextualized plant identification that addresses misidentification concerns. Unlike generic plant ID, this endpoint: - Checks against a toxic lookalike database with visual similarity scores - Uses environmental context (soil, climate, regional flora) to weight identification probability - Provides confidence breakdowns showing why alternatives were considered - Issues explicit warnings for dangerous lookalikes (Poison Hemlock vs Wild Carrot) - Accounts for plant growth stage (seedling identification challenges)
     *
     * @tags Consumer Plant Care
     * @name SafeIdentification
     * @summary Safe plant identification with toxic lookalike warnings
     * @request POST:/safe-identification
     * @secure
     */
    safeIdentification: (
      data: {
        /** Base64 encoded image or image URL */
        image: string;
        location?: {
          /** @pattern ^[0-9]{5}$ */
          county_fips?: string;
          /** @maxLength 2 */
          state_code?: string;
          coordinates?: {
            latitude?: number;
            longitude?: number;
          };
        };
        context?: {
          environment?: "wild" | "garden" | "indoor" | "agricultural";
          purpose?: "foraging" | "gardening" | "curiosity" | "pet_safety";
          growth_stage?:
            | "seedling"
            | "juvenile"
            | "mature"
            | "flowering"
            | "fruiting";
        };
      },
      params: RequestParams = {},
    ) =>
      this.request<SafeIdentification, Error>({
        path: `/safe-identification`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  dynamicCare = {
    /**
     * @description Real-time, environment-aware care recommendations that solve the "generic advice" problem. Unlike static "water every 7 days" recommendations, this endpoint: - Adjusts watering based on current humidity, temperature, and recent rainfall - Considers container type, soil composition, and drainage - Factors in seasonal changes and indoor environment conditions - Accounts for plant maturity and growth phase - Provides actionable guidance, not rigid schedules
     *
     * @tags Consumer Plant Care
     * @name DynamicCare
     * @summary Hyper-localized dynamic plant care recommendations
     * @request POST:/dynamic-care
     * @secure
     */
    dynamicCare: (
      data: {
        /**
         * Common or scientific plant name
         * @example "Monstera deliciosa"
         */
        plant_species: string;
        location: {
          /** @pattern ^[0-9]{5}$ */
          county_fips: string;
          state_code?: string;
          /** Whether the plant is indoors */
          indoor?: boolean;
        };
        environment?: {
          light_exposure?:
            | "full_sun"
            | "partial_sun"
            | "partial_shade"
            | "full_shade"
            | "artificial";
          /** Approximate indoor humidity if applicable */
          humidity_level?: "low" | "medium" | "high";
        };
        container_details?: {
          type?: "terracotta" | "plastic" | "ceramic" | "fabric" | "ground";
          size_inches?: number;
          has_drainage?: boolean;
        };
        soil_type?:
          | "potting_mix"
          | "succulent_mix"
          | "orchid_bark"
          | "garden_soil"
          | "sandy"
          | "clay";
        /**
         * Date plant was last watered
         * @format date
         */
        last_watered?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DynamicCare, Error>({
        path: `/dynamic-care`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  beginnerGuidance = {
    /**
     * @description Judgment-free, accessible plant guidance that solves community gatekeeping issues. This endpoint: - Translates scientific jargon into plain language - Never makes users feel stupid for asking about common plants - Uses progressive disclosure (simple answer first, details on request) - Provides encouraging, supportive tone - Offers practical "what do I do right now" guidance
     *
     * @tags Consumer Plant Care
     * @name BeginnerGuidance
     * @summary Beginner-friendly plant guidance without jargon
     * @request POST:/beginner-guidance
     * @secure
     */
    beginnerGuidance: (
      data: {
        /**
         * User's plant question in natural language
         * @example "My plant has yellow leaves, what's wrong?"
         */
        question: string;
        plant_context?: {
          /** Common plant name if known */
          plant_name?: string;
          /** Base64 image for context */
          image?: string;
        };
        location?: {
          county_fips?: string;
          indoor?: boolean;
        };
        /**
         * User's self-assessed expertise level
         * @default "complete_beginner"
         */
        user_expertise?:
          | "complete_beginner"
          | "some_experience"
          | "intermediate";
      },
      params: RequestParams = {},
    ) =>
      this.request<BeginnerGuidance, Error>({
        path: `/beginner-guidance`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  visualCropAnalysis = {
    /**
     * @description AI-powered visual crop analysis for pest detection, health assessment, and disease screening
     *
     * @tags AI Services
     * @name VisualCropAnalysis
     * @summary Analyze crop images
     * @request POST:/visual-crop-analysis
     * @secure
     */
    visualCropAnalysis: (
      data: {
        /** Base64 encoded image or image URL */
        image: string;
        analysis_type: "pest_detection" | "crop_health" | "disease_screening";
        location?: {
          county_fips?: string;
          county_name?: string;
          state_code?: string;
        };
        /** Type of crop being analyzed */
        crop_type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VisualCropAnalysis, Error>({
        path: `/visual-crop-analysis`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  assetsCrud = {
    /**
     * @description Retrieve managed assets for the authenticated user. Pass `?id=<uuid>` to fetch a single asset; omit for a list (max 1000).
     *
     * @tags Asset Management
     * @name ListAssets
     * @summary List or get a single managed asset
     * @request GET:/assets-crud
     * @secure
     */
    listAssets: (
      query?: {
        /**
         * Asset UUID to retrieve a single record
         * @format uuid
         */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: ManagedAsset[];
        },
        Error
      >({
        path: `/assets-crud`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a managed asset (point, polygon, or sensor) scoped to the API key owner. Supports idempotency via `Idempotency-Key` header.
     *
     * @tags Asset Management
     * @name CreateAsset
     * @summary Create a new managed asset
     * @request POST:/assets-crud
     * @secure
     */
    createAsset: (data: ManagedAssetInput, params: RequestParams = {}) =>
      this.request<
        {
          data?: ManagedAsset;
        },
        Error
      >({
        path: `/assets-crud`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a managed asset. Optimistic locking supported via `If-Match` header matching the current `version`.
     *
     * @tags Asset Management
     * @name UpdateAsset
     * @summary Update an existing asset
     * @request PATCH:/assets-crud
     * @secure
     */
    updateAsset: (
      query: {
        /**
         * Asset UUID to update
         * @format uuid
         */
        id: string;
      },
      data: ManagedAssetInput,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: ManagedAsset;
        },
        void | Error
      >({
        path: `/assets-crud`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Soft-delete a managed asset (sets `is_deleted = true`). Record and history are preserved.
     *
     * @tags Asset Management
     * @name DeleteAsset
     * @summary Soft-delete an asset
     * @request DELETE:/assets-crud
     * @secure
     */
    deleteAsset: (
      query: {
        /**
         * Asset UUID to delete
         * @format uuid
         */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: ManagedAsset;
        },
        void | Error
      >({
        path: `/assets-crud`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  wfsExport = {
    /**
     * @description Read-only WFS endpoint for GIS consumers (QGIS, ArcGIS, etc.). `?request=GetCapabilities` requires no authentication. `?request=GetFeature` requires `x-api-key` and returns the key owner's assets. Supports `bbox` filtering and `format=gml` output.
     *
     * @tags WFS Export
     * @name WfsExport
     * @summary OGC WFS-compatible asset export
     * @request GET:/wfs-export
     * @secure
     */
    wfsExport: (
      query?: {
        /** WFS request type */
        request?: "GetCapabilities" | "GetFeature";
        /**
         * Output format for GetFeature
         * @default "geojson"
         */
        outputFormat?: "geojson" | "gml";
        /** Bounding box: minLon,minLat,maxLon,maxLat */
        bbox?: string;
        /**
         * Maximum features to return
         * @max 5000
         * @default 1000
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, Error>({
        path: `/wfs-export`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
