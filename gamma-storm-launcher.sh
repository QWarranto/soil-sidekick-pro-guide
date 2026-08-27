#!/bin/bash
# Gamma Storm Tracker Launcher
# Starts local server and opens browser

echo "🚀 Starting Gamma Storm Tracker..."
echo ""

# Check if already running
if lsof -i :8888 &> /dev/null; then
    echo "✅ Server already running on port 8888"
else
    echo "📡 Starting server..."
    cd /Users/reginaldrice/clawd
    nohup python3 -m http.server 8888 > /tmp/gst-server.log 2>&1 &
    sleep 1
fi

echo ""
echo "🌐 Opening browser..."
echo ""

# Open browser
open "http://localhost:8888/gamma-storm-tracker.html"

echo "✅ GST is ready!"
echo ""
echo "   Local:    http://localhost:8888/gamma-storm-tracker.html"
echo "   Mobile:   http://192.168.1.151:8888/gamma-storm-tracker.html"
echo ""
echo "For remote access, run: gstremote"
echo ""
