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

        # For now, use a coordinate-based lookup hint
        # (the API resolves via county_lookup — future: add lat/lon endpoint)
        try:
            # Attempt lookup by approximate location description
            results = self.client.county_lookup(f"{lat},{lon}")
            if not results:
                return

            fips = results[0].get("fips_code", results[0].get("fips", ""))
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
