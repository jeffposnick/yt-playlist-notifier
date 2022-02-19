import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';
import {VitePWA} from 'vite-plugin-pwa';
import markdown, {Mode} from 'vite-plugin-markdown';
import postcssJitProps from 'postcss-jit-props';
import OpenProps from 'open-props';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssJitProps(OpenProps)],
    },
  },
  plugins: [
    markdown({mode: [Mode.REACT]}),
    preact(),
    VitePWA({
      filename: 'sw.ts',
      includeAssets: ['*.svg'],
      includeManifestIcons: false,
      injectRegister: false,
      manifest: {
        name: 'YT Playlist Notifier',
        short_name: 'YT Playlist Notifier',
        description: 'Get notifications when YouTube playlists are updated.',
        theme_color: '#ced4da',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      srcDir: 'src/service-worker',
      strategies: 'injectManifest',
    }),
  ],
});
