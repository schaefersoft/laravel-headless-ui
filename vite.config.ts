import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'resources/js/hui.ts'),
        },
        outDir: 'dist/js',
        emptyOutDir: true,
        rolldownOptions: {
            output: [
                { format: 'es', entryFileNames: 'hui.js' },
                { format: 'es', entryFileNames: 'hui.min.js', minify: true },
            ],
        },
    },
});
