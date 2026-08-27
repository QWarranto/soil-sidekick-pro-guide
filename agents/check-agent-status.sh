#!/bin/bash
# Check Status of All Antigravity Agents
# Usage: ./check-agent-status.sh

echo "📊 Antigravity Agent Status"
echo "═══════════════════════════════════════════════════════════"
echo ""

for agent in frontend backend quant qa-docs; do
    PID_FILE="/tmp/antigravity-${agent}-agent.pid"
    LOG_FILE="/tmp/antigravity-${agent}-agent.log"
    
    echo "🎨 ${agent^^} AGENT"
    echo "─────────────────────────────────────────────────────────"
    
    if [ -f "${PID_FILE}" ]; then
        PID=$(cat "${PID_FILE}")
        if ps -p ${PID} > /dev/null 2>&1; then
            echo "  Status: 🟢 RUNNING (PID: ${PID})"
        else
            echo "  Status: 🔴 STOPPED (PID: ${PID} not found)"
        fi
    else
        echo "  Status: ⚪ NOT LAUNCHED"
    fi
    
    if [ -f "${LOG_FILE}" ]; then
        LINES=$(wc -l < "${LOG_FILE}")
        LAST_UPDATE=$(stat -f "%Sm" -t "%H:%M:%S" "${LOG_FILE}" 2>/dev/null || echo "unknown")
        echo "  Log Lines: ${LINES}"
        echo "  Last Update: ${LAST_UPDATE}"
        echo "  Log File: ${LOG_FILE}"
    fi
    
    echo ""
done

echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Quick Commands:"
echo "  View all logs:  tail -f /tmp/antigravity-*-agent.log"
echo "  Stop all:       ./agents/stop-all-agents.sh"
echo "  Relaunch:       ./agents/launch-all-agents.sh"
