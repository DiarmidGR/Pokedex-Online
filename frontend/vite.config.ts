import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the environment mode
  const envFile = mode === 'production' ? `.env.preview` : `.env`; // Use `.env` for dev, `.env.preview` for production
  const env = dotenv.config({ path: envFile }).parsed;

  // Return Vite configuration object
  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    server: {
      host: mode === 'development', // Enable public access only for development mode
      port: 5173, // You can adjust the port for dev mode if needed
    },
    // define the port the project runs on when we execute npm run preview
    // host: true exposes the project on public address
    preview: {
      host: true,
      port: 8080,
      allowedHosts: ['pokemon.diarmid.ca']
    }
  };
});
