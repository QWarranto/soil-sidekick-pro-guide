#!/bin/bash
# Launch Antigravity Agent - Quant Strategy Agent
# Usage: ./launch-quant-agent.sh

AGENT_NAME="quant-agent"
TASK_FILE="/Users/reginaldrice/clawd/agents/tasks/quant-agent-task.md"
WORKSPACE="/Users/reginaldrice/clawd"
LOG_FILE="/tmp/antigravity-${AGENT_NAME}.log"

echo "🚀 Launching Antigravity Agent: ${AGENT_NAME}"
echo "   Task: ${TASK_FILE}"
echo "   Workspace: ${WORKSPACE}"
echo "   Log: ${LOG_FILE}"
echo ""

# Check if Antigravity is running
if ! pgrep -f "Antigravity.app" > /dev/null; then
    echo "⚠️  Antigravity is not running. Starting it first..."
    open /Applications/Antigravity.app
    sleep 5
fi

# Launch agent with task file
/Applications/Antigravity.app/Contents/MacOS/Electron \
    --agent-task="${TASK_FILE}" \
    --agent-name="${AGENT_NAME}" \
    --workspace="${WORKSPACE}" \
    > "${LOG_FILE}" 2>&1 &

AGENT_PID=$!
echo "✅ Agent launched with PID: ${AGENT_PID}"
echo ""
echo "To monitor progress:"
echo "   tail -f ${LOG_FILE}"
echo ""
echo "To stop agent:"
echo "   kill ${AGENT_PID}"

# Save PID to file
echo ${AGENT_PID} > "/tmp/antigravity-${AGENT_NAME}.pid"
