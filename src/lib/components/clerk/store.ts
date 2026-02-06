import { writable, type Writable } from 'svelte/store';
import { type Clerk } from '@clerk/types';

// Create a writable store for Clerk.
const clerk: Writable<Clerk | null> = writable(null);
export default clerk;
