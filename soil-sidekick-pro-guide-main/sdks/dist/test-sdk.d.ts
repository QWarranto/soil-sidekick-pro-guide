/**
 * SoilSidekick Pro SDK Test Script
 *
 * This script validates SDK functionality including:
 * - Authentication with API keys
 * - Rate limiting headers
 * - Tier-based feature access
 * - Error handling
 *
 * Usage:
 *   npx ts-node sdks/test-sdk.ts <API_KEY>
 *
 * Or with environment variable:
 *   SOILSIDEKICK_API_KEY=ss_prod_xxx npx ts-node sdks/test-sdk.ts
 */
interface TestResult {
    endpoint: string;
    status: 'pass' | 'fail' | 'skip';
    statusCode?: number;
    rateLimitHeaders?: {
        limit?: string;
        remaining?: string;
        reset?: string;
    };
    responseTime: number;
    error?: string;
    tierRequired?: string;
}
interface TestSuite {
    name: string;
    results: TestResult[];
    summary: {
        passed: number;
        failed: number;
        skipped: number;
    };
}
declare const ENDPOINT_TESTS: ({
    endpoint: string;
    method: string;
    body: {
        county_fips: string;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        term: string;
        county_fips?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        territory_type: string;
        county_fips?: undefined;
        term?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        county_fips: string;
        crop_type: string;
        term?: undefined;
        territory_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        county_fips: string;
        data_types: string[];
        state_code: string;
        county_name: string;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        analysis_id: string;
        county_fips: string;
        soil_data: {
            ph_level: number;
            organic_matter: number;
        };
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        latitude: number;
        longitude: number;
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        county_fips: string;
        analysis_type: string;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        location: {
            county_fips: string;
            state_code: string;
        };
        planningType: string;
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        reportType: string;
        reportData: {
            ph_level: number;
            organic_matter: number;
        };
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        field_name: string;
        field_size_acres: number;
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        plant?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
} | {
    endpoint: string;
    method: string;
    body: {
        location: {
            county_fips: string;
            state_code?: undefined;
        };
        plant: {
            common_name: string;
        };
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        analysis_type?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        image?: undefined;
    };
    tierRequired: string;
    useXApiKey: boolean;
} | {
    endpoint: string;
    method: string;
    body: {
        image: string;
        analysis_type: string;
        county_fips?: undefined;
        term?: undefined;
        territory_type?: undefined;
        crop_type?: undefined;
        data_types?: undefined;
        state_code?: undefined;
        county_name?: undefined;
        analysis_id?: undefined;
        soil_data?: undefined;
        latitude?: undefined;
        longitude?: undefined;
        location?: undefined;
        planningType?: undefined;
        reportType?: undefined;
        reportData?: undefined;
        field_name?: undefined;
        field_size_acres?: undefined;
        plant?: undefined;
    };
    tierRequired: string;
    useXApiKey?: undefined;
})[];
declare function testEndpoint(apiKey: string, config: typeof ENDPOINT_TESTS[0]): Promise<TestResult>;
declare function runTestSuite(apiKey: string): Promise<TestSuite>;
export { runTestSuite, testEndpoint, ENDPOINT_TESTS, TestResult, TestSuite };
