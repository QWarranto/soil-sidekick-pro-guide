#!/bin/bash
# Kepler Quick Access Shortcuts
# Add to ~/.zshrc or run: source /Users/reginaldrice/clawd/shortcuts.sh

# Quick OpenClaw Dashboard
alias kepler='open "http://127.0.0.1:18789/?token=36cebea5cf6feb001006068c0daff6c7bc90482b505342bf"'

# Quick status checks
alias kstatus='openclaw status'
alias kprobe='openclaw gateway probe'
alias klogs='tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log'

# Restart sequences
alias krestart='~/clawd/gateway-control.sh restart'
alias kfix='~/clawd/gateway-control.sh fix'

# Workspace navigation
alias clawd='cd ~/clawd'
alias kref='cat ~/clawd/OUTAGE_REFERENCE.txt'

# Git shortcuts for your workspace
alias kgit='cd ~/clawd && git status'
alias kcommit='cd ~/clawd && git add -A && git commit -m'
alias kpush='cd ~/clawd && git push'

# Trading/Research quick opens (customize these)
alias trading='open https://www.tradingview.com'
alias github='open https://github.com/QWarranto'

# Daily startup - opens dashboard + common tools
alias kstart='kepler && trading && github'

echo "Kepler shortcuts loaded! Try: kepler, kstatus, krestart, kref"
