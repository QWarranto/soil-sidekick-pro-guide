"""
Main plugin dialog — tabbed interface for all LeafEngines queries.
"""

from qgis.PyQt.QtCore import Qt
from qgis.PyQt.QtWidgets import (
    QDialog,
    QDialogButtonBox,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QTabWidget,
    QTextEdit,
    QVBoxLayout,
    QWidget,
    QComboBox,
    QDoubleSpinBox,
    QGroupBox,
)
from qgis.core import QgsProject

from .api_client import LeafEnginesClient
from .layer_factory import LayerFactory


class LeafEnginesDialog(QDialog):
    """Tabbed dialog: Settings | Soil | Water | Crops | Carbon | Impact."""

    def __init__(self, parent, client: LeafEnginesClient, layer_factory: LayerFactory):
        super().__init__(parent)
        self.client = client
        self.layer_factory = layer_factory
        self.setWindowTitle("LeafEngines — Agricultural Intelligence")
        self.setMinimumSize(520, 480)
        self._build_ui()

    # ------------------------------------------------------------------
    # UI construction
    # ------------------------------------------------------------------

    def _build_ui(self):
        layout = QVBoxLayout(self)

        tabs = QTabWidget()
        tabs.addTab(self._settings_tab(), "⚙ Settings")
        tabs.addTab(self._soil_tab(), "🌱 Soil")
        tabs.addTab(self._water_tab(), "💧 Water")
        tabs.addTab(self._crop_tab(), "🌾 Crops")
        tabs.addTab(self._carbon_tab(), "♻ Carbon")
        tabs.addTab(self._impact_tab(), "🌍 Impact")
        layout.addWidget(tabs)

        # Status bar
        self.status = QLabel("Ready")
        layout.addWidget(self.status)

    # ---- Settings tab ------------------------------------------------

    def _settings_tab(self) -> QWidget:
        w = QWidget()
        form = QFormLayout(w)

        self.api_key_input = QLineEdit()
        self.api_key_input.setPlaceholderText("ak_sandbox_... or ak_live_...")
        self.api_key_input.setEchoMode(QLineEdit.Password)
        self.api_key_input.setText(self.client.get_api_key())
        form.addRow("API Key:", self.api_key_input)

        save_btn = QPushButton("Save API Key")
        save_btn.clicked.connect(self._save_api_key)
        form.addRow(save_btn)

        form.addRow(QLabel(""))
        form.addRow(QLabel("Get a key at soilsidekickpro.com/api-keys"))
        return w

    def _save_api_key(self):
        self.client.set_api_key(self.api_key_input.text().strip())
        self.status.setText("API key saved.")

    # ---- Soil tab ----------------------------------------------------

    def _soil_tab(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)

        # County lookup
        lookup_group = QGroupBox("County Lookup")
        lookup_layout = QHBoxLayout(lookup_group)
        self.county_search = QLineEdit()
        self.county_search.setPlaceholderText("County name, state, or FIPS code")
        lookup_layout.addWidget(self.county_search)
        lookup_btn = QPushButton("Search")
        lookup_btn.clicked.connect(self._do_county_lookup)
        lookup_layout.addWidget(lookup_btn)
        layout.addWidget(lookup_group)

        self.county_results = QComboBox()
        layout.addWidget(self.county_results)

        # Soil query
        soil_btn = QPushButton("Get Soil Data → Add Layer")
        soil_btn.clicked.connect(self._do_soil_query)
        layout.addWidget(soil_btn)

        self.soil_output = QTextEdit()
        self.soil_output.setReadOnly(True)
        self.soil_output.setMaximumHeight(200)
        layout.addWidget(self.soil_output)
        layout.addStretch()
        return w

    def _do_county_lookup(self):
        term = self.county_search.text().strip()
        if not term:
            return
        self.status.setText("Searching counties...")
        try:
            results = self.client.county_lookup(term)
            self.county_results.clear()
            for c in results:
                fips = c.get("fips_code", c.get("fips", ""))
                name = c.get("county_name", c.get("name", ""))
                state = c.get("state_name", c.get("state", ""))
                self.county_results.addItem(f"{name}, {state} ({fips})", fips)
            self.status.setText(f"Found {len(results)} counties.")
        except Exception as e:
            self.status.setText(f"Error: {e}")

    def _selected_fips(self) -> str:
        return self.county_results.currentData() or ""

    def _do_soil_query(self):
        fips = self._selected_fips()
        if not fips:
            QMessageBox.warning(self, "No county", "Search for a county first.")
            return
        self.status.setText(f"Querying soil data for {fips}...")
        try:
            data = self.client.get_soil_data(fips)
            import json
            self.soil_output.setPlainText(json.dumps(data, indent=2))
            layer = self.layer_factory.create_soil_layer(data, fips)
            QgsProject.instance().addMapLayer(layer)
            self.status.setText(f"Soil layer added for {fips}.")
        except Exception as e:
            self.status.setText(f"Error: {e}")

    # ---- Water tab ---------------------------------------------------

    def _water_tab(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("Uses the county selected in the Soil tab."))

        btn = QPushButton("Get Water Quality → Add Layer")
        btn.clicked.connect(self._do_water_query)
        layout.addWidget(btn)

        self.water_output = QTextEdit()
        self.water_output.setReadOnly(True)
        self.water_output.setMaximumHeight(200)
        layout.addWidget(self.water_output)
        layout.addStretch()
        return w

    def _do_water_query(self):
        fips = self._selected_fips()
        if not fips:
            QMessageBox.warning(self, "No county", "Search for a county first.")
            return
        self.status.setText(f"Querying water quality for {fips}...")
        try:
            data = self.client.get_water_quality(fips)
            import json
            self.water_output.setPlainText(json.dumps(data, indent=2))
            layer = self.layer_factory.create_water_quality_layer(data, fips)
            QgsProject.instance().addMapLayer(layer)
            self.status.setText(f"Water quality layer added for {fips}.")
        except Exception as e:
            self.status.setText(f"Error: {e}")

    # ---- Crop recommendations tab ------------------------------------

    def _crop_tab(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("AI crop recommendations for selected county."))

        row = QHBoxLayout()
        self.crop_input = QLineEdit()
        self.crop_input.setPlaceholderText("Crop type (optional, e.g. corn)")
        row.addWidget(self.crop_input)

        btn = QPushButton("Get Recommendations")
        btn.clicked.connect(self._do_crop_query)
        row.addWidget(btn)
        layout.addLayout(row)

        self.crop_output = QTextEdit()
        self.crop_output.setReadOnly(True)
        layout.addWidget(self.crop_output)
        return w

    def _do_crop_query(self):
        fips = self._selected_fips()
        if not fips:
            QMessageBox.warning(self, "No county", "Search for a county first.")
            return
        self.status.setText("Getting AI crop recommendations...")
        try:
            data = self.client.get_agricultural_intelligence(
                fips, self.crop_input.text().strip() or None
            )
            import json
            self.crop_output.setPlainText(json.dumps(data, indent=2))
            self.status.setText("Crop recommendations loaded.")
        except Exception as e:
            self.status.setText(f"Error: {e}")

    # ---- Carbon credits tab ------------------------------------------

    def _carbon_tab(self) -> QWidget:
        w = QWidget()
        form = QFormLayout(w)

        self.carbon_field_name = QLineEdit()
        self.carbon_field_name.setPlaceholderText("e.g. North Field")
        form.addRow("Field Name:", self.carbon_field_name)

        self.carbon_acres = QDoubleSpinBox()
        self.carbon_acres.setRange(0.1, 100000)
        self.carbon_acres.setValue(100)
        self.carbon_acres.setSuffix(" acres")
        form.addRow("Field Size:", self.carbon_acres)

        self.carbon_som = QDoubleSpinBox()
        self.carbon_som.setRange(0, 100)
        self.carbon_som.setValue(3.0)
        self.carbon_som.setSuffix(" %")
        form.addRow("Organic Matter:", self.carbon_som)

        btn = QPushButton("Calculate Carbon Credits")
        btn.clicked.connect(self._do_carbon_calc)
        form.addRow(btn)

        self.carbon_output = QTextEdit()
        self.carbon_output.setReadOnly(True)
        form.addRow(self.carbon_output)
        return w

    def _do_carbon_calc(self):
        name = self.carbon_field_name.text().strip() or "Unnamed Field"
        self.status.setText("Calculating carbon credits...")
        try:
            data = self.client.calculate_carbon_credits(
                field_name=name,
                field_size_acres=self.carbon_acres.value(),
                soil_organic_matter=self.carbon_som.value(),
            )
            import json
            self.carbon_output.setPlainText(json.dumps(data, indent=2))
            self.status.setText("Carbon credit calculation complete.")
        except Exception as e:
            self.status.setText(f"Error: {e}")

    # ---- Environmental impact tab ------------------------------------

    def _impact_tab(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.addWidget(QLabel("Environmental impact assessment for selected county."))

        btn = QPushButton("Run Environmental Assessment → Add Layer")
        btn.clicked.connect(self._do_impact_query)
        layout.addWidget(btn)

        self.impact_output = QTextEdit()
        self.impact_output.setReadOnly(True)
        layout.addWidget(self.impact_output)
        layout.addStretch()
        return w

    def _do_impact_query(self):
        fips = self._selected_fips()
        if not fips:
            QMessageBox.warning(self, "No county", "Search for a county first.")
            return
        self.status.setText(f"Running environmental impact for {fips}...")
        try:
            data = self.client.get_environmental_impact(fips)
            import json
            self.impact_output.setPlainText(json.dumps(data, indent=2))
            layer = self.layer_factory.create_environmental_impact_layer(data, fips)
            QgsProject.instance().addMapLayer(layer)
            self.status.setText(f"Environmental impact layer added for {fips}.")
        except Exception as e:
            self.status.setText(f"Error: {e}")
