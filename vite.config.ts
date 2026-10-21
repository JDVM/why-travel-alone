/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // REACT_APP_* settings are kept from the create-react-app days, so
    // deployments and .env files don't have to change.
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: { port: 3000 },
    preview: { port: 3000 },
    build: {
        // Same output folder as before, which the Dockerfile copies.
        outDir: 'build',
        sourcemap: false,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.{ts,tsx,js,jsx}'],
        // Like create-react-app's Jest setup: every test starts with fresh mocks.
        mockReset: true,
    },
});
