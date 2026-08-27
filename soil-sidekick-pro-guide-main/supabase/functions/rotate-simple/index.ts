Deno.serve(async (req) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
  }

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 })
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    )
  }

  try {
    // Basic API key check (optional for testing)
    const apiKey = req.headers.get('x-api-key')
    const validApiKey = Deno.env.get('ROTATION_API_KEY') || 'test-key-123'
    
    // Comment out for testing without auth
    // if (apiKey !== validApiKey) {
    //   return new Response(
    //     JSON.stringify({ error: 'Invalid API key' }),
    //     { status: 401, headers }
    //   )
    // }

    const body = await req.json()
    const action = body.action || 'rotate'
    
    if (action !== 'rotate') {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "rotate"' }),
        { status: 400, headers }
      )
    }

    // TODO: Add actual key rotation logic here
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Encryption key rotation ready',
        note: 'Implement actual rotation logic'
      }),
      { status: 200, headers }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    )
  }
})
