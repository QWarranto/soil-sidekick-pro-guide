#!/usr/bin/env python3
"""
Test script for LeafEngines WFS Plugin extension.
This simulates basic plugin functionality without requiring QGIS.
"""

import os
import sys

# Add the plugin directory to the path
plugin_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, plugin_dir)

# Mock QGIS classes for testing
class MockQSettings:
    def __init__(self):
        self.values = {}
    
    def value(self, key, default=None, type=None):
        value = self.values.get(key, default)
        if type and value is not None:
            return type(value)
        return value
    
    def setValue(self, key, value):
        self.values[key] = value
    
    def sync(self):
        pass

class MockQgisInterface:
    def __init__(self):
        self.menu_actions = []
        self.toolbar_actions = []
    
    def addPluginToMenu(self, menu_name, action):
        self.menu_actions.append((menu_name, action))
    
    def removePluginMenu(self, menu_name, action):
        self.menu_actions = [(m, a) for (m, a) in self.menu_actions 
                           if not (m == menu_name and a == action)]
    
    def addToolBarIcon(self, action):
        self.toolbar_actions.append(action)
    
    def removeToolBarIcon(self, action):
        self.toolbar_actions = [a for a in self.toolbar_actions if a != action]
    
    def messageBar(self):
        return MockMessageBar()

class MockMessageBar:
    def pushMessage(self, title, message, level=0, duration=5):
        print(f"[MessageBar] {title}: {message} (level: {level}, duration: {duration})")

class MockQAction:
    def __init__(self, icon=None, text="", parent=None):
        self.icon = icon
        self.text = text
        self.parent = parent
        self.triggered_callback = None
    
    def triggered(self):
        return self.triggered_callback
    
    def connect(self, callback):
        self.triggered_callback = callback
    
    def setStatusTip(self, tip):
        self.status_tip = tip

class MockQTimer:
    def __init__(self):
        self.running = False
    
    def start(self, interval):
        self.running = True
        self.interval = interval
    
    def stop(self):
        self.running = False
    
    def timeout(self):
        return None
    
    def connect(self, callback):
        self.callback = callback

def test_plugin_initialization():
    """Test that the plugin can be initialized."""
    print("Testing plugin initialization...")
    
    # Mock QSettings
    import wfs_connection
    original_QSettings = wfs_connection.QSettings
    wfs_connection.QSettings = MockQSettings
    
    try:
        # Import and create plugin
        from plugin_wfs import LeafEnginesWFSPlugin
        
        iface = MockQgisInterface()
        plugin = LeafEnginesWFSPlugin(iface)
        
        print("✓ Plugin initialized successfully")
        print(f"  Plugin name: {plugin.PLUGIN_NAME}")
        print(f"  Plugin directory: {plugin.plugin_dir}")
        
        # Test WFS manager
        print("\nTesting WFS connection manager...")
        manager = plugin.wfs_manager
        
        # Test configuration
        config = manager.get_configuration()
        print(f"  Initial config: {config}")
        
        # Set configuration
        manager.set_configuration("http://localhost:8080/geoserver/wfs", 8080)
        config = manager.get_configuration()
        print(f"  After set config: {config}")
        
        # Test connection check
        status = manager.check_connection()
        print(f"  Connection status: {status}")
        
        # Test feature types
        feature_types = manager.get_feature_types()
        print(f"  Feature types: {feature_types}")
        
        print("\n✓ All basic tests passed!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Restore original QSettings
        wfs_connection.QSettings = original_QSettings

def test_dialog_structure():
    """Test that dialog classes can be imported."""
    print("\nTesting dialog structure...")
    
    try:
        from wfs_dialog import WFSDialog
        print("✓ WFSDialog imported successfully")
        
        # Check required methods
        dialog_methods = ['_build_ui', 'load_configuration', 'apply_configuration', 
                         'update_status', 'log_message']
        for method in dialog_methods:
            if hasattr(WFSDialog, method):
                print(f"  ✓ Method '{method}' exists")
            else:
                print(f"  ✗ Method '{method}' missing")
                
    except Exception as e:
        print(f"✗ Error importing dialog: {e}")
        import traceback
        traceback.print_exc()

def test_file_structure():
    """Verify all required files exist."""
    print("\nTesting file structure...")
    
    required_files = [
        'plugin_wfs.py',
        'wfs_dialog.py', 
        'wfs_connection.py',
        '__init__.py',
        'plugin.py',
        'resources/wfs_icon.png'
    ]
    
    all_exist = True
    for file in required_files:
        path = os.path.join(plugin_dir, file)
        if os.path.exists(path):
            print(f"✓ {file} exists")
        else:
            print(f"✗ {file} missing")
            all_exist = False
    
    if all_exist:
        print("\n✓ All required files exist!")
    else:
        print("\n✗ Some files are missing")

if __name__ == "__main__":
    print("=" * 60)
    print("LeafEngines WFS Plugin Extension Test")
    print("=" * 60)
    
    test_file_structure()
    test_plugin_initialization()
    test_dialog_structure()
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)