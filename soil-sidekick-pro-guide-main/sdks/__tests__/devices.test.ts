import { SensorDevicesAPI } from '../sensors/devices';
import { LeafEnginesClient } from '../client';

describe('SensorDevicesAPI', () => {
  let client: LeafEnginesClient;
  let devices: SensorDevicesAPI;

  beforeEach(() => {
    client = new LeafEnginesClient({
      apiKey: 'test-api-key',
      projectRef: 'test-project',
    });
    devices = new SensorDevicesAPI(client);
  });

  describe('register', () => {
    it('should register a new device', async () => {
      const mockResponse = {
        id: 'uuid-123',
        device_id: 'skyline-001',
        device_type: 'mmwave_radar',
        firmware_version: '1.0.0',
        status: 'active',
        last_seen_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(client, 'request').mockResolvedValue({ data: mockResponse });

      const result = await devices.register({
        deviceId: 'skyline-001',
        deviceType: 'mmwave_radar',
        firmwareVersion: '1.0.0',
      });

      expect(result.deviceId).toBe('skyline-001');
      expect(result.deviceType).toBe('mmwave_radar');
      expect(result.status).toBe('active');
    });
  });

  describe('get', () => {
    it('should retrieve device by ID', async () => {
      const mockResponse = {
        id: 'uuid-123',
        device_id: 'skyline-001',
        device_type: 'mmwave_radar',
        firmware_version: '1.0.0',
        status: 'active',
        last_seen_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(client, 'request').mockResolvedValue({ data: mockResponse });

      const result = await devices.get('skyline-001');

      expect(result.deviceId).toBe('skyline-001');
    });
  });

  describe('list', () => {
    it('should list all devices', async () => {
      const mockResponse = [
        {
          id: 'uuid-1',
          device_id: 'skyline-001',
          device_type: 'mmwave_radar',
          firmware_version: '1.0.0',
          status: 'active',
          last_seen_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      jest.spyOn(client, 'request').mockResolvedValue({ data: mockResponse });

      const results = await devices.list();

      expect(results).toHaveLength(1);
      expect(results[0].deviceId).toBe('skyline-001');
    });
  });
});
