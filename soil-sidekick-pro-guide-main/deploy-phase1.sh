#!/bin/bash
# Phase 1 Deployment Script
# SoilSidekick Pro - Skyline Instruments Integration

set -e

echo "=========================================="
echo "Phase 1: Critical Infrastructure Deployment"
echo "SoilSidekick Pro - Skyline Integration"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found${NC}"
    echo "Install with: npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo -e "${RED}Error: Not logged into Supabase${NC}"
    echo "Run: supabase login"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Step 1: Set environment variables
echo -e "${YELLOW}Step 1: Setting environment variables...${NC}"
echo "Make sure you have set HIVEMQ_PASSWORD in your Supabase secrets"
echo ""
echo "To set secrets, run:"
echo "  supabase secrets set HIVEMQ_PASSWORD=Golden_Mysteries_2026"
echo ""
read -p "Have you set the HIVEMQ_PASSWORD secret? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Please set the secret first, then re-run this script${NC}"
    exit 1
fi

# Step 2: Run database migrations
echo ""
echo -e "${YELLOW}Step 2: Running database migrations...${NC}"
supabase db reset

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations applied${NC}"
else
    echo -e "${RED}✗ Database migration failed${NC}"
    exit 1
fi

# Step 3: Deploy edge functions
echo ""
echo -e "${YELLOW}Step 3: Deploying edge functions...${NC}"

# Deploy sensor-data-ingestion
echo "Deploying sensor-data-ingestion..."
supabase functions deploy sensor-data-ingestion

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ sensor-data-ingestion deployed${NC}"
else
    echo -e "${RED}✗ sensor-data-ingestion deployment failed${NC}"
    exit 1
fi

# Deploy mqtt-bridge
echo "Deploying mqtt-bridge..."
supabase functions deploy mqtt-bridge

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ mqtt-bridge deployed${NC}"
else
    echo -e "${RED}✗ mqtt-bridge deployment failed${NC}"
    exit 1
fi

# Step 4: Verify deployment
echo ""
echo -e "${YELLOW}Step 4: Verifying deployment...${NC}"

# Check functions are listed
FUNCTIONS=$(supabase functions list)
if echo "$FUNCTIONS" | grep -q "sensor-data-ingestion"; then
    echo -e "${GREEN}✓ sensor-data-ingestion is deployed${NC}"
else
    echo -e "${RED}✗ sensor-data-ingestion not found${NC}"
fi

if echo "$FUNCTIONS" | grep -q "mqtt-bridge"; then
    echo -e "${GREEN}✓ mqtt-bridge is deployed${NC}"
else
    echo -e "${RED}✗ mqtt-bridge not found${NC}"
fi

# Step 5: Test health endpoint
echo ""
echo -e "${YELLOW}Step 5: Testing mqtt-bridge health endpoint...${NC}"

PROJECT_REF=$(supabase status | grep "Project Ref" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://${PROJECT_REF}.supabase.co/functions/v1/mqtt-bridge" \
  -H "Authorization: Bearer ${ANON_KEY}")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✓ mqtt-bridge health check passed${NC}"
else
    echo -e "${YELLOW}⚠ mqtt-bridge health check returned ${HEALTH_CHECK} (may need a moment to start)${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Phase 1 Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Connect first Skyline device to HiveMQ"
echo "2. Send test message to topic: skyline/test-device-001/readings"
echo "3. Verify data appears in sensor_readings table"
echo ""
echo "Test command:"
echo "  curl -X POST https://${PROJECT_REF}.supabase.co/functions/v1/sensor-data-ingestion \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -H 'Authorization: Bearer ${ANON_KEY}' \\"
echo "    -d '{\"device_id\":\"test-001\",\"device_type\":\"mmwave_radar\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"readings\":[{\"metric\":\"reflectivity\",\"value\":0.85,\"unit\":\"ratio\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}],\"metadata\":{\"firmware_version\":\"1.0.0\"}}'"
echo ""
