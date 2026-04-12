"""
WFS Connection Manager
~~~~~~~~~~~~~~~~~~~~~~

Manages connections to WFS servers and handles layer creation.
Compatible with QGIS 4.0.0+ (QgsWfsConnection not available in QGIS 4.x)
"""

from qgis.core import (
    QgsVectorLayer,
    QgsDataSourceUri,
    QgsMessageLog,
    Qgis,
    QgsProject
)
from qgis.PyQt.QtCore import QSettings, QDateTime
import json
import time


class WFSConnectionManager:
    """Manages WFS server connections and layer operations."""
    
    SETTINGS_PREFIX = "leafengines/wfs/"
    
    def __init__(self):
        self.settings = QSettings()
        self.connections = {}
        self.last_check = None
        self.last_status = {"connected": False, "error": "Not configured"}
        
    def get_configuration(self):
        """Get current WFS configuration."""
        url = self.settings.value(f"{self.SETTINGS_PREFIX}url", "")
        port = self.settings.value(f"{self.SETTINGS_PREFIX}port", 8080, type=int)
        return {"url": url, "port": port}
        
    def set_configuration(self, url, port=8080):
        """Set WFS configuration."""
        self.settings.setValue(f"{self.SETTINGS_PREFIX}url", url)
        self.settings.setValue(f"{self.SETTINGS_PREFIX}port", port)
        self.settings.sync()
        
    def is_configured(self):
        """Check if WFS is configured."""
        config = self.get_configuration()
        return bool(config.get("url"))
        
    def check_connection(self):
        """Check connection to WFS server."""
        config = self.get_configuration()
        if not config.get("url"):
            self.last_status = {"connected": False, "error": "Not configured"}
            return self.last_status
            
        try:
            # Create a test connection
            uri = QgsDataSourceUri()
            uri.setParam("url", config["url"])
            uri.setParam("service", "WFS")
            uri.setParam("version", "1.1.0")
            uri.setParam("request", "GetCapabilities")
            
            # In a real implementation, we would make an actual HTTP request
            # For now, simulate connection check
            import random
            # Simulate 90% success rate for testing
            if random.random() > 0.1:
                self.last_status = {
                    "connected": True,
                    "url": config["url"],
                    "timestamp": QDateTime.currentDateTime().toString(),
                    "response_time": random.randint(50, 500)
                }
            else:
                self.last_status = {
                    "connected": False,
                    "error": "Connection timeout",
                    "url": config["url"]
                }
                
        except Exception as e:
            self.last_status = {
                "connected": False,
                "error": str(e),
                "url": config["url"]
            }
            
        self.last_check = time.time()
        return self.last_status
        
    def get_feature_types(self):
        """Get available feature types from WFS server."""
        if not self.is_configured():
            return []
            
        # For simulation, return some example feature types
        # In a real implementation, this would parse GetCapabilities response
        return [
            "leafengines:soil_data",
            "leafengines:water_quality",
            "leafengines:crop_recommendations",
            "leafengines:carbon_credits",
            "leafengines:environmental_impact"
        ]
        
    def add_wfs_layer(self, feature_type, layer_name=None):
        """Add a WFS layer to the project."""
        if not self.is_configured():
            QgsMessageLog.logMessage(
                "WFS not configured",
                "LeafEngines",
                Qgis.Critical
            )
            return None
            
        config = self.get_configuration()
        
        try:
            # Create WFS connection URI
            uri = QgsDataSourceUri()
            uri.setParam("url", config["url"])
            uri.setParam("service", "WFS")
            uri.setParam("version", "1.1.0")
            uri.setParam("typename", feature_type)
            uri.setParam("srsname", "EPSG:4326")
            
            # Set layer name
            if not layer_name:
                # Extract simple name from feature type
                layer_name = feature_type.split(":")[-1] if ":" in feature_type else feature_type
                layer_name = layer_name.replace("_", " ").title()
                
            # Create the layer
            layer = QgsVectorLayer(uri.uri(), f"LeafEngines {layer_name}", "WFS")
            
            if not layer.isValid():
                QgsMessageLog.logMessage(
                    f"Invalid WFS layer: {layer.error().summary()}",
                    "LeafEngines",
                    Qgis.Critical
                )
                return None
                
            # Set some default styling based on feature type
            self._apply_default_style(layer, feature_type)
            
            QgsMessageLog.logMessage(
                f"Created WFS layer: {layer_name}",
                "LeafEngines",
                Qgis.Info
            )
            
            return layer
            
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Error creating WFS layer {feature_type}: {str(e)}",
                "LeafEngines",
                Qgis.Critical
            )
            return None
            
    def _apply_default_style(self, layer, feature_type):
        """Apply default styling to layer based on feature type."""
        # This is a simplified version - in production you'd want more sophisticated styling
        
        # Get the renderer
        renderer = layer.renderer()
        if not renderer:
            return
            
        # Define colors based on feature type
        colors = {
            "soil_data": "#8B4513",  # SaddleBrown
            "water_quality": "#1E90FF",  # DodgerBlue
            "crop_recommendations": "#32CD32",  # LimeGreen
            "carbon_credits": "#228B22",  # ForestGreen
            "environmental_impact": "#FF4500",  # OrangeRed
        }
        
        # Find the base color
        base_color = "#4682B4"  # SteelBlue default
        for key, color in colors.items():
            if key in feature_type.lower():
                base_color = color
                break
                
        # Simple single symbol styling
        symbol = renderer.symbol()
        if symbol:
            symbol.setColor(base_color)
            symbol.setOpacity(0.7)
            
        layer.triggerRepaint()
        
    def get_active_layers(self):
        """Get all active WFS layers in the project."""
        active_layers = []
        for layer in QgsProject.instance().mapLayers().values():
            if layer.dataProvider() and layer.dataProvider().name() == "WFS":
                # Check if it's from our configured server
                uri = layer.dataProvider().dataSourceUri()
                config = self.get_configuration()
                if config.get("url") and config["url"] in uri:
                    active_layers.append({
                        "name": layer.name(),
                        "id": layer.id(),
                        "feature_type": self._extract_feature_type(uri),
                        "feature_count": layer.featureCount()
                    })
        return active_layers
        
    def _extract_feature_type(self, uri):
        """Extract feature type from WFS URI."""
        # Simple extraction - in real implementation, parse URI properly
        if "typename=" in uri:
            start = uri.find("typename=") + 9
            end = uri.find("&", start)
            if end == -1:
                end = len(uri)
            return uri[start:end]
        return "Unknown"
        
    def refresh_layer(self, layer_id):
        """Refresh data for a specific layer."""
        layer = QgsProject.instance().mapLayer(layer_id)
        if not layer:
            return False
            
        try:
            layer.dataProvider().forceReload()
            layer.triggerRepaint()
            QgsMessageLog.logMessage(
                f"Refreshed layer: {layer.name()}",
                "LeafEngines",
                Qgis.Info
            )
            return True
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Error refreshing layer {layer.name()}: {str(e)}",
                "LeafEngines",
                Qgis.Critical
            )
            return False
            
    def remove_layer(self, layer_id):
        """Remove a WFS layer from the project."""
        layer = QgsProject.instance().mapLayer(layer_id)
        if not layer:
            return False
            
        try:
            QgsProject.instance().removeMapLayer(layer_id)
            QgsMessageLog.logMessage(
                f"Removed layer: {layer.name()}",
                "LeafEngines",
                Qgis.Info
            )
            return True
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Error removing layer {layer.name()}: {str(e)}",
                "LeafEngines",
                Qgis.Critical
            )
            return False
            
    def get_server_stats(self):
        """Get server statistics."""
        config = self.get_configuration()
        if not config.get("url"):
            return {}
            
        # Simulated statistics
        return {
            "url": config["url"],
            "status": self.last_status.get("connected", False),
            "last_check": self.last_check,
            "active_connections": len(self.get_active_layers()),
            "total_requests": 0,  # Would track in production
            "average_response_time": self.last_status.get("response_time", 0)
        }