import type {Plugin} from 'vite';
import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';
import {VitePWA} from 'vite-plugin-pwa';
import {marked} from 'marked';
import postcssJitProps from 'postcss-jit-props';
import OpenProps from 'open-props';

// Renders imported `.md` files into a Preact `ReactComponent`, matching the
// `import {ReactComponent} from './some.md';` shape that About.tsx expects.
function markdown(): Plugin {
	return {
		name: 'markdown-to-preact',
		transform(code, id) {
			if (!id.endsWith('.md')) {
				return;
			}

			const html = marked.parse(code, {async: false});
			return {
				code: `import {h} from 'preact';
const html = ${JSON.stringify(html)};
export function ReactComponent() {
	return h('div', {dangerouslySetInnerHTML: {__html: html}});
}
`,
				map: null,
			};
		},
	};
}

export default defineConfig(({mode}) => {
	if (mode === 'staging') {
		process.env.NODE_ENV = 'staging';
	}

	return {
		preview: {
			port: 3000,
			strictPort: true,
		},
		css: {
			postcss: {
				plugins: [postcssJitProps(OpenProps)],
			},
		},
		plugins: [
			markdown(),
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
	};
});
