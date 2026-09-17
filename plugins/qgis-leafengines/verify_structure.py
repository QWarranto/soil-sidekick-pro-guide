#!/usr/bin/env python3
"""
Verify the plugin structure without importing QGIS modules.
"""

import os
import sys

def check_file_exists(path, description):
    """Check if a file exists and print status."""
    if os.path.exists(path):
        print(f"✓ {description}: {os.path.basename(path)}")
        return True
    else:
        print(f"✗ {description}: {os.path.basename(path)} (MISSING)")
        return False

def check_file_content(path, required_strings):
    """Check if file contains required strings."""
    if not os.path.exists(path):
        return False
    
    try:
        with open(path, 'r') as f:
            content = f.read()
        
        all_found = True
        for string in required_strings:
            if string in content:
                print(f"  ✓ Contains: '{string}'")
            else:
                print(f"  ✗ Missing: '{string}'")
                all_found = False
        
        return all_found
    except Exception as e:
        print(f"  ✗ Error reading file: {e}")
        return False

def main():
    plugin_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("=" * 60)
    print("LeafEngines WFS Plugin Structure Verification")
    print("=" * 60)
    
    # Check required files
    print("\n1. Checking required files:")
    files_to_check = [
        (os.path.join(plugin_dir, 'plugin_wfs.py'), 'Extended plugin class'),
        (os.path.join(plugin_dir, 'wfs_dialog.py'), 'WFS dialog UI'),
        (os.path.join(plugin_dir, 'wfs_connection.py'), 'WFS connection manager'),
        (os.path.join(plugin_dir, '__init__.py'), 'Plugin entry point'),
        (os.path.join(plugin_dir, 'plugin.py'), 'Base plugin class'),
        (os.path.join(plugin_dir, 'resources', 'wfs_icon.png'), 'WFS icon'),
    ]
    
    all_files_exist = True
    for path, description in files_to_check:
        if not check_file_exists(path, description):
            all_files_exist = False
    
    # Check file contents
    print("\n2. Checking file contents:")
    
    # Check plugin_wfs.py
    print("\n   plugin_wfs.py:")
    check_file_content(
        os.path.join(plugin_dir, 'plugin_wfs.py'),
        ['class LeafEnginesWFSPlugin', 'def initGui', 'def open_wfs_dialog', 'def add_wfs_layer']
    )
    
    # Check wfs_dialog.py
    print("\n   wfs_dialog.py:")
    check_file_content(
        os.path.join(plugin_dir, 'wfs_dialog.py'),
        ['class WFSDialog', 'def _build_ui', 'def update_status', 'def apply_configuration']
    )
    
    # Check wfs_connection.py
    print("\n   wfs_connection.py:")
    check_file_content(
        os.path.join(plugin_dir, 'wfs_connection.py'),
        ['class WFSConnectionManager', 'def get_configuration', 'def check_connection', 'def add_wfs_layer']
    )
    
    # Check __init__.py
    print("\n   __init__.py:")
    check_file_content(
        os.path.join(plugin_dir, '__init__.py'),
        ['def classFactory', 'LeafEnginesWFSPlugin']
    )
    
    # Check directory structure
    print("\n3. Checking directory structure:")
    required_dirs = ['resources']
    for dir_name in required_dirs:
        dir_path = os.path.join(plugin_dir, dir_name)
        if os.path.isdir(dir_path):
            print(f"✓ Directory: {dir_name}/")
        else:
            print(f"✗ Directory: {dir_name}/ (MISSING)")
    
    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    
    if all_files_exist:
        print("✓ All required files exist")
        print("✓ Plugin structure appears valid")
        print("\nThe WFS plugin extension is ready for testing in QGIS.")
        print("\nTo test in QGIS:")
        print("1. Copy the plugin directory to QGIS plugins folder")
        print("2. Enable the plugin in QGIS Plugin Manager")
        print("3. Look for 'LeafEngines: WFS Server' in the menu")
    else:
        print("✗ Some files are missing")
        print("\nPlease check the missing files above.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()