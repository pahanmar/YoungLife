// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            try {
              // req.body может существовать, если какое-то middleware уже прочитал тело
              if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              }
            } catch (err) {
              console.error('proxyReq error', err);
            }
          });
        }
      }
    }
  }
});