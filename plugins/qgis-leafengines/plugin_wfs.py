"""
WFS Extension for LeafEngines Plugin
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Extends the LeafEnginesPlugin to add WFS server functionality.
"""

from qgis.PyQt.QtCore import Qt, QTimer
from qgis.PyQt.QtGui import QIcon
from qgis.PyQt.QtWidgets import QAction, QMessageBox
from qgis.core import QgsProject, QgsMessageLog, Qgis
import os

from .plugin import LeafEnginesPlugin
from .wfs_dialog import WFSDialog
from .wfs_connection import WFSConnectionManager


class LeafEnginesWFSPlugin(LeafEnginesPlugin):
    """Extended LeafEngines Plugin with WFS Server functionality."""
    
    def __init__(self, iface):
        super().__init__(iface)
        self.wfs_actions = []
        self.wfs_dialog = None
        self.wfs_manager = WFSConnectionManager()
        self.status_timer = None
        
    def initGui(self):
        """Called when the plugin is loaded into QGIS."""
        # Initialize the base plugin GUI
        super().initGui()
        
        # Add WFS-specific menu items
        icon_path = os.path.join(self.plugin_dir, "resources", "wfs_icon.png")
        if not os.path.exists(icon_path):
            # Fall back to main icon if WFS icon doesn't exist
            icon_path = os.path.join(self.plugin_dir, "icon.png")
        
        # WFS Server Configuration action
        wfs_server_action = QAction(
            QIcon(icon_path),
            "LeafEngines: WFS Server",
            self.iface.mainWindow(),
        )
        wfs_server_action.triggered.connect(self.open_wfs_dialog)
        wfs_server_action.setStatusTip("Configure WFS Server for LeafEngines data")
        self.iface.addPluginToMenu(f"&{self.PLUGIN_NAME}", wfs_server_action)
        self.wfs_actions.append(wfs_server_action)
        
        # Add WFS Layer action
        add_wfs_layer_action = QAction(
            QIcon(icon_path),
            "LeafEngines: Add WFS Layer",
            self.iface.mainWindow(),
        )
        add_wfs_layer_action.triggered.connect(self.add_wfs_layer)
        add_wfs_layer_action.setStatusTip("Add a WFS layer from LeafEngines server")
        self.iface.addPluginToMenu(f"&{self.PLUGIN_NAME}", add_wfs_layer_action)
        self.wfs_actions.append(add_wfs_layer_action)
        
        # Add separator
        separator_action = QAction(self.iface.mainWindow())
        separator_action.setSeparator(True)
        self.iface.addPluginToMenu(f"&{self.PLUGIN_NAME}", separator_action)
        self.wfs_actions.append(separator_action)
        
        # Start status monitoring timer
        self.status_timer = QTimer()
        self.status_timer.timeout.connect(self.check_wfs_status)
        self.status_timer.start(30000)  # Check every 30 seconds
        
        QgsMessageLog.logMessage(
            "LeafEngines WFS extension loaded",
            "LeafEngines",
            Qgis.Info
        )
        
    def unload(self):
        """Called when the plugin is unloaded."""
        # Stop status timer
        if self.status_timer:
            self.status_timer.stop()
            self.status_timer = None
            
        # Close WFS dialog if open
        if self.wfs_dialog:
            self.wfs_dialog.close()
            self.wfs_dialog = None
            
        # Remove WFS menu items
        for action in self.wfs_actions:
            self.iface.removePluginMenu(f"&{self.PLUGIN_NAME}", action)
        self.wfs_actions.clear()
        
        # Unload base plugin
        super().unload()
        
        QgsMessageLog.logMessage(
            "LeafEngines WFS extension unloaded",
            "LeafEngines",
            Qgis.Info
        )
        
    def open_wfs_dialog(self):
        """Open the WFS server configuration dialog."""
        if self.wfs_dialog is None:
            self.wfs_dialog = WFSDialog(
                parent=self.iface.mainWindow(),
                manager=self.wfs_manager,
                plugin=self
            )
        self.wfs_dialog.show()
        self.wfs_dialog.raise_()
        self.wfs_dialog.activateWindow()
        
    def add_wfs_layer(self):
        """Add a WFS layer from the configured server."""
        if not self.wfs_manager.is_configured():
            QMessageBox.warning(
                self.iface.mainWindow(),
                "WFS Server Not Configured",
                "Please configure the WFS server first using 'LeafEngines: WFS Server' menu."
            )
            self.open_wfs_dialog()
            return
            
        try:
            # Get available feature types
            feature_types = self.wfs_manager.get_feature_types()
            
            if not feature_types:
                QMessageBox.warning(
                    self.iface.mainWindow(),
                    "No Feature Types Available",
                    "No feature types found on the WFS server. "
                    "Please check server configuration and ensure it's running."
                )
                return
                
            # For now, add the first available layer
            # In a more complete implementation, we'd show a dialog to select
            layer = self.wfs_manager.add_wfs_layer(feature_types[0])
            
            if layer:
                QgsProject.instance().addMapLayer(layer)
                self.iface.messageBar().pushMessage(
                    "LeafEngines WFS",
                    f"Added WFS layer: {feature_types[0]}",
                    level=Qgis.Success,
                    duration=5
                )
            else:
                self.iface.messageBar().pushMessage(
                    "LeafEngines WFS",
                    f"Failed to add WFS layer: {feature_types[0]}",
                    level=Qgis.Warning,
                    duration=5
                )
                
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Error adding WFS layer: {str(e)}",
                "LeafEngines",
                Qgis.Critical
            )
            self.iface.messageBar().pushMessage(
                "LeafEngines WFS Error",
                str(e),
                level=Qgis.Critical,
                duration=10
            )
            
    def check_wfs_status(self):
        """Check WFS server status and update UI if dialog is open."""
        if self.wfs_dialog and self.wfs_dialog.isVisible():
            self.wfs_dialog.update_status()
            
        # Also check connection status in background
        if self.wfs_manager.is_configured():
            try:
                status = self.wfs_manager.check_connection()
                if not status["connected"]:
                    QgsMessageLog.logMessage(
                        f"WFS server connection lost: {status.get('error', 'Unknown error')}",
                        "LeafEngines",
                        Qgis.Warning
                    )
            except Exception as e:
                QgsMessageLog.logMessage(
                    f"Error checking WFS status: {str(e)}",
                    "LeafEngines",
                    Qgis.Warning
                )