import type { Component } from 'svelte';

export type ClerkButtonChildProps = {
	Button?: Component | undefined;
	text?: string | undefined;
	mode: 'redirect' | 'modal';
};
