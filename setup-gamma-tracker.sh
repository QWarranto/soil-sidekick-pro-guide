#!/bin/bash
# Gamma Storm Tracker Setup
# Automates your gamma monitoring system

echo "🔧 GAMMA STORM TRACKER SETUP"
echo "============================="
echo ""

# Make scripts executable
echo "Making scripts executable..."
chmod +x /Users/reginaldrice/clawd/gamma-*.sh

# Create cron job for automated scanning
echo "Setting up automated gamma scanning..."

# Add cron job (runs every 15 minutes during market hours)
(crontab -l 2>/dev/null; echo "# Gamma Storm Tracker - runs every 15 minutes 9:30-16:00 EST") | crontab -
(crontab -l 2>/dev/null; echo "*/15 9-16 * * 1-5 /Users/reginaldrice/clawd/gamma-storm-tracker.sh >> /Users/reginaldrice/clawd/gamma-alerts.log 2>&1") | crontab -

echo "✅ Cron job added: Gamma scanning every 15 minutes during market hours"
echo "   Logs: ~/clawd/gamma-alerts.log"
echo ""

# Create a simple alias for quick access
echo "Adding terminal shortcuts..."
cat >> ~/.zshrc << 'EOF'

# Gamma Storm Tracker shortcuts
alias gammastorm='~/clawd/gamma-storm-tracker.sh'
alias gammademo='~/clawd/gamma-demo.sh'
alias gammaalerts='tail -f ~/clawd/gamma-alerts.log'
EOF

echo "✅ Shortcuts added:"
echo "   gammastorm - Run full gamma scan"
echo "   gammademo  - Quick demo scan"
echo "   gammaalerts - View gamma alerts log"
echo ""

echo "🔧 NEXT STEPS:"
echo "1. Reload shell: source ~/.zshrc"
echo "2. Test with: gammademo"
echo "3. Replace sample data with real gamma API calls"
echo "4. Customize thresholds in gamma-storm-tracker.sh"
echo "5. Monitor alerts: gammaalerts"
echo ""
echo "📚 Integration Guide:"
echo "   • Replace analyze_gamma() function with your gamma data API"
echo "   • Add your actual symbols from watchlist files"
echo "   • Set custom thresholds based on your trading criteria"
echo "   • Consider adding email/Slack notifications for alerts"
echo ""
echo "✅ Setup complete! Your gamma storm tracking system is ready."
