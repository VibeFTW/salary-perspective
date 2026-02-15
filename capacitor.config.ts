import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibeftw.salaryperspective',
  appName: 'Gehaltsblick',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
