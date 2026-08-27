import mqtt from 'mqtt';
import {
  MQTTConfig,
  MQTTPublishOptions,
  ConnectionStatus,
} from '../types';

/**
 * MQTT Client for direct broker connection
 * 
 * Used for high-frequency sensor data publishing
 */
export class MQTTClient {
  private client: mqtt.MqttClient | null = null;
  private config: MQTTConfig;
  private status: ConnectionStatus = 'disconnected';
  private messageHandlers: Map<string, ((message: any) => void)[]> = new Map();
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];

  constructor(config: MQTTConfig) {
    this.config = config;
  }

  /**
   * Connect to MQTT broker
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.config.protocol}://${this.config.host}:${this.config.port}`;

      this.client = mqtt.connect(url, {
        username: this.config.username,
        password: this.config.password,
        reconnectPeriod: this.config.reconnectPeriod || 5000,
        connectTimeout: this.config.connectTimeout || 30000,
        clean: true,
      });

      this.client.on('connect', () => {
        this.updateStatus('connected');
        console.log('✓ Connected to MQTT broker');
        resolve();
      });

      this.client.on('error', (err) => {
        this.updateStatus('error');
        console.error('MQTT Error:', err);
        reject(err);
      });

      this.client.on('disconnect', () => {
        this.updateStatus('disconnected');
        console.log('Disconnected from MQTT broker');
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message);
      });

      this.updateStatus('connecting');
    });
  }

  /**
   * Publish sensor data to topic
   * 
   * @param topic - MQTT topic (e.g., "skyline/device-001/readings")
   * @param payload - Data to publish
   * @param options - Publish options
   */
  publish(
    topic: string,
    payload: any,
    options?: MQTTPublishOptions
  ): void {
    if (!this.client || !this.client.connected) {
      throw new Error('MQTT client not connected');
    }

    const message = typeof payload === 'string'
      ? payload
      : JSON.stringify(payload);

    this.client.publish(topic, message, {
      qos: options?.qos ?? 1,
      retain: options?.retain ?? false,
    });
  }

  /**
   * Subscribe to MQTT topic
   * 
   * @param topic - Topic pattern (can use wildcards)
   * @param handler - Message handler
   * @param qos - Quality of Service
   */
  subscribe(
    topic: string,
    handler: (message: any) => void,
    qos: 0 | 1 | 2 = 1
  ): void {
    if (!this.client) {
      throw new Error('MQTT client not initialized');
    }

    this.client.subscribe(topic, { qos }, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${topic}:`, err);
        return;
      }

      if (!this.messageHandlers.has(topic)) {
        this.messageHandlers.set(topic, []);
      }
      this.messageHandlers.get(topic)!.push(handler);
      console.log(`Subscribed to ${topic}`);
    });
  }

  /**
   * Unsubscribe from topic
   */
  unsubscribe(topic: string): void {
    if (!this.client) return;

    this.client.unsubscribe(topic);
    this.messageHandlers.delete(topic);
    console.log(`Unsubscribed from ${topic}`);
  }

  /**
   * Disconnect from broker
   */
  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.updateStatus('disconnected');
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Listen for connection status changes
   */
  onStatusChange(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.push(listener);
  }

  private updateStatus(status: ConnectionStatus): void {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  private handleMessage(topic: string, message: Buffer): void {
    // Check exact topic match
    const exactHandlers = this.messageHandlers.get(topic);
    if (exactHandlers) {
      this.processMessage(exactHandlers, message);
    }

    // Check wildcard subscriptions
    this.messageHandlers.forEach((handlers, subscriptionTopic) => {
      if (this.topicMatches(subscriptionTopic, topic)) {
        this.processMessage(handlers, message);
      }
    });
  }

  private processMessage(
    handlers: ((message: any) => void)[],
    message: Buffer
  ): void {
    const payload = this.parseMessage(message);
    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error('Message handler error:', err);
      }
    });
  }

  private topicMatches(subscription: string, topic: string): boolean {
    // Handle wildcards: + (single level), # (multi level)
    const subParts = subscription.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < subParts.length; i++) {
      if (subParts[i] === '#') return true;
      if (subParts[i] === '+') continue;
      if (subParts[i] !== topicParts[i]) return false;
    }

    return subParts.length === topicParts.length;
  }

  private parseMessage(message: Buffer): any {
    try {
      return JSON.parse(message.toString());
    } catch {
      return message.toString();
    }
  }
}
