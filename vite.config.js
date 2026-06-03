import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		devtoolsJson(),
		tailwindcss(),
		sveltekit(),

		SvelteKitPWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'sw.ts',

			injectManifest: {
				globDirectory: 'static',
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2']
			},

			registerType: 'autoUpdate',

			manifest: {
				name: 'Recipe App',
				short_name: 'RecipeApp',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#f97316',
				icons: [
					{
						src: '/recipe-icon.png',
						sizes: '192x192',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/'
			},
			kit: {
				includeVersionFile: true
			}
		})
	]
});
