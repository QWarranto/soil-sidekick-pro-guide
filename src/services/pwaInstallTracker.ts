import { supabase } from '@/integrations/supabase/client';

/**
 * PWA Install Analytics Service
 * Tracks PWA installation prompts, user interactions, and install completions
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

class PWAInstallTracker {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installPromptShown = false;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    // Track when install prompt is available
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.trackPromptAvailable();
    });

    // Track when app is installed
    window.addEventListener('appinstalled', () => {
      this.trackAppInstalled();
    });

    // Check if already installed
    this.checkIfInstalled();
  }

  /**
   * Track when the install prompt becomes available
   */
  private async trackPromptAvailable() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('pwa_analytics').insert({
        user_id: user?.id || null,
        event_type: 'prompt_available',
        user_agent: navigator.userAgent,
        platform: this.getPlatform(),
        timestamp: new Date().toISOString(),
      });

      console.log('PWA install prompt available');
    } catch (error) {
      console.error('Failed to track prompt available:', error);
    }
  }

  /**
   * Show the install prompt to the user
   */
  async showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      return 'unavailable';
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      this.installPromptShown = true;

      // Wait for user choice
      const { outcome } = await this.deferredPrompt.userChoice;

      // Track the user's choice
      await this.trackUserChoice(outcome);

      // Clear the prompt
      this.deferredPrompt = null;

      return outcome;
    } catch (error) {
      console.error('Failed to show install prompt:', error);
      return 'unavailable';
    }
  }

  /**
   * Track user's choice when shown the install prompt
   */
  private async trackUserChoice(outcome: 'accepted' | 'dismissed') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('pwa_analytics').insert({
        user_id: user?.id || null,
        event_type: outcome === 'accepted' ? 'prompt_accepted' : 'prompt_dismissed',
        user_agent: navigator.userAgent,
        platform: this.getPlatform(),
        timestamp: new Date().toISOString(),
      });

      console.log(`PWA install prompt ${outcome}`);
    } catch (error) {
      console.error('Failed to track user choice:', error);
    }
  }

  /**
   * Track when the app is successfully installed
   */
  private async trackAppInstalled() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('pwa_analytics').insert({
        user_id: user?.id || null,
        event_type: 'app_installed',
        user_agent: navigator.userAgent,
        platform: this.getPlatform(),
        timestamp: new Date().toISOString(),
      });

      console.log('PWA installed successfully');

      // Store install status in localStorage
      localStorage.setItem('pwa_installed', 'true');
      localStorage.setItem('pwa_install_date', new Date().toISOString());
    } catch (error) {
      console.error('Failed to track app installed:', error);
    }
  }

  /**
   * Check if app is already installed
   */
  private async checkIfInstalled() {
    const isInstalled = this.isAppInstalled();
    
    if (isInstalled && !localStorage.getItem('pwa_tracked_install')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('pwa_analytics').insert({
          user_id: user?.id || null,
          event_type: 'already_installed',
          user_agent: navigator.userAgent,
          platform: this.getPlatform(),
          timestamp: new Date().toISOString(),
        });

        localStorage.setItem('pwa_tracked_install', 'true');
      } catch (error) {
        console.error('Failed to track already installed:', error);
      }
    }
  }

  /**
   * Check if the app is currently installed
   */
  isAppInstalled(): boolean {
    // Check if running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check iOS standalone
    const isIOSStandalone = (navigator as any).standalone === true;
    
    // Check localStorage flag
    const wasInstalled = localStorage.getItem('pwa_installed') === 'true';

    return isStandalone || isIOSStandalone || wasInstalled;
  }

  /**
   * Check if install prompt is available
   */
  isPromptAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Get the current platform
   */
  private getPlatform(): string {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('android')) return 'android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('windows')) return 'windows';
    if (ua.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  /**
   * Get install analytics summary
   */
  async getInstallAnalytics(startDate?: string, endDate?: string) {
    try {
      let query = supabase
        .from('pwa_analytics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (startDate) {
        query = query.gte('timestamp', startDate);
      }

      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate metrics
      const promptsShown = data?.filter(e => e.event_type === 'prompt_available').length || 0;
      const promptsAccepted = data?.filter(e => e.event_type === 'prompt_accepted').length || 0;
      const promptsDismissed = data?.filter(e => e.event_type === 'prompt_dismissed').length || 0;
      const installs = data?.filter(e => e.event_type === 'app_installed').length || 0;
      
      const installRate = promptsShown > 0 ? (installs / promptsShown) * 100 : 0;
      const acceptanceRate = (promptsAccepted + promptsDismissed) > 0 
        ? (promptsAccepted / (promptsAccepted + promptsDismissed)) * 100 
        : 0;

      // Platform breakdown
      const platformBreakdown = data?.reduce((acc, event) => {
        const platform = event.platform || 'unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalPrompts: promptsShown,
        totalAccepted: promptsAccepted,
        totalDismissed: promptsDismissed,
        totalInstalls: installs,
        installRate: installRate.toFixed(2),
        acceptanceRate: acceptanceRate.toFixed(2),
        platformBreakdown,
        events: data,
      };
    } catch (error) {
      console.error('Failed to get install analytics:', error);
      return null;
    }
  }
}

// Export singleton instance
export const pwaInstallTracker = new PWAInstallTracker();
