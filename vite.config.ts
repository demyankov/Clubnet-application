import react from '@vitejs/plugin-react-swc';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression2';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$ /, /\.(gz)$/],
    }),
  ],
  build: {
    rollupOptions: {
      plugins: [analyze()],
    },
  },
});
