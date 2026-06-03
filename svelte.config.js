import adapter from '@sveltejs/adapter-auto';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false
		},
		files: {
			serviceWorker: 'src/sw.ts'
		}
	},
	alias: {
		$lib: path.resolve('./src/lib')
	}
};

export default config;