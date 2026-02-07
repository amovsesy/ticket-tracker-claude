<script lang="ts">
	import { goto } from '$app/navigation';
	import { SignedIn, UserButton } from '$lib/components/clerk';
	import clerkStore from '$lib/components/clerk/store';

	let { showBackButton = false } = $props<{ showBackButton?: boolean }>();

	let clerk = $state($clerkStore);
	let isSignedIn = $derived(clerk?.user != null);

	clerkStore.subscribe((value) => {
		clerk = value;
	});
</script>

<header
	class="sticky top-0 z-50 border-b border-[#dbdde6] bg-white/80 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
		<!-- Left: Back Button or Logo -->
		<div class="flex items-center gap-2">
			{#if showBackButton}
				<button
					type="button"
					onclick={() => goto('/dashboard')}
					aria-label="Go back"
					class="flex size-10 shrink-0 cursor-pointer items-center justify-center text-[#111218]"
				>
					<span class="material-symbols-outlined">arrow_back_ios</span>
				</button>
			{:else}
				<button
					type="button"
					onclick={() => goto('/')}
					class="flex items-center gap-2"
				>
					<div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<span class="material-symbols-outlined text-[24px]">confirmation_number</span>
					</div>
					<h2 class="text-lg font-bold leading-tight tracking-tight text-[#111218]">
						PriceTracker
					</h2>
				</button>
			{/if}
		</div>

		<!-- Right: User Button or Sign In -->
		<div class="flex items-center gap-2">
			{#if isSignedIn}
				<UserButton />
			{:else}
				<button
					type="button"
					onclick={() => goto('/login')}
					class="rounded-lg px-4 py-2 text-sm font-bold leading-normal tracking-wide text-primary transition-colors hover:bg-primary/5"
				>
					Sign In
				</button>
			{/if}
		</div>
	</div>
</header>
