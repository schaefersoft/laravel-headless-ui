import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['resources/js/**/*.test.ts'],
        environment: 'happy-dom',        // oder 'node' wenn kein DOM nötig
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            reporter: ['text', 'lcov']
        }
    }
});
