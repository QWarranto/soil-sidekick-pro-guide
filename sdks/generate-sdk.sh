#!/bin/bash

# SoilSidekick Pro SDK Generator
# Usage: ./generate-sdk.sh [language] [version]
# Languages: typescript, python, go, ruby, java, php, all

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPEC_FILE="$SCRIPT_DIR/../openapi-spec.yaml"
OUTPUT_DIR="$SCRIPT_DIR/generated"
VERSION="${2:-1.1.0}"
LANGUAGE="${1:-all}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════════════════════"
echo "  SoilSidekick Pro SDK Generator v${VERSION}"
echo "═══════════════════════════════════════════════════════════"

# Check for openapi-generator-cli
if ! command -v openapi-generator-cli &> /dev/null; then
    echo -e "${YELLOW}Installing openapi-generator-cli...${NC}"
    npm install -g @openapitools/openapi-generator-cli
fi

# Validate spec first
echo -e "\n${YELLOW}Validating OpenAPI specification...${NC}"
openapi-generator-cli validate -i "$SPEC_FILE"
echo -e "${GREEN}✓ Specification is valid${NC}"

# Create output directories
mkdir -p "$OUTPUT_DIR"

generate_typescript() {
    echo -e "\n${YELLOW}Generating TypeScript SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g typescript-fetch \
        -o "$OUTPUT_DIR/typescript" \
        --additional-properties=npmName=@soilsidekick/sdk,npmVersion=$VERSION,supportsES6=true,typescriptThreePlus=true \
        --skip-validate-spec
    
    # Create tsconfig for the generated SDK
    cat > "$OUTPUT_DIR/typescript/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    echo -e "${GREEN}✓ TypeScript SDK generated at $OUTPUT_DIR/typescript${NC}"
}

generate_python() {
    echo -e "\n${YELLOW}Generating Python SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g python \
        -o "$OUTPUT_DIR/python" \
        --additional-properties=packageName=soilsidekick,packageVersion=$VERSION,projectName=soilsidekick-sdk \
        --skip-validate-spec
    echo -e "${GREEN}✓ Python SDK generated at $OUTPUT_DIR/python${NC}"
}

generate_go() {
    echo -e "\n${YELLOW}Generating Go SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g go \
        -o "$OUTPUT_DIR/go" \
        --additional-properties=packageName=soilsidekick,packageVersion=$VERSION,isGoSubmodule=true \
        --skip-validate-spec
    echo -e "${GREEN}✓ Go SDK generated at $OUTPUT_DIR/go${NC}"
}

generate_ruby() {
    echo -e "\n${YELLOW}Generating Ruby SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g ruby \
        -o "$OUTPUT_DIR/ruby" \
        --additional-properties=gemName=soilsidekick,gemVersion=$VERSION,moduleName=SoilSidekick \
        --skip-validate-spec
    echo -e "${GREEN}✓ Ruby SDK generated at $OUTPUT_DIR/ruby${NC}"
}

generate_java() {
    echo -e "\n${YELLOW}Generating Java SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g java \
        -o "$OUTPUT_DIR/java" \
        --additional-properties=artifactId=soilsidekick-sdk,groupId=com.soilsidekick,artifactVersion=$VERSION,library=native \
        --skip-validate-spec
    echo -e "${GREEN}✓ Java SDK generated at $OUTPUT_DIR/java${NC}"
}

generate_php() {
    echo -e "\n${YELLOW}Generating PHP SDK...${NC}"
    openapi-generator-cli generate \
        -i "$SPEC_FILE" \
        -g php \
        -o "$OUTPUT_DIR/php" \
        --additional-properties=packageName=SoilSidekick,invokerPackage=SoilSidekick,artifactVersion=$VERSION \
        --skip-validate-spec
    echo -e "${GREEN}✓ PHP SDK generated at $OUTPUT_DIR/php${NC}"
}

# Generate based on language argument
case $LANGUAGE in
    typescript|ts)
        generate_typescript
        ;;
    python|py)
        generate_python
        ;;
    go)
        generate_go
        ;;
    ruby|rb)
        generate_ruby
        ;;
    java)
        generate_java
        ;;
    php)
        generate_php
        ;;
    all)
        generate_typescript
        generate_python
        generate_go
        generate_ruby
        generate_java
        generate_php
        ;;
    *)
        echo -e "${RED}Unknown language: $LANGUAGE${NC}"
        echo "Supported: typescript, python, go, ruby, java, php, all"
        exit 1
        ;;
esac

echo -e "\n═══════════════════════════════════════════════════════════"
echo -e "${GREEN}SDK generation complete!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Generated SDKs are in: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  1. cd $OUTPUT_DIR/<language>"
echo "  2. Follow the README.md for installation"
echo "  3. Run tests: npm run test (from sdks directory)"
