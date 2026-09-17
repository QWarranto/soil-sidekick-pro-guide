import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.c29496b8b94f4984a05eae17a8a8cef8',
  appName: 'SoilSidekick Pro',
  webDir: 'dist',
  server: {
    url: 'https://c29496b8-b94f-4984-a05e-ae17a8a8cef8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#22c55e',
      showSpinner: false
    }
  }
};

export default config;
