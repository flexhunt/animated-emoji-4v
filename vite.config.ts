import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AnimatedEmoji', // Global variable name for UMD
            fileName: (format) => `animated-emoji.${format}.js`
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react', 'react-dom'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
});
