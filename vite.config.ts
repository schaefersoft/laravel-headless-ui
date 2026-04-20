import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'resources/js/hui.ts'),
            formats: ['es'],
            fileName: 'hui',
        },
        outDir: 'dist/js',
        emptyOutDir: true,
    },
});
