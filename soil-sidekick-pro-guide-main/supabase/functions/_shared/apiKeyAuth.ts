// API key authentication helper
// Validates x-api-key header against the api_keys table
// Falls back to JWT auth if no API key provided
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.77.0";

export interface AuthResult {
  userId: string;
  authType: "jwt" | "apikey";
  error?: string;
}

/**
 * Hash an API key using the same algorithm as hash_api_key_secure SQL function:
 * SHA-512(api_key || 'SS_API_' || substring(api_key, 4, 8) || '_2025')
 */
async function hashApiKey(apiKey: string): Promise<string> {
  const salt = "SS_API_" + apiKey.substring(3, 11) + "_2025";
  const data = new TextEncoder().encode(apiKey + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Resolve user ID from either JWT Bearer token or x-api-key header
 * @param req - Deno Request
 * @returns AuthResult with userId and authType, or error
 */
export async function resolveAuth(req: Request): Promise<AuthResult> {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  // Try x-api-key first (for QGIS/WFS integrations)
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const keyHash = await hashApiKey(apiKey);

    // Lookup key in api_keys table by hashed value
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("user_id, is_active, expires_at")
      .eq("key_hash", keyHash)
      .maybeSingle();

    if (keyError) {
      console.error("[apiKeyAuth] lookup error:", keyError);
      return { userId: "", authType: "apikey", error: "API key lookup failed" };
    }

    if (!keyData) {
      return { userId: "", authType: "apikey", error: "Invalid API key" };
    }

    if (!keyData.is_active) {
      return { userId: "", authType: "apikey", error: "API key deactivated" };
    }

    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      return { userId: "", authType: "apikey", error: "API key expired" };
    }

    return { userId: keyData.user_id, authType: "apikey" };
  }

  // Fall back to JWT Bearer token
  const authHeader = req.headers.get("Authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) {
      return { userId: "", authType: "jwt", error: "Unauthorized" };
    }
    return { userId: userData.user.id, authType: "jwt" };
  }

  return { userId: "", authType: "jwt", error: "Missing Authorization or x-api-key header" };
}
