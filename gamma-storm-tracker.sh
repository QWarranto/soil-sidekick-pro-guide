#!/bin/bash
# Gamma Storm Tracker - Centralized Gamma Monitoring System
# Automates gamma condition scanning across all watchlists

# Configuration
WATCHLIST_DIR="/Users/reginaldrice/clawd/SSKPPortfolio"
GAMMA_THRESHOLD_NEGATIVE=-0.1  # Negative gamma threshold
ZONE_WIDTH_THRESHOLD=10.0      # Narrow zone = higher volatility risk
MAX_STORMS=5                   # Show top 5 opportunities

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔭 GAMMA STORM TRACKER"
echo "======================"
echo "Scanning $(find "$WATCHLIST_DIR" -name "*.txt" | wc -l) watchlists for gamma opportunities..."
echo ""

# Function to simulate gamma analysis (you'll replace this with real API calls)
analyze_gamma() {
    local symbol=$1
    local watchlist=$2
    
    # Simulate gamma data (replace with real gamma API calls)
    # In reality, you'd call your gamma data provider here
    local gamma_flip=$(echo "$symbol" | cksum | awk '{print 430 + ($1 % 40)}')
    local call_wall=$(echo "$symbol" | cksum | awk '{print 450 + ($1 % 30)}')
    local put_support=$(echo "$symbol" | cksum | awk '{print 410 - ($1 % 30)}')
    local current_price=$(echo "$symbol" | cksum | awk '{print 420 + ($1 % 25)}')
    local gamma_exposure=$(echo "$symbol" | cksum | awk '{print -0.2 + ($1 % 0.4) - 0.2}')
    local zone_width=$(echo "$symbol" | cksum | awk '{print 8 + ($1 % 15)}')
    
    # Determine conditions
    local regime="Neutral"
    local condition=""
    local priority=0
    
    if (( $(echo "$gamma_exposure < $GAMMA_THRESHOLD_NEGATIVE" | bc -l) )); then
        regime="${RED}NEGATIVE GAMMA${NC}"
        condition="STORM CONDITIONS"
        priority=3
    elif (( $(echo "$zone_width < $ZONE_WIDTH_THRESHOLD" | bc -l) )); then
        regime="${YELLOW}NARROW ZONE${NC}"
        condition="HIGH VOLATILITY RISK"
        priority=2
    elif (( $(echo "$current_price < $gamma_flip" | bc -l) )); then
        regime="${BLUE}BELOW FLIP${NC}"
        condition="POTENTIAL BREAKDOWN"
        priority=1
    else
        regime="${GREEN}NORMAL${NC}"
        condition="STABLE CONDITIONS"
        priority=0
    fi
    
    echo "$priority|$symbol|$watchlist|$current_price|$gamma_flip|$call_wall|$put_support|$zone_width%|$gamma_exposure|$regime|$condition"
}

# Process all watchlists
echo "📊 SCANNING GAMMA CONDITIONS..."
echo ""

# Temporary file for results
TEMP_FILE=$(mktemp)

# Scan each watchlist
for watchlist_file in "$WATCHLIST_DIR"/*.txt; do
    if [[ -f "$watchlist_file" ]]; then
        watchlist_name=$(basename "$watchlist_file" .txt)
        echo "🔍 Scanning $watchlist_name..."
        
        while IFS= read -r symbol; do
            # Skip empty lines and comments
            [[ -z "$symbol" || "$symbol" =~ ^# ]] && continue
            
            # Analyze this symbol
            analyze_gamma "$symbol" "$watchlist_name" >> "$TEMP_FILE"
        done < "$watchlist_file"
    fi
done

# Sort by priority (highest first) and display results
echo ""
echo "🌪️  GAMMA STORM ALERTS"
echo "====================="
echo ""

if [[ ! -s "$TEMP_FILE" ]]; then
    echo "No symbols found in watchlists."
else
    # Sort by priority and display top opportunities
    sort -nr "$TEMP_FILE" | head -$MAX_STORMS | while IFS='|' read -r priority symbol watchlist current_price gamma_flip call_wall put_support zone_width gamma_exposure regime condition; do
        echo "⚡ $symbol ($watchlist)"
        echo "   Price: $$current_price | Flip: $$gamma_flip | Zone: $zone_width"
        echo "   $regime - $condition"
        echo "   Gamma: $gamma_exposure | Call Wall: $$call_wall | Put Support: $$put_support"
        echo ""
    done
fi

# Clean up
rm -f "$TEMP_FILE"

echo "✅ Scan complete!"
echo ""
echo "💡 TIP: Run this script regularly to monitor gamma conditions"
echo "   Or set up a cron job for automated scanning"
echo ""
echo "🔧 To integrate with real gamma data, replace the analyze_gamma() function"
echo "   with calls to your gamma data provider API."
