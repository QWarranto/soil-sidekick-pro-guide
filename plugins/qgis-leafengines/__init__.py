"""
LeafEngines QGIS Plugin
~~~~~~~~~~~~~~~~~~~~~~~

Provides agricultural intelligence layers in QGIS via the LeafEngines API.
Includes optional WFS server functionality for data sharing.
"""

import traceback
from qgis.core import QgsMessageLog, Qgis


def classFactory(iface):
    """QGIS plugin entry point.

    :param iface: QgisInterface — provides access to the QGIS application.
    :returns: LeafEnginesPlugin instance.
    """
    try:
        # Try to load the full plugin with WFS extension
        from .plugin_wfs import LeafEnginesWFSPlugin
        QgsMessageLog.logMessage(
            "LeafEngines plugin loaded with WFS extension",
            "LeafEngines",
            Qgis.Info
        )
        return LeafEnginesWFSPlugin(iface)
    except ImportError as e:
        # WFS extension failed, load basic plugin
        QgsMessageLog.logMessage(
            f"WFS extension unavailable, loading basic plugin: {str(e)}",
            "LeafEngines",
            Qgis.Warning
        )
        from .plugin import LeafEnginesPlugin
        return LeafEnginesPlugin(iface)
    except Exception as e:
        # Any other error, load basic plugin
        QgsMessageLog.logMessage(
            f"Error loading WFS extension, falling back to basic plugin: {str(e)}",
            "LeafEngines",
            Qgis.Critical
        )
        from .plugin import LeafEnginesPlugin
        return LeafEnginesPlugin(iface)
