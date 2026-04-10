import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const deployTarget = env.VITE_DEPLOY_TARGET || '';
  const basePath = env.VITE_BASE_PATH || '/';

  return {
    base: deployTarget === 'github-pages' ? basePath : '/',
    plugins: [react(), tailwindcss()],
  };
});
