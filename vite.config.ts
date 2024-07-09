// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {port:3000}
// })
import react from '@vitejs/plugin-react';

import {defineConfig} from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    plugins: [react(), mkcert()],
    server: {port: 3000},
});
