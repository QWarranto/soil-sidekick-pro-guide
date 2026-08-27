#!/bin/bash
# Antigravity CLI Wrapper for OpenClaw Integration
# Usage: antigravity-cli <command> [args]

ANTIGRAVITY_APP="/Applications/Antigravity.app/Contents/MacOS/Electron"
WORKSPACE_DIR="/Users/reginaldrice/clawd"
LOG_FILE="/tmp/antigravity.log"
ARTIFACTS_DIR="$HOME/.antigravity/artifacts"

# Ensure Antigravity is running
ensure_running() {
  if ! pgrep -f "Antigravity.app" > /dev/null; then
    echo "Starting Antigravity..."
    $ANTIGRAVITY_APP $WORKSPACE_DIR > $LOG_FILE 2>&1 &
    sleep 5
  fi
}

# Main command handler
case "$1" in
  status)
    if pgrep -f "Antigravity.app" > /dev/null; then
      echo "✅ Antigravity is running"
      echo "Workspace: $WORKSPACE_DIR"
      echo "Log: $LOG_FILE"
      echo "PID: $(pgrep -f "Antigravity.app" | head -1)"
    else
      echo "❌ Antigravity is not running"
    fi
    ;;
  
  start)
    ensure_running
    echo "✅ Antigravity started"
    ;;
  
  stop)
    pkill -f "Antigravity.app"
    echo "✅ Antigravity stopped"
    ;;
  
  restart)
    pkill -f "Antigravity.app"
    sleep 2
    $ANTIGRAVITY_APP $WORKSPACE_DIR > $LOG_FILE 2>&1 &
    sleep 3
    echo "✅ Antigravity restarted"
    ;;
  
  log)
    tail -f $LOG_FILE
    ;;
  
  artifacts)
    if [ -d "$ARTIFACTS_DIR" ]; then
      ls -lt "$ARTIFACTS_DIR" | head -20
    else
      echo "No artifacts directory found"
    fi
    ;;
  
  agent)
    # This would trigger an agent task via Antigravity's API
    # For now, we document the intent
    echo "🤖 Agent command: ${2:-'No task specified'}"
    echo "To run an agent task:"
    echo "  1. Open Antigravity GUI"
    echo "  2. Use Agent Manager to create task"
    echo "  3. Task: $2"
    ;;
  
  help|*)
    echo "Antigravity CLI Wrapper"
    echo ""
    echo "Commands:"
    echo "  status     - Check if Antigravity is running"
    echo "  start      - Start Antigravity with workspace"
    echo "  stop       - Stop Antigravity"
    echo "  restart    - Restart Antigravity"
    echo "  log        - View live log output"
    echo "  artifacts  - List recent artifacts"
    echo "  agent      - Document agent task (requires GUI)"
    echo "  help       - Show this help"
    ;;
esac
