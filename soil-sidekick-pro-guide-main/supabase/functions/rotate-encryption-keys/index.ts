import { requestHandler } from '../_shared/request-handler.ts'

export default requestHandler({
  // CHANGE THIS TO FALSE for testing
  requireAuth: false,
  
  async handler(req, ctx) {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405 }
      )
    }

    try {
      const body = await req.json()
      const action = body.action || 'rotate'
      
      if (action !== 'rotate') {
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use "rotate"' }),
          { status: 400 }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Encryption key rotation function ready'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
      
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      )
    }
  }
})
