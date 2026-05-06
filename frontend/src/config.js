const config = {
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME || 'Health Analytics Dashboard',
};

export default config;
