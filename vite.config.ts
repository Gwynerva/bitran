import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { SassString } from 'sass';
import { resolve } from 'node:path';

import { cls } from './src/render/class';

export default defineConfig({
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            formats: ['es'],
            entry: {
                'index':    './src/index.ts',
                'default':  './src/default/index.ts',
                'dom':      './src/dom/index.ts',
                'process':  './src/process/index.ts',
                'core':     './src/core/index.ts',
                'render':   './src/render/index.ts',
            }
        },
        rollupOptions: {
            output: {
                chunkFileNames: '_chunks/[name]-[hash].js',
                entryFileNames: `[name].js`,
            },
            external: ['vue', 'yaml'],
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                functions: {
                    '_($className)': args => new SassString(`.${cls[args[0] as any]}`),
                },
            },
        },
    },
    resolve: {
        alias: {
            '$public': resolve(__dirname, './public/public'),
            '$styles': resolve(__dirname, './src/render/styles'),
        },
    },
    plugins: [
        tsconfigPaths({ loose: true }),
        vue(),
        dts({ outDir: './dist/_types', exclude: ["**/__test__/**/*"] }),
    ]
})