import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('foodapp_access-token');
	const path = event.url.pathname;

	if (!token && event.url.pathname.startsWith('/homepage')) {
		throw redirect(302, '/');
	}

	 if (token && path === '/') {
        throw redirect(302, '/homepage');
    }

	return resolve(event);
}