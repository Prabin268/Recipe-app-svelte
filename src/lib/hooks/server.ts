import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('foodapp_access-token');

	const publicRoutes = ['/', '/login', '/signup'];
    const protectedRoutes = ['/homepage', '/searchpage', '/savedpage', '/profilepage'];

	if (token && publicRoutes.includes(event.url.pathname)) {
        throw redirect(302, '/homepage');
    }

	if (!token && protectedRoutes.some(route => event.url.pathname.startsWith(route))) {
		throw redirect(302, '/login');
	}

	return resolve(event);
}