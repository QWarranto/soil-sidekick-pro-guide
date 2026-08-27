#!/bin/bash
# Memory Helper - Quick Actions (Memory Diag handles monitoring)
# Usage: ./memory-helper.sh [clean|hogs|kill-hogs|status]

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
    clean)
        echo "🧹 Purging inactive memory..."
        sudo purge
        echo -e "${GREEN}✅ Done${NC}"
        ;;
    hogs)
        echo "🔍 Top Memory Consumers:"
        echo ""
        ps aux | head -1
        ps aux | sort -nr -k 4 | head -15 | awk '{printf "%-10s %6s %6s %s\n", $1, $3, $4, $11}'
        ;;
    kill-hogs)
        echo "⚠️  Top 3 memory consumers:"
        ps aux | sort -nr -k 4 | head -3 | awk '{printf "%-20s %5s%% PID:%s\n", $11, $4, $2}'
        echo ""
        read -p "Kill these processes? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ps aux | sort -nr -k 4 | head -3 | awk '{print $2}' | xargs -I {} sudo kill -9 {} 2>/dev/null
            echo -e "${GREEN}✅ Killed${NC}"
        fi
        ;;
    status|*)
        echo "Memory Helper (Memory Diag is your monitor)"
        echo ""
        echo "Quick Actions:"
        echo "  ./memory-helper.sh clean     - Purge inactive memory"
        echo "  ./memory-helper.sh hogs      - Show top memory consumers"
        echo "  ./memory-helper.sh kill-hogs - Kill top 3 offenders"
        echo ""
        # Show current pressure
        pressure=$(memory_pressure 2>/dev/null | grep "System-wide memory free percentage" | awk '{print $5}')
        echo "Current Memory Pressure: $pressure free"
        ;;
esac
