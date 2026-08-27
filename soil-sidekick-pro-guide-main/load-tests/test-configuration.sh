#!/bin/bash

# Test configuration for Skyline mmWave CI/CD Load Testing

set -e

echo "Testing Skyline mmWave CI/CD Load Testing Configuration..."
echo "=========================================================="

# Check directory structure
echo ""
echo "1. Checking directory structure..."
REQUIRED_DIRS=("scripts" "fixtures")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir directory exists"
    else
        echo "  ⚠️  $dir directory missing (creating...)"
        mkdir -p "$dir"
    fi
done

# Check required files
echo ""
echo "2. Checking required files..."
REQUIRED_FILES=(
    "scripts/test-skyline-mmwave.js"
    "scripts/test-skyline-smoke.js"
    "../.github/workflows/load-test.yml"
    "Dockerfile"
    "docker-compose.yml"
    "run-local.sh"
    "README-CI-CD.md"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

# Check test scripts for syntax errors
echo ""
echo "3. Checking test script syntax..."
if command -v node &> /dev/null; then
    echo "  Checking test-skyline-mmwave.js..."
    if node -c "scripts/test-skyline-mmwave.js" 2>/dev/null; then
        echo "    ✅ Syntax valid"
    else
        echo "    ❌ Syntax error"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
    
    echo "  Checking test-skyline-smoke.js..."
    if node -c "scripts/test-skyline-smoke.js" 2>/dev/null; then
        echo "    ✅ Syntax valid"
    else
        echo "    ❌ Syntax error"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
else
    echo "  ⚠️  Node.js not installed, skipping syntax check"
fi

# Check GitHub Actions workflow syntax
echo ""
echo "4. Checking GitHub Actions workflow..."
if command -v yq &> /dev/null && [ -f ".github/workflows/load-test.yml" ]; then
    if yq eval '.' ".github/workflows/load-test.yml" > /dev/null 2>&1; then
        echo "  ✅ Workflow YAML syntax valid"
    else
        echo "  ❌ Workflow YAML syntax error"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
else
    echo "  ⚠️  yq not installed or workflow missing, skipping YAML check"
fi

# Check Dockerfile
echo ""
echo "5. Checking Docker configuration..."
if [ -f "Dockerfile" ]; then
    echo "  ✅ Dockerfile exists"
    # Simple syntax check
    if grep -q "FROM grafana/k6" Dockerfile; then
        echo "    ✅ Uses correct base image"
    else
        echo "    ⚠️  May not use correct base image"
    fi
else
    echo "  ❌ Dockerfile missing"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

# Check for test fixtures
echo ""
echo "6. Checking for test fixtures..."
if [ -d "fixtures" ] && [ "$(ls -A fixtures 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "  ✅ Test fixtures found ($(ls fixtures/*.json 2>/dev/null | wc -l) JSON files)"
elif [ -d "../tests/fixtures/skyline-mmwave-golden" ]; then
    echo "  ⚠️  Fixtures not in load-tests directory, but found in parent"
    echo "     Run: ./copy-fixtures.sh to copy them"
else
    echo "  ⚠️  No test fixtures found"
    echo "     Expected: tests/fixtures/skyline-mmwave-golden/ from Action 1.2"
fi

# Check local run script
echo ""
echo "7. Checking local run script..."
if [ -f "run-local.sh" ]; then
    echo "  ✅ run-local.sh exists"
    if [ -x "run-local.sh" ]; then
        echo "    ✅ Executable"
    else
        echo "    ⚠️  Not executable (run: chmod +x run-local.sh)"
    fi
else
    echo "  ❌ run-local.sh missing"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

# Summary
echo ""
echo "=========================================================="
echo "Configuration Test Summary:"
echo ""

if [ $MISSING_FILES -eq 0 ]; then
    echo "✅ All checks passed! CI/CD pipeline is properly configured."
    echo ""
    echo "Next steps:"
    echo "1. Copy test fixtures: ./copy-fixtures.sh"
    echo "2. Test locally: ./run-local.sh smoke local"
    echo "3. Push to GitHub to trigger CI/CD pipeline"
else
    echo "⚠️  Found $MISSING_FILES issues that need attention."
    echo ""
    echo "Required fixes:"
    echo "1. Create missing files listed above"
    echo "2. Fix syntax errors in test scripts"
    echo "3. Ensure all required directories exist"
fi

echo ""
echo "Performance Gates Configuration:"
echo "  • Cloud API P95: < 1000ms"
echo "  • Edge Inference P95: < 100ms"
echo "  • Throughput: > 10,000 requests/minute"
echo "  • Error Rate: < 1%"
echo ""
echo "Test Types:"
echo "  • smoke: Quick validation (PRs)"
echo "  • load: Full performance test (pushes)"
echo "  • stress: Breaking point analysis (manual)"
echo ""
echo "See README-CI-CD.md for complete documentation."