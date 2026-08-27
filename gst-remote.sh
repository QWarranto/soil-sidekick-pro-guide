#!/bin/bash
# GST Remote Access Launcher
# Starts ngrok tunnel for remote mobile access

echo "🚀 Starting Gamma Storm Tracker Remote Access..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Installing..."
    brew install ngrok
fi

# Check if server is running
if ! lsof -i :8888 &> /dev/null; then
    echo "📡 Starting local server on port 8888..."
    cd /Users/reginaldrice/clawd
    nohup python3 -m http.server 8888 > /tmp/gst-server.log 2>&1 &
    sleep 2
fi

echo "🔗 Starting ngrok tunnel..."
echo "   Local: http://localhost:8888"
echo "   Public: Generating secure URL..."
echo ""

# Start ngrok and get the URL
echo "⏳ Waiting for ngrok tunnel..."
cd /Users/reginaldrice/clawd

# Start ngrok in background
ngrok http 8888 > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for tunnel to establish
sleep 3

# Get the public URL from ngrok API
for i in {1..10}; do
    URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"' | grep -o 'https://[^"]*' | head -1)
    if [ ! -z "$URL" ]; then
        break
    fi
    sleep 1
done

if [ ! -z "$URL" ]; then
    echo ""
    echo "✅ SUCCESS! Your GST is now accessible from anywhere:"
    echo ""
    echo "   📱 Mobile URL: ${URL}/gamma-storm-tracker.html"
    echo ""
    echo "   📋 COPY THIS URL TO YOUR PHONE'S BROWSER"
    echo "   🔐 This tunnel is secure (HTTPS)"
    echo ""
    echo "   💡 TIP: Screenshot this or bookmark on your phone"
    echo ""
    echo "   Press Ctrl+C to stop the tunnel"
    echo ""
else
    echo ""
    echo "⚠️  Could not get tunnel URL automatically."
    echo "   Check ngrok web interface: http://127.0.0.1:4040"
    echo ""
fi

# Keep script running
wait $NGROK_PID
