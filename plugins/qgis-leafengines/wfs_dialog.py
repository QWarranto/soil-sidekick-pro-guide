"""
WFS Server Configuration Dialog
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Dialog for configuring and managing WFS server connections.
"""

from qgis.PyQt.QtCore import Qt, QTimer, QDateTime
from qgis.PyQt.QtGui import QColor, QPalette
from qgis.PyQt.QtWidgets import (
    QDialog,
    QDialogButtonBox,
    QFormLayout,
    QHBoxLayout,
    QVBoxLayout,
    QLabel,
    QLineEdit,
    QSpinBox,
    QPushButton,
    QCheckBox,
    QGroupBox,
    QTextEdit,
    QListWidget,
    QListWidgetItem,
    QTabWidget,
    QWidget,
    QMessageBox,
    QProgressBar,
)
from qgis.core import QgsMessageLog, Qgis
import json


class WFSDialog(QDialog):
    """Dialog for WFS server configuration and management."""
    
    def __init__(self, parent, manager, plugin):
        super().__init__(parent)
        self.manager = manager
        self.plugin = plugin
        self.setWindowTitle("LeafEngines WFS Server Configuration")
        self.setMinimumSize(600, 500)
        
        # Status update timer
        self.status_timer = QTimer()
        self.status_timer.timeout.connect(self.update_status)
        self.status_timer.start(10000)  # Update every 10 seconds
        
        self._build_ui()
        self.load_configuration()
        self.update_status()
        
    def _build_ui(self):
        """Build the dialog UI."""
        layout = QVBoxLayout(self)
        
        # Create tab widget
        tabs = QTabWidget()
        tabs.addTab(self._server_tab(), "🖥️ Server")
        tabs.addTab(self._layers_tab(), "🗺️ Layers")
        tabs.addTab(self._logs_tab(), "📋 Logs")
        layout.addWidget(tabs)
        
        # Status bar
        status_layout = QHBoxLayout()
        self.status_indicator = QLabel("●")
        self.status_indicator.setStyleSheet("font-size: 24px;")
        status_layout.addWidget(self.status_indicator)
        
        self.status_label = QLabel("Checking connection...")
        status_layout.addWidget(self.status_label)
        
        self.last_check_label = QLabel("")
        self.last_check_label.setAlignment(Qt.AlignRight)
        status_layout.addWidget(self.last_check_label)
        
        layout.addLayout(status_layout)
        
        # Buttons
        buttons = QDialogButtonBox(
            QDialogButtonBox.Ok | QDialogButtonBox.Apply | QDialogButtonBox.Cancel
        )
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        apply_button = buttons.button(QDialogButtonBox.Apply)
        apply_button.clicked.connect(self.apply_configuration)
        layout.addWidget(buttons)
        
    def _server_tab(self) -> QWidget:
        """Create the server configuration tab."""
        w = QWidget()
        layout = QVBoxLayout(w)
        
        # Server configuration group
        server_group = QGroupBox("Server Configuration")
        server_form = QFormLayout(server_group)
        
        # Base URL
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("http://localhost:8080/geoserver/wfs")
        server_form.addRow("Base URL:", self.url_input)
        
        # Port (for local server)
        self.port_input = QSpinBox()
        self.port_input.setRange(1024, 65535)
        self.port_input.setValue(8080)
        server_form.addRow("Port:", self.port_input)
        
        # Server controls
        controls_layout = QHBoxLayout()
        self.start_button = QPushButton("Start Server")
        self.start_button.clicked.connect(self.start_server)
        controls_layout.addWidget(self.start_button)
        
        self.stop_button = QPushButton("Stop Server")
        self.stop_button.clicked.connect(self.stop_server)
        self.stop_button.setEnabled(False)
        controls_layout.addWidget(self.stop_button)
        
        self.test_button = QPushButton("Test Connection")
        self.test_button.clicked.connect(self.test_connection)
        controls_layout.addWidget(self.test_button)
        
        server_form.addRow("Controls:", controls_layout)
        layout.addWidget(server_group)
        
        # Feature types group
        types_group = QGroupBox("Available Feature Types")
        types_layout = QVBoxLayout(types_group)
        
        self.feature_types_list = QListWidget()
        self.feature_types_list.setSelectionMode(QListWidget.MultiSelection)
        types_layout.addWidget(self.feature_types_list)
        
        refresh_button = QPushButton("Refresh Feature Types")
        refresh_button.clicked.connect(self.refresh_feature_types)
        types_layout.addWidget(refresh_button)
        
        layout.addWidget(types_group)
        layout.addStretch()
        
        return w
        
    def _layers_tab(self) -> QWidget:
        """Create the layers management tab."""
        w = QWidget()
        layout = QVBoxLayout(w)
        
        # Layer management group
        layer_group = QGroupBox("Layer Management")
        layer_layout = QVBoxLayout(layer_group)
        
        self.active_layers_list = QListWidget()
        layer_layout.addWidget(self.active_layers_list)
        
        buttons_layout = QHBoxLayout()
        add_button = QPushButton("Add Selected Layers")
        add_button.clicked.connect(self.add_selected_layers)
        buttons_layout.addWidget(add_button)
        
        remove_button = QPushButton("Remove Selected Layers")
        remove_button.clicked.connect(self.remove_selected_layers)
        buttons_layout.addWidget(remove_button)
        
        refresh_button = QPushButton("Refresh All Layers")
        refresh_button.clicked.connect(self.refresh_all_layers)
        buttons_layout.addWidget(refresh_button)
        
        layer_layout.addLayout(buttons_layout)
        layout.addWidget(layer_group)
        
        # Progress bar for layer operations
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        layout.addWidget(self.progress_bar)
        
        layout.addStretch()
        return w
        
    def _logs_tab(self) -> QWidget:
        """Create the logs tab."""
        w = QWidget()
        layout = QVBoxLayout(w)
        
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setMaximumHeight(300)
        layout.addWidget(self.log_text)
        
        # Log controls
        controls_layout = QHBoxLayout()
        clear_button = QPushButton("Clear Logs")
        clear_button.clicked.connect(self.clear_logs)
        controls_layout.addWidget(clear_button)
        
        copy_button = QPushButton("Copy Logs")
        copy_button.clicked.connect(self.copy_logs)
        controls_layout.addWidget(copy_button)
        
        layout.addLayout(controls_layout)
        layout.addStretch()
        
        return w
        
    def load_configuration(self):
        """Load existing configuration from manager."""
        config = self.manager.get_configuration()
        if config:
            self.url_input.setText(config.get("url", ""))
            self.port_input.setValue(config.get("port", 8080))
            
    def apply_configuration(self):
        """Apply configuration changes."""
        url = self.url_input.text().strip()
        port = self.port_input.value()
        
        if not url:
            QMessageBox.warning(self, "Configuration Error", 
                              "Please enter a valid base URL.")
            return
            
        try:
            self.manager.set_configuration(url, port)
            self.log_message("Configuration saved successfully.", Qgis.Info)
            self.update_status()
        except Exception as e:
            self.log_message(f"Error saving configuration: {str(e)}", Qgis.Critical)
            QMessageBox.critical(self, "Configuration Error", 
                               f"Failed to save configuration: {str(e)}")
                               
    def start_server(self):
        """Start the WFS server."""
        self.log_message("Starting WFS server...", Qgis.Info)
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)
        # In a real implementation, this would start the actual server
        self.log_message("WFS server started (simulated)", Qgis.Success)
        
    def stop_server(self):
        """Stop the WFS server."""
        self.log_message("Stopping WFS server...", Qgis.Info)
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        # In a real implementation, this would stop the actual server
        self.log_message("WFS server stopped (simulated)", Qgis.Success)
        
    def test_connection(self):
        """Test connection to WFS server."""
        self.log_message("Testing WFS server connection...", Qgis.Info)
        try:
            status = self.manager.check_connection()
            if status["connected"]:
                self.log_message("Connection successful!", Qgis.Success)
                QMessageBox.information(self, "Connection Test", 
                                      "Successfully connected to WFS server.")
            else:
                self.log_message(f"Connection failed: {status.get('error', 'Unknown error')}", 
                               Qgis.Critical)
                QMessageBox.critical(self, "Connection Test", 
                                   f"Failed to connect: {status.get('error', 'Unknown error')}")
        except Exception as e:
            self.log_message(f"Error testing connection: {str(e)}", Qgis.Critical)
            QMessageBox.critical(self, "Connection Test", 
                               f"Error: {str(e)}")
                               
    def refresh_feature_types(self):
        """Refresh available feature types from server."""
        self.log_message("Refreshing feature types...", Qgis.Info)
        try:
            feature_types = self.manager.get_feature_types()
            self.feature_types_list.clear()
            for ft in feature_types:
                item = QListWidgetItem(ft)
                self.feature_types_list.addItem(item)
            self.log_message(f"Found {len(feature_types)} feature types", Qgis.Success)
        except Exception as e:
            self.log_message(f"Error refreshing feature types: {str(e)}", Qgis.Critical)
            
    def add_selected_layers(self):
        """Add selected feature types as layers."""
        selected_items = self.feature_types_list.selectedItems()
        if not selected_items:
            QMessageBox.warning(self, "No Selection", 
                              "Please select feature types to add as layers.")
            return
            
        self.progress_bar.setVisible(True)
        self.progress_bar.setMaximum(len(selected_items))
        
        success_count = 0
        for i, item in enumerate(selected_items):
            self.progress_bar.setValue(i + 1)
            try:
                layer = self.manager.add_wfs_layer(item.text())
                if layer:
                    from qgis.core import QgsProject
                    QgsProject.instance().addMapLayer(layer)
                    success_count += 1
                    self.log_message(f"Added layer: {item.text()}", Qgis.Success)
                else:
                    self.log_message(f"Failed to add layer: {item.text()}", Qgis.Warning)
            except Exception as e:
                self.log_message(f"Error adding layer {item.text()}: {str(e)}", Qgis.Critical)
                
        self.progress_bar.setVisible(False)
        self.log_message(f"Added {success_count} of {len(selected_items)} layers", 
                        Qgis.Info if success_count > 0 else Qgis.Warning)
                        
    def remove_selected_layers(self):
        """Remove selected layers from project."""
        # This would remove layers from QGIS project
        # Implementation depends on how we track added layers
        pass
        
    def refresh_all_layers(self):
        """Refresh data for all WFS layers."""
        self.log_message("Refreshing all WFS layers...", Qgis.Info)
        # Implementation would refresh layer data
        self.log_message("Layers refreshed (simulated)", Qgis.Success)
        
    def update_status(self):
        """Update connection status display."""
        try:
            status = self.manager.check_connection()
            
            # Update status indicator
            if status["connected"]:
                self.status_indicator.setStyleSheet(
                    "font-size: 24px; color: #00ff00;"
                )
                self.status_label.setText("Connected")
            else:
                self.status_indicator.setStyleSheet(
                    "font-size: 24px; color: #ff0000;"
                )
                self.status_label.setText(f"Disconnected: {status.get('error', 'Unknown')}")
                
            # Update last check time
            current_time = QDateTime.currentDateTime().toString("hh:mm:ss")
            self.last_check_label.setText(f"Last check: {current_time}")
            
        except Exception as e:
            self.status_indicator.setStyleSheet(
                "font-size: 24px; color: #ff9900;"
            )
            self.status_label.setText(f"Error: {str(e)}")
            
    def log_message(self, message, level=Qgis.Info):
        """Add a message to the log."""
        timestamp = QDateTime.currentDateTime().toString("hh:mm:ss")
        level_text = {
            Qgis.Info: "INFO",
            Qgis.Warning: "WARN",
            Qgis.Critical: "ERROR",
            Qgis.Success: "SUCCESS"
        }.get(level, "INFO")
        
        color = {
            Qgis.Info: "black",
            Qgis.Warning: "orange",
            Qgis.Critical: "red",
            Qgis.Success: "green"
        }.get(level, "black")
        
        html_message = f'<span style="color: gray;">[{timestamp}]</span> ' \
                      f'<span style="color: {color};"><b>{level_text}:</b> {message}</span>'
        self.log_text.append(html_message)
        
        # Also log to QGIS message log
        QgsMessageLog.logMessage(message, "LeafEngines WFS", level)
        
    def clear_logs(self):
        """Clear all log messages."""
        self.log_text.clear()
        
    def copy_logs(self):
        """Copy logs to clipboard."""
        clipboard = self.plugin.iface.mainWindow().clipboard()
        clipboard.setText(self.log_text.toPlainText())
        self.log_message("Logs copied to clipboard", Qgis.Info)
        
    def closeEvent(self, event):
        """Handle dialog close event."""
        self.status_timer.stop()
        super().closeEvent(event)