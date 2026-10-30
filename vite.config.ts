import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
	if (mode === 'staging') {
		process.env.NODE_ENV = 'staging';
	}

	return {
		preview: {
			port: 3000,
			strictPort: true,
		},
		plugins: [
			preact(),
			VitePWA({
				filename: 'sw.ts',
				includeManifestIcons: false,
				injectRegister: false,
				manifest: {
					name: 'YT Playlist Notifier',
					short_name: 'YT Playlist Notifier',
					description: 'Get notifications when YouTube playlists are updated.',
					theme_color: '#ffffff',
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
	};
});
