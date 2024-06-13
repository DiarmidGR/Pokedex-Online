import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the environment mode
  const env = dotenv.config({ path: `.env.${mode}` }).parsed;

  // Return Vite configuration object
  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    // define the port the project runs on when we execute npm run preview
    // host: true exposes the project on public address
    preview: {
      host: true,
      port: 8080
    }
  };
});
