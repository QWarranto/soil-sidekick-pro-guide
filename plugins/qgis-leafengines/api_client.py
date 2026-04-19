"""
HTTP client for the LeafEngines / SoilSidekick Pro API.

All calls go through the Supabase Edge Functions gateway.
API key is read from QGIS settings or environment variable.
"""

import json
import os
from typing import Any, Dict, List, Optional
from urllib.parse import urlencode

from qgis.PyQt.QtCore import QSettings
from qgis.PyQt.QtNetwork import QNetworkRequest
from qgis.core import QgsNetworkAccessManager, QgsBlockingNetworkRequest

BASE_URL = "https://wzgnxkoeqzvueypwzvyn.supabase.co/functions/v1"

# Supabase anon key (publishable — safe to embed)
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z254a29lcXp2dWV5cHd6dnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTM4MjgsImV4cCI6MjA0OTUyOTgyOH0"
    ".bFBhAV8JRnD3URe5P7JGQ0U7Y2bxRS0RONST_vNQTNk"
)


class LeafEnginesClient:
    """Synchronous wrapper around the LeafEngines REST API."""

    SETTINGS_KEY = "leafengines/api_key"

    # ------------------------------------------------------------------
    # Configuration
    # ------------------------------------------------------------------

    def get_api_key(self) -> str:
        """Retrieve API key from QSettings → env var fallback → test key."""
        key = QSettings().value(self.SETTINGS_KEY, "")
        if not key:
            key = os.environ.get("LEAFENGINES_API_KEY", "")
        if not key:
            # Default test key for immediate use
            key = "leaf-test-370df0a2e62e"
        return key

    def set_api_key(self, key: str):
        QSettings().setValue(self.SETTINGS_KEY, key)

    # ------------------------------------------------------------------
    # Core request helper
    # ------------------------------------------------------------------

    def _post(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """POST JSON to an edge function and return parsed response."""
        url = f"{BASE_URL}/{endpoint}"

        request = QNetworkRequest(url)
        request.setHeader(QNetworkRequest.ContentTypeHeader, "application/json")
        request.setRawHeader(b"apikey", SUPABASE_ANON_KEY.encode())
        request.setRawHeader(b"Authorization", f"Bearer {SUPABASE_ANON_KEY}".encode())

        api_key = self.get_api_key()
        if api_key:
            request.setRawHeader(b"x-api-key", api_key.encode())

        blocker = QgsBlockingNetworkRequest()
        body = json.dumps(payload).encode("utf-8")
        err = blocker.post(request, body)

        if err != QgsBlockingNetworkRequest.NoError:
            raise ConnectionError(
                f"LeafEngines API error ({endpoint}): {blocker.errorMessage()}"
            )

        reply = blocker.reply()
        return json.loads(bytes(reply.content()))

    # ------------------------------------------------------------------
    # Public API methods
    # ------------------------------------------------------------------

    def county_lookup(self, term: str) -> List[Dict]:
        """Search for US counties by name, state, or FIPS fragment."""
        result = self._post("county-lookup", {"term": term})
        return result.get("counties", result.get("results", [result]))

    def get_soil_data(self, county_fips: str) -> Dict:
        """Retrieve USDA soil analysis for a 5-digit FIPS code."""
        return self._post("get-soil-data", {"county_fips": county_fips})

    def get_water_quality(self, county_fips: str) -> Dict:
        """Retrieve EPA water quality data."""
        return self._post("territorial-water-quality", {"county_fips": county_fips})

    def get_agricultural_intelligence(
        self, county_fips: str, crop_type: Optional[str] = None
    ) -> Dict:
        """AI crop recommendations and yield predictions."""
        payload: Dict[str, Any] = {"county_fips": county_fips}
        if crop_type:
            payload["crop_type"] = crop_type
        return self._post("agricultural-intelligence", payload)

    def calculate_carbon_credits(
        self,
        field_name: str,
        field_size_acres: float,
        soil_organic_matter: Optional[float] = None,
    ) -> Dict:
        """Estimate carbon credit potential for a field."""
        payload: Dict[str, Any] = {
            "field_name": field_name,
            "field_size_acres": field_size_acres,
        }
        if soil_organic_matter is not None:
            payload["soil_organic_matter"] = soil_organic_matter
        return self._post("carbon-credit-calculator", payload)

    def get_environmental_impact(
        self, county_fips: str, soil_data: Optional[Dict] = None
    ) -> Dict:
        """Environmental impact assessment."""
        payload: Dict[str, Any] = {"county_fips": county_fips}
        if soil_data:
            payload["soil_data"] = soil_data
        return self._post("environmental-impact-engine", payload)

    def get_planting_calendar(self, county_fips: str, crop_type: str = "") -> Dict:
        """Multi-parameter planting calendar."""
        payload: Dict[str, Any] = {"county_fips": county_fips}
        if crop_type:
            payload["crop_type"] = crop_type
        return self._post("multi-parameter-planting-calendar", payload)

    def reverse_geocode(self, lat: float, lon: float) -> Dict:
        """Convert lat/lon to county FIPS via FCC Area API."""
        return self._post("reverse-geocode", {"lat": lat, "lon": lon})

    def leafengines_query(
        self, county_fips: str, plant_common_name: str
    ) -> Dict:
        """Plant-environment compatibility score."""
        return self._post(
            "leafengines-query",
            {
                "location": {"county_fips": county_fips},
                "plant": {"common_name": plant_common_name},
            },
        )
