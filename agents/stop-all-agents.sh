#!/bin/bash
# Stop All Antigravity Agents
# Usage: ./stop-all-agents.sh

echo "🛑 Stopping all Antigravity agents..."

# Check for PID files and kill processes
for agent in frontend backend quant qa-docs; do
    PID_FILE="/tmp/antigravity-${agent}-agent.pid"
    if [ -f "${PID_FILE}" ]; then
        PID=$(cat "${PID_FILE}")
        if ps -p ${PID} > /dev/null 2>&1; then
            echo "  🛑 Stopping ${agent} agent (PID: ${PID})"
            kill ${PID} 2>/dev/null || kill -9 ${PID} 2>/dev/null
        fi
        rm -f "${PID_FILE}"
    fi
done

# Also check the combined PID file
if [ -f "/tmp/antigravity-all-agents.pid" ]; then
    rm -f "/tmp/antigravity-all-agents.pid"
fi

echo ""
echo "✅ All agents stopped"
