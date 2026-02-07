import { writable, type Writable } from 'svelte/store';

// Use any type to avoid SSR import issues with @clerk/clerk-js
type Clerk = any;

// Create a writable store for Clerk.
const clerk: Writable<Clerk | null> = writable(null);
export default clerk;
