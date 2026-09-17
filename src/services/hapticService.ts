import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Haptic Feedback Service
 * Provides tactile feedback for mobile interactions
 * Gracefully degrades on web browsers
 */

class HapticService {
  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private async checkAvailability() {
    try {
      // Haptics is only available on mobile devices
      this.isAvailable = true;
    } catch (error) {
      console.log('Haptics not available on this platform');
      this.isAvailable = false;
    }
  }

  /**
   * Light impact - for subtle interactions
   * Use for: Hover effects, selection changes, minor UI updates
   */
  async light() {
    if (!this.isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Medium impact - for standard interactions
   * Use for: Button clicks, toggles, standard actions
   */
  async medium() {
    if (!this.isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Heavy impact - for important interactions
   * Use for: Confirmation actions, important buttons, destructive actions
   */
  async heavy() {
    if (!this.isAvailable) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Success notification
   * Use for: Successful form submissions, completed tasks, confirmations
   */
  async success() {
    if (!this.isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Warning notification
   * Use for: Validation warnings, important notices
   */
  async warning() {
    if (!this.isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Error notification
   * Use for: Failed actions, errors, destructive confirmations
   */
  async error() {
    if (!this.isAvailable) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Selection changed
   * Use for: Picker changes, slider movements, selection updates
   */
  async selectionChanged() {
    if (!this.isAvailable) return;
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.debug('Haptic feedback failed:', error);
    }
  }

  /**
   * Vibrate with custom pattern (fallback for web)
   * Use for: Custom vibration patterns when Capacitor Haptics isn't available
   */
  async vibratePattern(pattern: number | number[]) {
    if (!this.isAvailable && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.debug('Vibration failed:', error);
      }
    }
  }
}

// Export singleton instance
export const hapticService = new HapticService();
