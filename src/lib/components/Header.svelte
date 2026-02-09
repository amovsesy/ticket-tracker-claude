<script lang="ts">
	import { resolve } from '$app/paths';
	import { UserButton } from '$lib/components/clerk';
	import clerkStore from '$lib/components/clerk/store';

	let { showBackButton = false } = $props<{ showBackButton?: boolean }>();

	let clerk = $state($clerkStore);
	let isSignedIn = $derived(clerk?.user != null);

	clerkStore.subscribe((value) => {
		clerk = value;
	});
</script>

<header class="sticky top-0 z-50 border-b border-[#dbdde6] bg-white/80 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<!-- Left: Back Button or Logo -->
		<div class="flex items-center gap-2">
			{#if showBackButton}
				<a
					href={resolve('/dashboard')}
					data-sveltekit-preload-data
					aria-label="Go back"
					class="flex size-10 shrink-0 cursor-pointer items-center justify-center text-[#111218]"
				>
					<span class="material-symbols-outlined">arrow_back_ios</span>
				</a>
			{:else}
				<a href={resolve('/')} data-sveltekit-preload-data class="flex items-center gap-2">
					<div
						class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg"
					>
						<span class="material-symbols-outlined text-[24px]">confirmation_number</span>
					</div>
					<h2 class="text-lg leading-tight font-bold tracking-tight text-[#111218]">
						PriceTracker
					</h2>
				</a>
			{/if}
		</div>

		<!-- Right: User Button or Sign In -->
		<div class="flex items-center gap-2">
			{#if isSignedIn}
				<UserButton />
			{:else}
				<a
					href={resolve('/login')}
					data-sveltekit-preload-data
					class="text-primary hover:bg-primary/5 rounded-lg px-4 py-2 text-sm leading-normal font-bold tracking-wide transition-colors"
				>
					Sign In
				</a>
			{/if}
		</div>
	</div>
</header>
