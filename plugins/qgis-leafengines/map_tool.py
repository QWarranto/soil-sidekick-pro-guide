"""
Map tool: click on the canvas to query soil data at that point.

Reverse-geocodes the click to a FIPS code via county_lookup,
then fetches soil data and adds it as a styled layer.
"""

from qgis.PyQt.QtCore import Qt
from qgis.gui import QgsMapTool, QgsMapToolEmitPoint
from qgis.core import QgsCoordinateReferenceSystem, QgsCoordinateTransform, QgsProject

from .api_client import LeafEnginesClient
from .layer_factory import LayerFactory


class SoilQueryMapTool(QgsMapToolEmitPoint):
    """Click-to-query map tool."""

    def __init__(self, canvas, client: LeafEnginesClient, layer_factory: LayerFactory):
        super().__init__(canvas)
        self.client = client
        self.layer_factory = layer_factory
        self.setCursor(Qt.CrossCursor)

    def canvasReleaseEvent(self, event):
        """Handle map click → query soil at clicked location."""
        point = self.toMapCoordinates(event.pos())

        # Transform to EPSG:4326 if needed
        canvas_crs = self.canvas().mapSettings().destinationCrs()
        wgs84 = QgsCoordinateReferenceSystem("EPSG:4326")
        if canvas_crs != wgs84:
            transform = QgsCoordinateTransform(
                canvas_crs, wgs84, QgsProject.instance()
            )
            point = transform.transform(point)

        lat, lon = point.y(), point.x()

        try:
            # Reverse-geocode click coordinates to county FIPS
            geo = self.client.reverse_geocode(lat, lon)
            fips = geo.get("county_fips", "")
            if not fips:
                return

            data = self.client.get_soil_data(fips)
            from qgis.core import QgsPointXY

            layer = self.layer_factory.create_soil_layer(
                data, fips, point=QgsPointXY(lon, lat)
            )
            QgsProject.instance().addMapLayer(layer)

        except Exception as e:
            from qgis.core import Qgis

            self.canvas().messageBar().pushMessage(
                "LeafEngines", str(e), level=Qgis.Warning, duration=5
            )
