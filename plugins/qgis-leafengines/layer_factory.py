"""
Creates styled QGIS vector layers from LeafEngines API responses.
"""

import json
from typing import Any, Dict, List, Optional

from qgis.PyQt.QtCore import QVariant
from qgis.PyQt.QtGui import QColor
from qgis.core import (
    Qgis,
    QgsFeature,
    QgsField,
    QgsFields,
    QgsGeometry,
    QgsPointXY,
    QgsProject,
    QgsVectorLayer,
    QgsMarkerSymbol,
    QgsCategorizedSymbolRenderer,
    QgsRendererCategory,
    QgsGraduatedSymbolRenderer,
    QgsRendererRange,
    QgsSingleSymbolRenderer,
)


class LayerFactory:
    """Builds in-memory vector layers from API data."""

    # ------------------------------------------------------------------
    # Soil data layer
    # ------------------------------------------------------------------

    def create_soil_layer(
        self,
        data: Dict[str, Any],
        county_fips: str,
        point: Optional[QgsPointXY] = None,
    ) -> QgsVectorLayer:
        """Create a point layer with soil analysis attributes."""
        layer = QgsVectorLayer("Point?crs=EPSG:4326", f"Soil — {county_fips}", "memory")
        pr = layer.dataProvider()

        fields = QgsFields()
        fields.append(QgsField("county_fips", QVariant.String))
        fields.append(QgsField("ph_level", QVariant.Double))
        fields.append(QgsField("organic_matter_pct", QVariant.Double))
        fields.append(QgsField("nitrogen_ppm", QVariant.Double))
        fields.append(QgsField("phosphorus_ppm", QVariant.Double))
        fields.append(QgsField("potassium_ppm", QVariant.Double))
        fields.append(QgsField("texture", QVariant.String))
        fields.append(QgsField("drainage", QVariant.String))
        fields.append(QgsField("cec", QVariant.Double))
        pr.addAttributes(fields)
        layer.updateFields()

        feat = QgsFeature(layer.fields())
        # Use supplied point or default to county centroid placeholder
        if point:
            feat.setGeometry(QgsGeometry.fromPointXY(point))
        else:
            feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(-98.5, 39.8)))

        feat["county_fips"] = county_fips
        feat["ph_level"] = data.get("ph_level")
        feat["organic_matter_pct"] = data.get("organic_matter")
        feat["nitrogen_ppm"] = data.get("nitrogen")
        feat["phosphorus_ppm"] = data.get("phosphorus")
        feat["potassium_ppm"] = data.get("potassium")
        feat["texture"] = data.get("soil_texture", data.get("texture"))
        feat["drainage"] = data.get("drainage_class", data.get("drainage"))
        feat["cec"] = data.get("cation_exchange_capacity", data.get("cec"))

        pr.addFeature(feat)
        layer.updateExtents()

        # Style: colour by pH
        self._style_by_ph(layer)

        return layer

    # ------------------------------------------------------------------
    # Water quality layer
    # ------------------------------------------------------------------

    def create_water_quality_layer(
        self, data: Dict[str, Any], county_fips: str
    ) -> QgsVectorLayer:
        """Point layer with EPA water quality attributes."""
        layer = QgsVectorLayer(
            "Point?crs=EPSG:4326", f"Water Quality — {county_fips}", "memory"
        )
        pr = layer.dataProvider()

        fields = QgsFields()
        fields.append(QgsField("county_fips", QVariant.String))
        fields.append(QgsField("overall_quality", QVariant.String))
        fields.append(QgsField("nitrate_mg_l", QVariant.Double))
        fields.append(QgsField("ph", QVariant.Double))
        fields.append(QgsField("turbidity_ntu", QVariant.Double))
        fields.append(QgsField("contamination_risk", QVariant.String))
        pr.addAttributes(fields)
        layer.updateFields()

        feat = QgsFeature(layer.fields())
        feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(-98.5, 39.8)))
        feat["county_fips"] = county_fips
        feat["overall_quality"] = data.get("overall_quality", data.get("quality"))
        feat["nitrate_mg_l"] = data.get("nitrate_level")
        feat["ph"] = data.get("ph")
        feat["turbidity_ntu"] = data.get("turbidity")
        feat["contamination_risk"] = data.get("contamination_risk")

        pr.addFeature(feat)
        layer.updateExtents()

        # Simple green/yellow/red by quality
        symbol = QgsMarkerSymbol.defaultSymbol(layer.geometryType())
        quality = str(feat["overall_quality"]).lower()
        color = {"good": "#27ae60", "fair": "#f39c12", "poor": "#e74c3c"}.get(
            quality, "#3498db"
        )
        symbol.setColor(QColor(color))
        symbol.setSize(6)
        layer.setRenderer(QgsSingleSymbolRenderer(symbol))

        return layer

    # ------------------------------------------------------------------
    # Environmental impact layer
    # ------------------------------------------------------------------

    def create_environmental_impact_layer(
        self, data: Dict[str, Any], county_fips: str
    ) -> QgsVectorLayer:
        """Point layer with environmental impact scores."""
        layer = QgsVectorLayer(
            "Point?crs=EPSG:4326", f"Env Impact — {county_fips}", "memory"
        )
        pr = layer.dataProvider()

        fields = QgsFields()
        fields.append(QgsField("county_fips", QVariant.String))
        fields.append(QgsField("runoff_risk", QVariant.Double))
        fields.append(QgsField("carbon_score", QVariant.Double))
        fields.append(QgsField("biodiversity", QVariant.String))
        fields.append(QgsField("contamination", QVariant.String))
        pr.addAttributes(fields)
        layer.updateFields()

        feat = QgsFeature(layer.fields())
        feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(-98.5, 39.8)))
        feat["county_fips"] = county_fips

        detail = data.get("detailed_analysis", data)
        feat["runoff_risk"] = detail.get("runoff_risk", {}).get("score")
        feat["carbon_score"] = detail.get("carbon_footprint", {}).get("score")
        feat["biodiversity"] = detail.get("biodiversity_impact")
        feat["contamination"] = detail.get("contamination_risk")

        pr.addFeature(feat)
        layer.updateExtents()
        return layer

    # ------------------------------------------------------------------
    # GeoJSON export helper
    # ------------------------------------------------------------------

    @staticmethod
    def layer_to_geojson(layer: QgsVectorLayer) -> str:
        """Export a memory layer to a GeoJSON string."""
        from qgis.core import QgsJsonExporter

        exporter = QgsJsonExporter(layer)
        return exporter.exportFeatures(list(layer.getFeatures()))

    # ------------------------------------------------------------------
    # Internal styling helpers
    # ------------------------------------------------------------------

    def _style_by_ph(self, layer: QgsVectorLayer):
        """Graduated colour ramp by ph_level field."""
        symbol = QgsMarkerSymbol.defaultSymbol(layer.geometryType())
        symbol.setSize(6)

        ranges = [
            QgsRendererRange(0, 5.5, self._colored_symbol("#e74c3c", 6), "Acidic (<5.5)"),
            QgsRendererRange(5.5, 6.5, self._colored_symbol("#f39c12", 6), "Slightly Acidic"),
            QgsRendererRange(6.5, 7.5, self._colored_symbol("#27ae60", 6), "Neutral"),
            QgsRendererRange(7.5, 14, self._colored_symbol("#3498db", 6), "Alkaline (>7.5)"),
        ]

        renderer = QgsGraduatedSymbolRenderer("ph_level", ranges)
        layer.setRenderer(renderer)

    @staticmethod
    def _colored_symbol(hex_color: str, size: float) -> QgsMarkerSymbol:
        symbol = QgsMarkerSymbol.defaultSymbol(0)  # point
        symbol.setColor(QColor(hex_color))
        symbol.setSize(size)
        return symbol
