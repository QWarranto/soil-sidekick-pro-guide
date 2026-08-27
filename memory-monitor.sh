#!/bin/bash
# Memory Pressure Monitor - Run via cron every 5 minutes
# Alerts when memory pressure is high

# Get free memory percentage
pressure=$(memory_pressure 2>/dev/null | grep "System-wide memory free percentage" | awk '{print $5}' | sed 's/%//')

if [ -n "$pressure" ] && [ "$pressure" -lt 15 ]; then
    # Get top memory hogs
    hogs=$(ps aux | sort -nr -k 4 | head -5 | awk '{printf "%-20s %5s%% %s\n", $11, $4, $2}')
    
    # Log warning
    echo "[$(date)] HIGH MEMORY PRESSURE: ${pressure}% free" >> /tmp/memory-alerts.log
    echo "$hogs" >> /tmp/memory-alerts.log
    echo "---" >> /tmp/memory-alerts.log
    
    # Send notification if available
    if command -v osascript &> /dev/null; then
        osascript -e "display notification \"Memory pressure at ${pressure}% free. Top process: $(ps aux | sort -nr -k 4 | head -2 | tail -1 | awk '{print $11}')\" with title \"⚠️ Memory Alert\"" 2>/dev/null
    fi
fi
