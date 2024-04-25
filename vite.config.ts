import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteTsconfigPaths()],
  server: {
    port: 3111
  }
});
