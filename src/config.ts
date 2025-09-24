interface AppConfig {
  backendBaseUrl: string;
  env: string;
  apiKey: string;
}

const config: AppConfig = {
  backendBaseUrl:
    import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3001',
  env: import.meta.env.VITE_ENV || 'development',
  apiKey: import.meta.env.VITE_API_KEY || '',
};

export default config;
