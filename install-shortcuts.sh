#!/bin/bash
# Install Kepler shortcuts to shell
# Run: ./install-shortcuts.sh

SHORTCUTS_FILE="/Users/reginaldrice/clawd/shortcuts.sh"
SHELL_RC="$HOME/.zshrc"

# Check if already installed
if grep -q "Kepler Quick Access Shortcuts" "$SHELL_RC" 2>/dev/null; then
    echo "Shortcuts already installed in $SHELL_RC"
    echo "Reload with: source $SHELL_RC"
    exit 0
fi

# Add to .zshrc
echo "" >> "$SHELL_RC"
echo "# Kepler Quick Access Shortcuts" >> "$SHELL_RC"
echo "source $SHORTCUTS_FILE" >> "$SHELL_RC"

echo "✅ Shortcuts installed!"
echo ""
echo "Reload your shell: source ~/.zshrc"
echo ""
echo "Available shortcuts:"
echo "  kepler    - Open dashboard"
echo "  kstatus   - Check system status"
echo "  krestart  - Restart gateway"
echo "  kfix      - Nuclear restart"
echo "  kref      - Show outage reference"
echo "  clawd     - Cd to workspace"
echo "  kgit      - Git status in workspace"
echo "  trading   - Open TradingView"
echo "  github    - Open your GitHub"
echo "  kstart    - Dashboard + TradingView + GitHub"
