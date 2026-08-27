#!/bin/bash

# Simple validation script for Skyline mmWave test fixtures
# Checks JSON syntax and basic structure without external dependencies

set -e

FIXTURE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALID_COUNT=0
INVALID_COUNT=0
TOTAL_COUNT=0

echo "Validating Skyline mmWave test fixtures..."
echo "=========================================="
echo ""

# Check JSON syntax for all JSON files
for file in "$FIXTURE_DIR"/*.json; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    
    # Skip schema files for now
    if [[ "$filename" == schema-* ]]; then
      continue
    fi
    
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    
    echo -n "Checking $filename... "
    
    if python3 -m json.tool "$file" > /dev/null 2>&1; then
      echo "✅ Valid JSON"
      VALID_COUNT=$((VALID_COUNT + 1))
    else
      echo "❌ Invalid JSON"
      INVALID_COUNT=$((INVALID_COUNT + 1))
      
      # Show error
      python3 -m json.tool "$file" 2>&1 | head -5
    fi
  fi
done

echo ""
echo "=========================================="
echo "Validation Complete:"
echo "  Total fixtures: $TOTAL_COUNT"
echo "  Valid JSON: $VALID_COUNT"
echo "  Invalid JSON: $INVALID_COUNT"

# Check JavaScript files syntax
echo ""
echo "Checking JavaScript files..."
for file in "$FIXTURE_DIR"/*.js; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    echo -n "Checking $filename... "
    
    if node -c "$file" > /dev/null 2>&1; then
      echo "✅ Valid JavaScript"
    else
      echo "❌ Invalid JavaScript"
      node -c "$file" 2>&1 | head -3
    fi
  fi
done

echo ""
echo "=========================================="
echo "Fixture Categories:"
echo "  01-05: Valid sensor readings"
echo "  06-10: Corrupt/malformed data"
echo "  11-13: Schema versioning tests"
echo "  14-17: Load test data"
echo "  18-20: MQTT generators & validation"

# Check file counts by category
echo ""
echo "File counts by category:"
echo "  Schema files: $(ls "$FIXTURE_DIR"/schema-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  Valid readings (01-05): $(ls "$FIXTURE_DIR"/0[1-5]-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  Corrupt data (06-10): $(ls "$FIXTURE_DIR"/0[6-9]-*.json "$FIXTURE_DIR"/10-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  Schema tests (11-13): $(ls "$FIXTURE_DIR"/1[1-3]-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  Load tests (14-17): $(ls "$FIXTURE_DIR"/1[4-7]-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  MQTT files (18-20): $(ls "$FIXTURE_DIR"/1[8-9]-*.json "$FIXTURE_DIR"/20-*.json 2>/dev/null | wc -l | tr -d ' ')"
echo "  JavaScript files: $(ls "$FIXTURE_DIR"/*.js 2>/dev/null | wc -l | tr -d ' ')"

# Final status
if [ $INVALID_COUNT -eq 0 ]; then
  echo ""
  echo "✅ All fixtures have valid JSON syntax!"
  exit 0
else
  echo ""
  echo "❌ Found $INVALID_COUNT invalid fixture(s)"
  exit 1
fi