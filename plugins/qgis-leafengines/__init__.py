"""
LeafEngines QGIS Plugin
~~~~~~~~~~~~~~~~~~~~~~~

Provides agricultural intelligence layers in QGIS via the LeafEngines API.
"""


def classFactory(iface):
    """QGIS plugin entry point.

    :param iface: QgisInterface — provides access to the QGIS application.
    :returns: LeafEnginesPlugin instance.
    """
    from .plugin import LeafEnginesPlugin
    return LeafEnginesPlugin(iface)
