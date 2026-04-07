"""
Main plugin class — handles toolbar, menu, and dialog lifecycle.
"""

from qgis.PyQt.QtCore import Qt
from qgis.PyQt.QtGui import QIcon
from qgis.PyQt.QtWidgets import QAction, QMessageBox
from qgis.core import QgsProject

import os

from .dialog import LeafEnginesDialog
from .api_client import LeafEnginesClient
from .layer_factory import LayerFactory


class LeafEnginesPlugin:
    """QGIS Plugin — LeafEngines Agricultural Intelligence."""

    PLUGIN_NAME = "LeafEngines"

    def __init__(self, iface):
        self.iface = iface
        self.plugin_dir = os.path.dirname(__file__)
        self.toolbar = None
        self.actions = []
        self.dialog = None
        self.client = LeafEnginesClient()
        self.layer_factory = LayerFactory()

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def initGui(self):
        """Called when the plugin is loaded into QGIS."""
        self.toolbar = self.iface.addToolBar(self.PLUGIN_NAME)
        self.toolbar.setObjectName(self.PLUGIN_NAME)

        # Main action
        icon_path = os.path.join(self.plugin_dir, "icon.png")
        action = QAction(
            QIcon(icon_path),
            "LeafEngines: Agricultural Intelligence",
            self.iface.mainWindow(),
        )
        action.triggered.connect(self.run)
        action.setStatusTip("Query soil, water, and crop data for any US county")

        self.toolbar.addAction(action)
        self.iface.addPluginToMenu(f"&{self.PLUGIN_NAME}", action)
        self.actions.append(action)

        # Quick soil query via map click
        soil_action = QAction(
            QIcon(icon_path),
            "LeafEngines: Soil Query (Map Click)",
            self.iface.mainWindow(),
        )
        soil_action.triggered.connect(self.activate_map_click)
        self.iface.addPluginToMenu(f"&{self.PLUGIN_NAME}", soil_action)
        self.actions.append(soil_action)

    def unload(self):
        """Called when the plugin is unloaded."""
        for action in self.actions:
            self.iface.removePluginMenu(f"&{self.PLUGIN_NAME}", action)
            self.iface.removeToolBarIcon(action)
        if self.toolbar:
            del self.toolbar

    # ------------------------------------------------------------------
    # Main dialog
    # ------------------------------------------------------------------

    def run(self):
        """Open the main LeafEngines dialog."""
        if self.dialog is None:
            self.dialog = LeafEnginesDialog(
                parent=self.iface.mainWindow(),
                client=self.client,
                layer_factory=self.layer_factory,
            )
        self.dialog.show()
        self.dialog.raise_()
        self.dialog.activateWindow()

    # ------------------------------------------------------------------
    # Map-click soil query
    # ------------------------------------------------------------------

    def activate_map_click(self):
        """Enable map-click mode: click anywhere on the canvas to query soil."""
        from .map_tool import SoilQueryMapTool

        self.map_tool = SoilQueryMapTool(
            canvas=self.iface.mapCanvas(),
            client=self.client,
            layer_factory=self.layer_factory,
        )
        self.iface.mapCanvas().setMapTool(self.map_tool)
        self.iface.messageBar().pushMessage(
            self.PLUGIN_NAME,
            "Click on the map to query soil data for that location.",
            level=0,
            duration=5,
        )
