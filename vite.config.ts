import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

import { dependencies, devDependencies, peerDependencies } from './package.json';

export default defineConfig({
    build: {
        sourcemap: false,
        minify: false,
        lib: {
            formats: ['es'],
            entry: {
                'index':    './src/index.ts',
                'core':     './src/core/index.ts',
                'render':   './src/render/index.ts',
                'default': './src/default/index.ts',
                'util':     './src/util/index.ts',
            }
        },
        rollupOptions: {
            external: moduleId => moduleId.startsWith('node:') || dependencies[moduleId] || devDependencies[moduleId] || peerDependencies[moduleId],
        },
    },
    plugins: [
        tsconfigPaths(),
        vue(),
        dts({ outDir: './dist/types', include: ['./src/**/*', './components/**/*'] }),
    ],
});