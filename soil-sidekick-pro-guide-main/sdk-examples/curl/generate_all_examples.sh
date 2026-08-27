    ],
    "crop_type": "corn",
    "growth_stage": "vegetative",
    "field_id": "field_001",
    "analysis_parameters": {
      "detect_diseases": true,
      "detect_pests": true,
      "nutrient_deficiency": true,
      "growth_stage_verification": true
    }
  }'
EOF

# 19. Sensor Data Ingestion (NEW)
cat > generated/19_sensor_data_ingestion.sh << 'EOF'
#!/bin/bash
# Sensor Data Ingestion - Sensor data ingestion pipeline
# Endpoint: POST /sensor-data-ingestion
# Tier Required: Enterprise
# Response Time Target: 500ms (Standard)

curl -X POST "${BASE_URL}/sensor-data-ingestion" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "skyline-mmwave-001",
    "sensor_type": "mmWave",
    "schema_version": "2.0",
    "readings": [
      {
        "timestamp": "2026-03-03T09:00:00Z",
        "value": 25.5,
        "unit": "dBm",
        "frequency": 60.5,
        "calibration_status": "calibrated",
        "environmental_conditions": {
          "temperature_c": 22.5,
          "humidity_percent": 45.2,
          "pressure_hpa": 1013.2
        }
      }
    ],
    "metadata": {
      "firmware_version": "2.1.0",
      "calibration_date": "2026-02-28",
      "location": {
        "latitude": 30.2672,
        "longitude": -97.7431,
        "altitude_m": 150.5
      },
      "transmission_id": "tx_001",
      "sequence_number": 1
    }
  }'
EOF

# 20. Sensor Correlation Engine (NEW)
cat > generated/20_sensor_correlation_engine.sh << 'EOF'
#!/bin/bash
# Sensor Correlation Engine - mmWave ↔ environmental correlation
# Endpoint: POST /sensor-correlation-engine
# Tier Required: Enterprise
# Response Time Target: 2000ms (Complex)

curl -X POST "${BASE_URL}/sensor-correlation-engine" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "analysis_id": "sensor_analysis_001",
    "sensor_data": {
      "mmwave_readings": [
        {
          "timestamp": "2026-03-03T09:00:00Z",
          "value": 25.5,
          "frequency": 60.5,
          "signal_strength": -45.2,
          "tracked_targets": [
            {
              "id": "TGT-000001",
              "distance_m": 25.3,
              "speed_mps": 1.2,
              "azimuth_deg": 45.5,
              "track_confidence": 0.85
            }
          ]
        }
      ],
      "environmental_readings": [
        {
          "timestamp": "2026-03-03T09:00:00Z",
          "temperature_c": 22.5,
          "humidity_percent": 45.2,
          "pressure_hpa": 1013.2,
          "wind_speed_mps": 2.5,
          "precipitation_mm": 0
        }
      ]
    },
    "correlation_parameters": {
      "time_window_minutes": 60,
      "correlation_threshold": 0.7,
      "anomaly_detection": true,
      "cross_correlation_lag": 5
    }
  }'
EOF

# 21. Sensor WebSocket Gateway (NEW)
cat > generated/21_sensor_websocket_gateway.sh << 'EOF'
#!/bin/bash
# Sensor WebSocket Gateway - Real-time WebSocket streaming
# Endpoint: POST /sensor-websocket-gateway
# Tier Required: Enterprise
# Response Time Target: 500ms (Standard)

curl -X POST "${BASE_URL}/sensor-websocket-gateway" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "device_ids": ["skyline-mmwave-001", "skyline-mmwave-002"],
    "stream_types": ["raw_readings", "correlated_data", "anomalies", "device_status"],
    "update_frequency_ms": 1000,
    "historical_depth_minutes": 5,
    "filters": {
      "min_signal_strength": -50,
      "max_anomaly_score": 0.8,
      "target_types": ["human", "vehicle", "animal"]
    }
  }'
EOF

# 22. MQTT Bridge (NEW)
cat > generated/22_mqtt_bridge.sh << 'EOF'
#!/bin/bash
# MQTT Bridge - MQTT bridge for Skyline devices
# Endpoint: POST /mqtt-bridge
# Tier Required: Enterprise
# Response Time Target: 2000ms (Complex)

# Create MQTT bridge connection
curl -X POST "${BASE_URL}/mqtt-bridge" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_connection",
    "mqtt_config": {
      "broker_type": "aws_iot_core",
      "endpoint": "a1b2c3d4e5f6-ats.iot.us-east-1.amazonaws.com",
      "client_id": "skyline-gateway-001",
      "topics": [
        "skyline/mmwave/+/readings",
        "skyline/mmwave/+/status",
        "skyline/mmwave/+/alerts",
        "skyline/mmwave/+/calibration"
      ],
      "qos_level": 1,
      "clean_session": true,
      "keep_alive_seconds": 30
    },
    "forwarding_rules": [
      {
        "source_topic": "skyline/mmwave/+/readings",
        "destination_endpoint": "/sensor-data-ingestion",
        "transformation": "json_to_json_v1",
        "filter": {
          "min_signal_strength": -60,
          "schema_versions": ["1.0", "1.1", "2.0"]
        }
      },
      {
        "source_topic": "skyline/mmwave/+/alerts",
        "destination_endpoint": "/environmental-hazard-dashboard",
        "transformation": "alert_to_hazard",
        "priority": "high"
      }
    ],
    "monitoring": {
      "health_check_interval_seconds": 60,
      "reconnect_attempts": 5,
      "message_buffer_size": 1000
    }
  }'

# Test MQTT bridge connection
curl -X POST "${BASE_URL}/mqtt-bridge" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test_connection",
    "connection_id": "mqtt_conn_abc123"
  }'

# Get MQTT bridge status
curl -X POST "${BASE_URL}/mqtt-bridge" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_status",
    "connection_id": "mqtt_conn_abc123"
  }'
EOF

# 23. Environmental Hazard Dashboard (NEW)
cat > generated/23_environmental_hazard_dashboard.sh << 'EOF'
#!/bin/bash
# Environmental Hazard Dashboard - Environmental hazard dashboard
# Endpoint: POST /environmental-hazard-dashboard
# Tier Required: Enterprise
# Response Time Target: 5000ms (Heavy)

curl -X POST "${BASE_URL}/environmental-hazard-dashboard" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "region": {
      "center": {
        "latitude": 30.2672,
        "longitude": -97.7431
      },
      "radius_km": 10,
      "boundary_type": "circle"
    },
    "hazard_types": ["flood", "fire", "chemical_spill", "air_quality", "extreme_weather"],
    "time_range": {
      "start": "2026-03-01T00:00:00Z",
      "end": "2026-03-03T23:59:59Z"
    },
    "data_sources": ["satellite", "sensor_network", "weather_stations", "social_media", "traffic_cameras"],
    "alert_thresholds": {
      "flood_risk": 0.7,
      "fire_risk": 0.6,
      "air_quality_index": 150,
      "chemical_concentration": 0.5,
      "wind_speed_mps": 20
    },
    "monitoring_parameters": {
      "update_frequency_minutes": 15,
      "historical_depth_days": 7,
      "prediction_horizon_hours": 24
    },
    "notification_settings": {
      "email": ["operations@example.com", "safety@example.com"],
      "sms": ["+1234567890", "+0987654321"],
      "webhook": "https://ops.example.com/alerts",
      "escalation_rules": {
        "level1": "5_minutes",
        "level2": "15_minutes",
        "level3": "30_minutes"
      }
    }
  }'
EOF

# Make all scripts executable
chmod +x generated/*.sh

echo "Generated 23 curl example scripts in 'generated/' directory:"
echo ""
echo "1.  get_soil_data.sh"
echo "2.  county_lookup.sh"
echo "3.  territorial_water_quality.sh"
echo "4.  territorial_water_analytics.sh"
echo "5.  multi_parameter_planting_calendar.sh"
echo "6.  live_agricultural_data.sh"
echo "7.  environmental_impact_engine.sh"
echo "8.  alpha_earth_environmental_enhancement.sh"
echo "9.  agricultural_intelligence.sh"
echo "10. seasonal_planning_assistant.sh"
echo "11. smart_report_summary.sh"
echo "12. carbon_credit_calculator.sh"
echo "13. generate_vrt_prescription.sh"
echo "14. leafengines_query.sh"
echo "15. safe_identification.sh"
echo "16. dynamic_care.sh"
echo "17. beginner_guidance.sh"
echo "18. visual_crop_analysis.sh"
echo "19. sensor_data_ingestion.sh"
echo "20. sensor_correlation_engine.sh"
echo "21. sensor_websocket_gateway.sh"
echo "22. mqtt_bridge.sh"
echo "23. environmental_hazard_dashboard.sh"
echo ""
echo "To use:"
echo "1. Edit the script to set your API_KEY and JWT_TOKEN"
echo "2. Run any script: ./generated/01_get_soil_data.sh"
echo "3. Or run all: for script in generated/*.sh; do echo \"=== Running \$script ===\"; ./\$script; echo \"\"; done"
echo ""
echo "Note: Some endpoints require specific subscription tiers:"
echo "  - Free: 1-2"
echo "  - Starter: 3-5, 15-17"
echo "  - Pro: 6-14, 18"
echo "  - Enterprise: 19-23"