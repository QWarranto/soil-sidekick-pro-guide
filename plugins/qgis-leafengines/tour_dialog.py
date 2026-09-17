"""
Interactive Tour Dialog — walks new users through the 5 capability layers
of the LeafEngines QGIS plugin (matches docs/workflows/12_QGIS_SDK_DEEP_DIVE.md).

Pure-PyQt, no external dependencies beyond what QGIS already ships.
"""

from qgis.PyQt.QtCore import Qt, QSettings, QUrl
from qgis.PyQt.QtGui import QPixmap, QFont, QDesktopServices
from qgis.PyQt.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QProgressBar, QCheckBox, QFrame, QSizePolicy, QSpacerItem,
)


# ---------------------------------------------------------------------------
# Tour content — single source of truth, mirrors workflow 12
# ---------------------------------------------------------------------------

TOUR_STEPS = [
    {
        "title": "Welcome to LeafEngines for QGIS",
        "subtitle": "5-minute tour of the full SDK inside QGIS",
        "body": (
            "Most QGIS users install this plugin, run one soil query, and stop. "
            "That's like buying a sports car and only driving it to the mailbox.\n\n"
            "This tour shows you the five capability layers that turn QGIS into "
            "the cockpit for the entire LeafEngines SDK:\n\n"
            "  1. Bring-your-own data via WFS (any region)\n"
            "  2. Fuse your data with agricultural intelligence\n"
            "  3. Run AI offline — no internet required\n"
            "  4. Round-trip prescriptions to your tractor\n"
            "  5. Drive everything from an AI agent (MCP)\n\n"
            "Click Next to begin."
        ),
        "tier": "Free",
        "action_label": None,
        "action_url": None,
    },
    {
        "title": "Layer 1 — Bring Your Own Data (WFS)",
        "subtitle": "Geography-agnostic. Works in 🇺🇸 🇳🇱 🇬🇧 🇫🇷 🇯🇵 and more.",
        "body": (
            "The plugin is NOT US-only. Any OGC-compliant WFS source works "
            "as your base layer — LeafEngines just adds intelligence on top.\n\n"
            "Examples:\n"
            "  • 🇳🇱 PDOK BRP crop parcels\n"
            "  • 🇬🇧 DEFRA MAGIC, BGS Soilscapes\n"
            "  • 🇫🇷 IGN Géoportail RPG parcels\n"
            "  • 🇺🇸 USDA NRCS Soil Data Mart\n\n"
            "Open: Plugins → LeafEngines → WFS Server → Test Connection → "
            "Add Selected Layers."
        ),
        "tier": "Free",
        "action_label": "Open WFS Connection Dialog",
        "action_url": "leafengines://open/wfs",
    },
    {
        "title": "Layer 2 — Fuse Data with Intelligence",
        "subtitle": "Enrich any selected polygon with FarmIQ insights",
        "body": (
            "With one or more polygons selected, run SDK endpoints against the "
            "features. Results write back into the layer's attribute table as "
            "new columns (le_ph, le_risk_score, le_recommendation, …) — "
            "symbolize by any of them.\n\n"
            "Endpoints available:\n"
            "  • get-soil-data — pH, OM, texture, CEC (Free)\n"
            "  • agricultural-intelligence — FarmIQ insights (Starter+)\n"
            "  • multi-parameter-planting-calendar (Starter+)\n"
            "  • territorial-water-quality — EPA / EEA WISE (Starter+)\n"
            "  • environmental-impact-engine — runoff, biodiversity (Pro)"
        ),
        "tier": "Starter+",
        "action_label": "Open Soil Tab",
        "action_url": "leafengines://open/soil",
    },
    {
        "title": "Layer 3 — Offline AI Inside QGIS",
        "subtitle": "On-device Gemma model. No internet required.",
        "body": (
            "LeafEngines ships an on-device Gemma model that runs entirely in "
            "the plugin's Python process — perfect for field laptops with no "
            "signal.\n\n"
            "Modes:\n"
            "  • Cloud (gpt5-chat): ~1-3 s — needs network\n"
            "  • Local Gemma 2B: ~2-5 s — no network (Free)\n"
            "  • Local Gemma 7B + TurboQuant: ~3-8 s — no network (Pro+)\n\n"
            "Enable: Settings → Local AI → Enable On-Device Mode. First "
            "launch downloads ~600 MB and caches it forever.\n\n"
            "🔒 Privacy advantage: EU and defense customers can run the entire "
            "workflow without a single byte leaving the machine."
        ),
        "tier": "Free (2B) · Pro (7B)",
        "action_label": "Open Settings",
        "action_url": "leafengines://open/settings",
    },
    {
        "title": "Layer 4 — Round-Trip to Equipment",
        "subtitle": "Export VRT prescriptions in ISOBUS / ADAPT / Shapefile",
        "body": (
            "Turn your enriched QGIS layer into a prescription map your tractor "
            "understands.\n\n"
            "Formats:\n"
            "  • ISOBUS TASKDATA.XML — John Deere, Case IH, AGCO, Trimble\n"
            "  • ADAPT 1.0 — FieldView, AgLeader SMS, Trimble Ag\n"
            "  • Shapefile (zoned) — legacy controllers\n"
            "  • GeoJSON — custom integrations\n\n"
            "Plugin calls generate-vrt-prescription + isobus-task and writes the "
            "result to disk, ready for a USB stick.\n\n"
            "Imports of yield / as-applied data go the other way too."
        ),
        "tier": "Pro+",
        "action_label": "Open Export Dialog",
        "action_url": "leafengines://open/export",
    },
    {
        "title": "Layer 5 — Drive QGIS from an AI Agent",
        "subtitle": "Claude, ChatGPT, or Composio can call the SDK for you",
        "body": (
            "LeafEngines exposes an MCP server so AI agents can call the same "
            "endpoints the plugin uses — and write results back into your QGIS "
            "project automatically.\n\n"
            "Example prompt to Claude:\n"
            "  \"For every parcel in my QGIS layer brp_2025_selected, get the "
            "soil pH, recommend a cover crop, and write the recommendation back "
            "as an attribute. Flag any parcel within 100 m of surface water.\"\n\n"
            "The agent calls MCP tools, the plugin polls for results, your "
            "attribute table fills in automatically.\n\n"
            "🤖 Composio.dev integration available on Enterprise — chain "
            "LeafEngines tools with 250+ other SaaS tools."
        ),
        "tier": "Pro+ · Enterprise (Composio)",
        "action_label": "View MCP Documentation",
        "action_url": "https://app.soilsidekickpro.com/mcp-documentation",
    },
    {
        "title": "You're Ready 🎉",
        "subtitle": "10-minute demo script to try right now",
        "body": (
            "Try the full loop:\n\n"
            "  1. Connect PDOK WFS → pull 200 Dutch parcels\n"
            "  2. Select 5 parcels → run agricultural-intelligence\n"
            "  3. Disconnect Wi-Fi → run local Gemma\n"
            "  4. Export ISOBUS TASKDATA → drag onto a virtual John Deere display\n"
            "  5. Ask Claude: \"Find the riskiest parcel and explain why.\"\n\n"
            "That's the full SDK, surfaced through QGIS, in ten minutes.\n\n"
            "Need help? partnerships@leafengines.com"
        ),
        "tier": "All tiers",
        "action_label": "Read Full Workflow",
        "action_url": "https://app.soilsidekickpro.com/api-docs",
    },
]

SETTINGS_KEY_DONT_SHOW = "leafengines/tour_dont_show_again"
SETTINGS_KEY_LAST_STEP = "leafengines/tour_last_step"


# ---------------------------------------------------------------------------
# Dialog
# ---------------------------------------------------------------------------

class LeafEnginesTourDialog(QDialog):
    """Multi-step tour dialog with progress bar, tier badge, and deep-link actions."""

    def __init__(self, parent=None, plugin=None):
        super().__init__(parent)
        self.plugin = plugin  # reference back to LeafEnginesPlugin for deep links
        self.current_step = 0
        self.settings = QSettings()

        self.setWindowTitle("LeafEngines — Interactive Tour")
        self.setMinimumSize(560, 480)
        self.setModal(False)

        self._build_ui()
        self._render_step()

    # ----- UI construction -------------------------------------------------

    def _build_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(20, 20, 20, 16)
        root.setSpacing(12)

        # Header (title + tier badge)
        header = QHBoxLayout()
        self.title_label = QLabel()
        title_font = QFont()
        title_font.setPointSize(14)
        title_font.setBold(True)
        self.title_label.setFont(title_font)
        self.title_label.setWordWrap(True)
        header.addWidget(self.title_label, stretch=1)

        self.tier_badge = QLabel()
        self.tier_badge.setStyleSheet(
            "background-color: #2d6a4f; color: white; "
            "padding: 4px 10px; border-radius: 10px; font-weight: bold;"
        )
        self.tier_badge.setAlignment(Qt.AlignCenter)
        header.addWidget(self.tier_badge, stretch=0)
        root.addLayout(header)

        # Subtitle
        self.subtitle_label = QLabel()
        self.subtitle_label.setStyleSheet("color: #555; font-style: italic;")
        self.subtitle_label.setWordWrap(True)
        root.addWidget(self.subtitle_label)

        # Separator
        sep = QFrame()
        sep.setFrameShape(QFrame.HLine)
        sep.setFrameShadow(QFrame.Sunken)
        root.addWidget(sep)

        # Body
        self.body_label = QLabel()
        self.body_label.setWordWrap(True)
        self.body_label.setTextFormat(Qt.PlainText)
        self.body_label.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        self.body_label.setAlignment(Qt.AlignTop | Qt.AlignLeft)
        self.body_label.setStyleSheet("font-size: 11pt; line-height: 1.4;")
        root.addWidget(self.body_label, stretch=1)

        # Action button (deep link / external URL)
        self.action_button = QPushButton()
        self.action_button.setStyleSheet(
            "QPushButton { background-color: #1e6091; color: white; "
            "padding: 8px 16px; border-radius: 4px; font-weight: bold; }"
            "QPushButton:hover { background-color: #2a7ab0; }"
        )
        self.action_button.clicked.connect(self._on_action_clicked)
        root.addWidget(self.action_button)

        # Progress bar
        self.progress = QProgressBar()
        self.progress.setMaximum(len(TOUR_STEPS) - 1)
        self.progress.setTextVisible(True)
        self.progress.setFormat("Step %v of %m")
        root.addWidget(self.progress)

        # Footer (don't show again + nav buttons)
        footer = QHBoxLayout()
        self.dont_show_cb = QCheckBox("Don't show on startup")
        self.dont_show_cb.setChecked(
            self.settings.value(SETTINGS_KEY_DONT_SHOW, False, type=bool)
        )
        self.dont_show_cb.toggled.connect(self._on_dont_show_toggled)
        footer.addWidget(self.dont_show_cb)
        footer.addItem(QSpacerItem(20, 0, QSizePolicy.Expanding, QSizePolicy.Minimum))

        self.back_button = QPushButton("← Back")
        self.back_button.clicked.connect(self._on_back)
        footer.addWidget(self.back_button)

        self.next_button = QPushButton("Next →")
        self.next_button.setDefault(True)
        self.next_button.clicked.connect(self._on_next)
        footer.addWidget(self.next_button)

        self.close_button = QPushButton("Close")
        self.close_button.clicked.connect(self.accept)
        footer.addWidget(self.close_button)

        root.addLayout(footer)

    # ----- Step rendering --------------------------------------------------

    def _render_step(self):
        step = TOUR_STEPS[self.current_step]
        self.title_label.setText(step["title"])
        self.subtitle_label.setText(step["subtitle"])
        self.body_label.setText(step["body"])
        self.tier_badge.setText(step["tier"])

        # Action button visibility
        if step["action_label"]:
            self.action_button.setText(step["action_label"])
            self.action_button.setVisible(True)
        else:
            self.action_button.setVisible(False)

        # Progress + nav state
        self.progress.setValue(self.current_step)
        self.back_button.setEnabled(self.current_step > 0)

        is_last = self.current_step == len(TOUR_STEPS) - 1
        self.next_button.setText("Finish ✓" if is_last else "Next →")

        # Persist progress so re-opening resumes
        self.settings.setValue(SETTINGS_KEY_LAST_STEP, self.current_step)

    # ----- Slots -----------------------------------------------------------

    def _on_next(self):
        if self.current_step < len(TOUR_STEPS) - 1:
            self.current_step += 1
            self._render_step()
        else:
            self.accept()

    def _on_back(self):
        if self.current_step > 0:
            self.current_step -= 1
            self._render_step()

    def _on_dont_show_toggled(self, checked):
        self.settings.setValue(SETTINGS_KEY_DONT_SHOW, checked)

    def _on_action_clicked(self):
        url = TOUR_STEPS[self.current_step]["action_url"]
        if not url:
            return

        # Internal deep link: leafengines://open/<target>
        if url.startswith("leafengines://"):
            target = url.replace("leafengines://open/", "")
            self._dispatch_internal(target)
        else:
            QDesktopServices.openUrl(QUrl(url))

    # ----- Internal dispatch ----------------------------------------------

    def _dispatch_internal(self, target):
        """Open the requested plugin surface. Falls back gracefully if the
        plugin reference or the requested surface is unavailable."""
        if self.plugin is None:
            return

        try:
            if target == "wfs":
                # WFS dialog (only available when WFS extension loaded)
                if hasattr(self.plugin, "open_wfs_dialog"):
                    self.plugin.open_wfs_dialog()
            elif target == "soil":
                # Open main dialog on Soil tab
                if hasattr(self.plugin, "run"):
                    self.plugin.run()
                    if hasattr(self.plugin, "dialog") and self.plugin.dialog:
                        # Tab index 0 = Soil in dialog.py
                        if hasattr(self.plugin.dialog, "tabs"):
                            self.plugin.dialog.tabs.setCurrentIndex(0)
            elif target == "settings":
                if hasattr(self.plugin, "run"):
                    self.plugin.run()
                    if hasattr(self.plugin, "dialog") and self.plugin.dialog:
                        if hasattr(self.plugin.dialog, "tabs"):
                            # Settings is the last tab
                            tabs = self.plugin.dialog.tabs
                            tabs.setCurrentIndex(tabs.count() - 1)
            elif target == "export":
                # Export dialog not yet wired — open main dialog as fallback
                if hasattr(self.plugin, "run"):
                    self.plugin.run()
        except Exception:
            # Never let a dispatch error break the tour
            import traceback
            from qgis.core import QgsMessageLog, Qgis
            QgsMessageLog.logMessage(
                f"Tour deep-link dispatch failed for '{target}':\n{traceback.format_exc()}",
                "LeafEngines",
                Qgis.Warning,
            )

    # ----- Class helpers ---------------------------------------------------

    @classmethod
    def should_auto_show(cls):
        """Return True if the tour should auto-open on plugin load."""
        return not QSettings().value(SETTINGS_KEY_DONT_SHOW, False, type=bool)

    @classmethod
    def reset(cls):
        """Clear all tour preferences — useful for QA / 'Show tour again' menu."""
        s = QSettings()
        s.remove(SETTINGS_KEY_DONT_SHOW)
        s.remove(SETTINGS_KEY_LAST_STEP)
