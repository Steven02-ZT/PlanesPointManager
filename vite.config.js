import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubAuthToken = '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';

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    'process.env.GITHUB_AUTH_TOKEN': JSON.stringify(githubAuthToken),
  },
});
