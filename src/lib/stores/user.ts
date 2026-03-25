import { writable, type Writable } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  photo_url?: string;
}

function safeParseUser(item: string | null): User | null {
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

const storedUser = localStorage.getItem("user");

export const userStore: Writable<any | null> = writable(storedUser ? JSON.parse(storedUser) : null);

if (typeof window !== 'undefined') {
  const storedUser = safeParseUser(localStorage.getItem('user'));
  if (storedUser) userStore.set(storedUser);

  userStore.subscribe((value) => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      // localStorage.removeItem('user');
    }
  });
}