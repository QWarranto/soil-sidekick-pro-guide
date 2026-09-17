# Installation Guide: LeafEngines WFS Extension

## Quick Installation

1. **Copy the plugin folder** to your QGIS plugins directory:
   - Windows: `C:\Users\[YourUsername]\AppData\Roaming\QGIS\QGIS3\profiles\default\python\plugins\`
   - macOS: `~/Library/Application Support/QGIS/QGIS3/profiles/default/python/plugins/`
   - Linux: `~/.local/share/QGIS/QGIS3/profiles/default/python/plugins/`

2. **Restart QGIS** or go to `Plugins → Manage and Install Plugins → Installed` and click "Reload Plugins"

3. **Enable the plugin**:
   - Go to `Plugins → Manage and Install Plugins`
   - Search for "LeafEngines"
   - Check the box next to "LeafEngines Agricultural Intelligence"
   - Click "Close"

4. **Verify installation**:
   - Look for "LeafEngines" in the main menu
   - You should see new items: "WFS Server" and "Add WFS Layer"

## Testing the WFS Extension

### 1. Open WFS Configuration
- Go to `LeafEngines → WFS Server`
- A configuration dialog should open with three tabs:
  - Server configuration
  - Layer management  
  - Logs

### 2. Configure Test Server
- In the Server tab, enter: `http://localhost:8080/geoserver/wfs`
- Set port to: `8080`
- Click "Test Connection"
- You should see a success message (simulated)

### 3. View Feature Types
- Click "Refresh Feature Types"
- You should see 5 example feature types:
  - leafengines:soil_data
  - leafengines:water_quality  
  - leafengines:crop_recommendations
  - leafengines:carbon_credits
  - leafengines:environmental_impact

### 4. Add a Test Layer
- Select one of the feature types
- Click "Add Selected Layers"
- Check the QGIS Layers panel - a new layer should appear
- The layer will have appropriate styling based on feature type

### 5. Monitor Status
- The dialog shows connection status with color indicator:
  - Green: Connected
  - Red: Disconnected
  - Orange: Error
- Status updates automatically every 10 seconds

## Troubleshooting

### Plugin Not Appearing in Menu
- Check that the plugin is enabled in Plugin Manager
- Try restarting QGIS
- Check QGIS Python console for errors: `View → Panels → Python Console`

### Connection Test Fails
- This is expected in the current simulation
- The plugin simulates 90% success rate for testing
- Real connections require Agent 1's WFS server

### No Layers Added
- Make sure you've selected feature types first
- Check QGIS message bar for error messages
- Look in the Logs tab of the WFS dialog

### Python Errors
- Check QGIS logs: `View → Panels → Log Messages`
- Ensure you have QGIS 3.22 or higher
- Verify Python dependencies are installed

## Integration with Other Agents

### Agent 1 (WFS Server)
- Replace simulated connection with actual WFS server URL
- Update port to match Agent 1's server configuration
- Real feature types will come from Agent 1's GetCapabilities

### Agent 2 (Feature Schemas)
- Feature type styling can be enhanced with Agent 2's schema definitions
- Attribute tables can be configured based on schemas

### Agent 3 (Database Cache)
- Implement caching by modifying `wfs_connection.py`
- Add offline mode support
- Cache feature data locally for faster access

## Development Notes

- Current implementation uses simulation for testing
- Real WFS integration requires:
  - Actual WFS server (Agent 1)
  - HTTP request handling
  - XML parsing for GetCapabilities
  - Proper error handling for network issues

- To switch from simulation to real WFS:
  1. Modify `check_connection()` in `wfs_connection.py` to make actual HTTP requests
  2. Update `get_feature_types()` to parse real GetCapabilities XML
  3. Implement proper error handling for network failures

## Support

For issues or questions:
1. Check the Logs tab in the WFS dialog
2. Look at QGIS message log
3. Review Python console output
4. Refer to `WFS_EXTENSION.md` for technical details