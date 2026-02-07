<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let currentPath = $derived($page.url.pathname);

	const navItems = [
		{ path: '/dashboard', icon: 'dashboard', label: 'Events' },
		{ path: '/add', icon: 'add_box', label: 'Add New' },
		{ path: '/alerts', icon: 'notifications', label: 'Alerts' },
		{ path: '/settings', icon: 'settings', label: 'Settings' }
	];
</script>

<!-- Desktop Sidebar Navigation (hidden on mobile) -->
<aside class="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 border-r border-[#dbdde6] bg-white md:block">
	<nav class="flex flex-col gap-1 p-4">
		{#each navItems as item}
			<button
				type="button"
				onclick={() => goto(item.path)}
				class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {currentPath === item.path
					? 'bg-primary/10 text-primary'
					: 'text-[#616889] hover:bg-[#f0f1f4]'}"
			>
				<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
				<span>{item.label}</span>
			</button>
		{/each}
	</nav>
</aside>

<!-- Mobile Bottom Navigation (hidden on desktop) -->
<nav
	class="fixed bottom-0 left-0 right-0 z-50 border-t border-[#dbdde6] bg-white/80 backdrop-blur-lg md:hidden"
>
	<div class="flex justify-around px-6 py-4 pb-safe">
		{#each navItems as item}
			<button
				type="button"
				onclick={() => goto(item.path)}
				class="flex flex-col items-center gap-1 {currentPath === item.path
					? 'text-primary'
					: 'text-[#616889]'}"
			>
				<span
					class="material-symbols-outlined text-[24px]"
					style="font-variation-settings: 'FILL' {currentPath === item.path ? '1' : '0'};"
				>
					{item.icon}
				</span>
				<span class="text-[10px] {currentPath === item.path ? 'font-bold' : 'font-medium'}">
					{item.label}
				</span>
			</button>
		{/each}
	</div>
</nav>

<!-- Home Indicator (mobile only) -->
<div class="fixed bottom-1 left-1/2 z-[60] h-1 w-32 -translate-x-1/2 rounded-full bg-black/10 md:hidden"></div>
