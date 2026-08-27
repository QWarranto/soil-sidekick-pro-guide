#!/bin/bash
# Launch All 4 Antigravity Agents in Parallel
# Gamma Storm Tracker v2.0 Sprint
# Usage: ./launch-all-agents.sh

set -e

WORKSPACE="/Users/reginaldrice/clawd"
AGENTS_DIR="${WORKSPACE}/agents"

echo "═══════════════════════════════════════════════════════════"
echo "  GAMMA STORM TRACKER v2.0 - Multi-Agent Sprint Launch"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Workspace: ${WORKSPACE}"
echo "Agents: 4 parallel agents"
echo "Estimated Duration: 24-32 hours"
echo ""

# Check if Antigravity is running
echo "🔍 Checking Antigravity status..."
if ! pgrep -f "Antigravity.app" > /dev/null; then
    echo "⚠️  Antigravity is not running. Starting it..."
    open /Applications/Antigravity.app
    sleep 5
    echo "✅ Antigravity started"
else
    echo "✅ Antigravity is running"
fi
echo ""

# Make all scripts executable
chmod +x ${AGENTS_DIR}/launch-*.sh

# Launch all 4 agents in parallel
echo "🚀 Launching 4 agents in parallel..."
echo ""

# Agent 1: Frontend
${AGENTS_DIR}/launch-frontend-agent.sh > /tmp/agent-launch-frontend.log 2>&1 &
AGENT1_PID=$!
echo "  🎨 Frontend Agent       → PID: ${AGENT1_PID}"

# Agent 2: Backend
${AGENTS_DIR}/launch-backend-agent.sh > /tmp/agent-launch-backend.log 2>&1 &
AGENT2_PID=$!
echo "  💾 Backend Agent        → PID: ${AGENT2_PID}"

# Agent 3: Quant
${AGENTS_DIR}/launch-quant-agent.sh > /tmp/agent-launch-quant.log 2>&1 &
AGENT3_PID=$!
echo "  📊 Quant Agent          → PID: ${AGENT3_PID}"

# Agent 4: QA/Docs
${AGENTS_DIR}/launch-qa-docs-agent.sh > /tmp/agent-launch-qa-docs.log 2>&1 &
AGENT4_PID=$!
echo "  🧪 QA/Docs Agent        → PID: ${AGENT4_PID}"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ ALL 4 AGENTS LAUNCHED"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Save all PIDs
echo "${AGENT1_PID} ${AGENT2_PID} ${AGENT3_PID} ${AGENT4_PID}" > /tmp/antigravity-all-agents.pid

# Display monitoring commands
echo "Monitor Agent Progress:"
echo "───────────────────────────────────────────────────────────"
echo "Frontend Agent:    tail -f /tmp/antigravity-frontend-agent.log"
echo "Backend Agent:     tail -f /tmp/antigravity-backend-agent.log"
echo "Quant Agent:       tail -f /tmp/antigravity-quant-agent.log"
echo "QA/Docs Agent:     tail -f /tmp/antigravity-qa-docs-agent.log"
echo ""
echo "Stop All Agents:"
echo "───────────────────────────────────────────────────────────"
echo "  ./agents/stop-all-agents.sh"
echo ""
echo "Check Agent Status:"
echo "───────────────────────────────────────────────────────────"
echo "  ./agents/check-agent-status.sh"
echo ""
echo "Estimated Completion: $(date -v+32H '+%Y-%m-%d %H:%M')"
echo ""
echo "🎯 Sprint deliverables will appear in: ${WORKSPACE}/v2.0/"
echo ""
