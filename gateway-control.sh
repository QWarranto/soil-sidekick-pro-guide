#!/bin/bash
# OpenClaw Gateway Management Script
# Usage: ./gateway-control.sh [status|restart|logs]

GATEWAY_URL="http://127.0.0.1:18789"
TOKEN="36cebea5cf6feb001006068c0daff6c7bc90482b505342bf"
TOKENIZED_URL="${GATEWAY_URL}/?token=${TOKEN}"

case "$1" in
  status)
    echo "Checking gateway status..."
    openclaw gateway probe
    ;;
  
  restart)
    echo "Restarting OpenClaw gateway..."
    openclaw gateway restart
    echo "Waiting for startup..."
    sleep 3
    echo "Opening dashboard..."
    open "$TOKENIZED_URL"
    ;;
  
  open)
    echo "Opening dashboard with authentication..."
    open "$TOKENIZED_URL"
    ;;
  
  logs)
    echo "Tailing gateway logs..."
    tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
    ;;
  
  fix)
    echo "Force restart and verification..."
    launchctl bootout gui/$(id -u)/ai.openclaw.gateway 2>/dev/null
    sleep 2
    launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/ai.openclaw.gateway.plist
    sleep 3
    echo "Opening dashboard..."
    open "$TOKENIZED_URL"
    ;;
  
  *)
    echo "OpenClaw Gateway Control"
    echo ""
    echo "Usage: $0 [status|restart|open|logs|fix]"
    echo ""
    echo "Commands:"
    echo "  status  - Check gateway reachability"
    echo "  restart - Restart gateway and open dashboard"
    echo "  open    - Open authenticated dashboard"
    echo "  logs    - View gateway logs"
    echo "  fix     - Force restart (if normal restart fails)"
    ;;
esac
