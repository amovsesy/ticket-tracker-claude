<script lang="ts">
	interface Props {
		active?: boolean;
		onclick?: () => void;
		icon?: string;
		children: import('svelte').Snippet;
	}

	let { active = false, onclick, icon, children }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full px-4 text-xs font-semibold transition-all {active
		? 'bg-primary text-white shadow-sm'
		: 'hover:border-primary/30 border border-[#dbdde6] bg-white text-[#111218]'}"
>
	{@render children()}
	{#if icon}
		<span class="material-symbols-outlined text-sm">{icon}</span>
	{/if}
</button>
