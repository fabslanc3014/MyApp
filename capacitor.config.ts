import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fabregas.weconnect',
  appName: 'WeConnect',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;