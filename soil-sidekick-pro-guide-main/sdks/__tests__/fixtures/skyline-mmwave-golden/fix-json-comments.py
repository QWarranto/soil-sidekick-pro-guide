#!/usr/bin/env python3
"""
Fix JSON files by removing JavaScript-style comments
"""

import os
import re
import json
import sys

def remove_comments(json_str):
    """Remove JavaScript-style comments from JSON string"""
    # Remove single-line comments
    json_str = re.sub(r'//.*', '', json_str)
    # Remove multi-line comments
    json_str = re.sub(r'/\*.*?\*/', '', json_str, flags=re.DOTALL)
    return json_str

def fix_json_file(filepath):
    """Fix a single JSON file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Remove comments
        cleaned = remove_comments(content)
        
        # Try to parse to validate
        parsed = json.loads(cleaned)
        
        # Write back with proper formatting
        with open(filepath, 'w') as f:
            json.dump(parsed, f, indent=2)
        
        print(f"✅ Fixed: {os.path.basename(filepath)}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Failed to fix {os.path.basename(filepath)}: {e}")
        return False
    except Exception as e:
        print(f"❌ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    fixture_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all JSON files except schema files
    json_files = []
    for filename in os.listdir(fixture_dir):
        if filename.endswith('.json') and not filename.startswith('schema-'):
            json_files.append(os.path.join(fixture_dir, filename))
    
    print(f"Found {len(json_files)} JSON files to fix")
    
    success_count = 0
    for filepath in sorted(json_files):
        if fix_json_file(filepath):
            success_count += 1
    
    print(f"\nFixed {success_count}/{len(json_files)} files successfully")
    
    if success_count == len(json_files):
        print("✅ All files fixed successfully!")
        return 0
    else:
        print("❌ Some files failed to fix")
        return 1

if __name__ == '__main__':
    sys.exit(main())