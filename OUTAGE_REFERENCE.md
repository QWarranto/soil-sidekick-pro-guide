# 🔭 Kepler - OpenClaw Outage Reference

**Quick fixes when things break**

---

## 📍 Essential Info

| Item | Value |
|------|-------|
| **Dashboard** | http://127.0.0.1:18789/ |
| **Token URL** | http://127.0.0.1:18789/?token=36cebea5cf6feb001006068c0daff6c7bc90482b505342bf |
| **Workspace** | /Users/reginaldrice/clawd |
| **Telegram** | @EriduofSumer (remote backup) |

---

## 🚨 Scenarios

### Browser Shows "Disconnected"
```bash
./gateway-control.sh restart
```
*If that fails:*
```bash
./gateway-control.sh fix
```

### Telegram Stops Responding
```bash
openclaw gateway restart
```

### WhatsApp 408 Errors
Auto-heals in ~30 seconds, or:
```bash
openclaw gateway restart
```

### Total System Failure
```bash
./gateway-control.sh fix
```

---

## 🔍 Diagnostics

| Command | Purpose |
|---------|---------|
| `./gateway-control.sh status` | Quick health check |
| `./gateway-control.sh open` | Open authenticated dashboard |
| `./gateway-control.sh logs` | Watch live logs |
| `openclaw status` | Full system overview |
| `openclaw gateway probe` | Test connectivity |

---

*Last updated: 2026-01-31*
