import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { connect } from 'npm:mqtt@5.0.3';

// HIVEMQ Configuration
const HIVEMQ_HOST = '5b63a89881fd46d9af394bf11bb4206b.s1.eu.hivemq.cloud';
const HIVEMQ_PORT = 8883;
const HIVEMQ_USERNAME = 'Vallc200';
const HIVEMQ_PASSWORD = Deno.env.get('HIVEMQ_PASSWORD');

// Topic patterns
const TOPIC_PATTERNS = {
  SENSOR_READINGS: 'skyline/+/readings',
  DEVICE_STATUS: 'skyline/+/status',
  ALERTS: 'skyline/+/alerts',
};

// MQTT Client (initialized on first request)
let mqttClient: any = null;

async function getMqttClient() {
  if (mqttClient) return mqttClient;

  if (!HIVEMQ_PASSWORD) {
    throw new Error('HIVEMQ_PASSWORD environment variable not set');
  }

  mqttClient = connect(`mqtts://${HIVEMQ_HOST}:${HIVEMQ_PORT}`, {
    username: HIVEMQ_USERNAME,
    password: HIVEMQ_PASSWORD,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true,
  });

  mqttClient.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');
    
    // Subscribe to all Skyline device topics
    mqttClient.subscribe(Object.values(TOPIC_PATTERNS), (err: any) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        console.log('Subscribed to topics:', Object.values(TOPIC_PATTERNS));
      }
    });
  });

  mqttClient.on('message', async (topic: string, message: Buffer) => {
    try {
      const payload = JSON.parse(message.toString());
      await processMqttMessage(topic, payload);
    } catch (error) {
      console.error('Failed to process MQTT message:', error);
    }
  });

  mqttClient.on('error', (err: any) => {
    console.error('MQTT Error:', err);
  });

  mqttClient.on('disconnect', () => {
    console.log('Disconnected from HiveMQ Cloud');
  });

  return mqttClient;
}

async function processMqttMessage(topic: string, payload: any) {
  // Extract device_id from topic (e.g., "skyline/device-001/readings")
  const parts = topic.split('/');
  const deviceId = parts[1];
  const messageType = parts[2];

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  switch (messageType) {
    case 'readings':
      // Forward to sensor-data-ingestion
      try {
        const response = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/sensor-data-ingestion`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify(payload),
          }
        );
        
        if (!response.ok) {
          console.error('Failed to forward reading:', await response.text());
        }
      } catch (error) {
        console.error('Error forwarding reading:', error);
      }
      break;

    case 'status':
      // Update device status
      await supabase
        .from('sensor_devices')
        .upsert({
          device_id: deviceId,
          status: payload.status,
          battery_level: payload.battery_level,
          signal_strength: payload.signal_strength,
          last_seen_at: new Date().toISOString(),
        }, { onConflict: 'device_id' });
      break;

    case 'alerts':
      // Store alert for processing
      await supabase.from('sensor_alerts').insert({
        device_id: deviceId,
        alert_type: payload.alert_type,
        severity: payload.severity,
        message: payload.message,
        details: payload.details || {},
        timestamp: payload.timestamp || new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      break;

    default:
      console.log('Unknown message type:', messageType);
  }
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HTTP endpoint for health checks and manual triggers
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const client = await getMqttClient();
    
    return new Response(
      JSON.stringify({
        status: 'running',
        mqtt_connected: client.connected,
        timestamp: new Date().toISOString(),
        host: HIVEMQ_HOST,
        username: HIVEMQ_USERNAME,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
