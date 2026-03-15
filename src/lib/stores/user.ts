import { writable, type Writable } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  photo_url?: string;
}

const storedUser = typeof localStorage !== 'undefined'
  ? JSON.parse(localStorage.getItem('user') || 'null')
  : null;

export const userStore: Writable<User | null> = writable(storedUser)

userStore.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(value) ?? null);
  }
});