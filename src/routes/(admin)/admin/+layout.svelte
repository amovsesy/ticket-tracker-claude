<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const navItems = [
		{ label: 'Dashboard', href: '/admin', icon: '📊' },
		{ label: 'Users', href: '/admin/users', icon: '👥' },
		{ label: 'Events', href: '/admin/events', icon: '🎫' },
		{ label: 'Pricing', href: '/admin/pricing', icon: '💰' },
		{ label: 'Notifications', href: '/admin/notifications', icon: '📧' }
	];

	function isActive(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="flex h-screen bg-[#f6f6f8]">
	<!-- Sidebar -->
	<aside class="flex w-64 flex-col border-r border-[#dbdde6] bg-white">
		<!-- Logo/Brand -->
		<div class="border-b border-[#dbdde6] p-6">
			<h1 class="text-xl font-bold text-[#111218]">Ticket Tracker</h1>
			<p class="text-sm text-[#616889]">Admin Panel</p>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 p-4">
			<ul class="space-y-2">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={resolve(item.href)}
							data-sveltekit-preload-data
							class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors {isActive(
								item.href
							)
								? 'bg-[#1337ec] text-white'
								: 'text-[#616889] hover:bg-[#f6f6f8]'}"
						>
							<span class="text-xl">{item.icon}</span>
							<span class="font-medium">{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Admin Info -->
		<div class="border-t border-[#dbdde6] p-4">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-[#1337ec] font-bold text-white"
				>
					{data.admin.name[0].toUpperCase()}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-[#111218]">{data.admin.name}</p>
					<p class="truncate text-xs text-[#616889]">{data.admin.email}</p>
				</div>
			</div>
			<a
				href={resolve('/dashboard')}
				data-sveltekit-preload-data
				class="mt-3 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-[#616889] transition-colors hover:bg-[#f6f6f8]"
			>
				Exit Admin
			</a>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto">
		<div class="mx-auto max-w-7xl p-8">
			{@render children()}
		</div>
	</main>
</div>
