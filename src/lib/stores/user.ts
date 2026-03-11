import { writable } from 'svelte/store';

export const user = writable<null | { id: number; email: string }>(null);

export function setUser(data: { id: number; email: string }) {
	user.set(data);
}

export function clearUser() {
	user.set(null);
}