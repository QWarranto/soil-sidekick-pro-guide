/**
 * Get Mapbox Token Function
 * 
 * Public endpoint to retrieve Mapbox token for map rendering.
 * Migrated to requestHandler pattern: December 16, 2025
 * 
 * Rate Limit: 1000 requests/hour (higher for public endpoint)
 * Auth: Not required (public endpoint)
 */

import { requestHandler } from '../_shared/request-handler.ts';
import { mapboxTokenSchema } from '../_shared/validation.ts';
import { logSafe, logError } from '../_shared/logging-utils.ts';

requestHandler({
  requireAuth: false,
  validationSchema: mapboxTokenSchema,
  rateLimit: {
    requests: 1000,
    windowMs: 3600000, // 1 hour
  },
  handler: async ({ supabaseClient, req, validatedData }) => {
    logSafe('Processing Mapbox token request', { 
      sessionId: validatedData?.sessionId || 'none',
      requestOrigin: validatedData?.requestOrigin || req.headers.get('origin') || 'unknown'
    });

    // Get the Mapbox token from environment variables
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!mapboxToken) {
      logError('Mapbox token not configured in environment');
      throw new Error('Mapbox token not configured');
    }

    logSafe('Mapbox token retrieved successfully');
    
    return {
      MAPBOX_PUBLIC_TOKEN: mapboxToken,
    };
  },
});
