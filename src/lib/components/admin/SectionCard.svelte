<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		children: import('svelte').Snippet;
		padding?: boolean;
	}

	let { title, description, children, padding = true }: Props = $props();
</script>

<div class="rounded-2xl border border-[#dbdde6] bg-white shadow-sm {padding ? 'p-6' : ''}">
	{#if title}
		<div class={padding ? 'mb-4' : 'p-6 pb-4'}>
			<h2 class="text-xl leading-tight font-bold text-[#111218]">{title}</h2>
			{#if description}
				<p class="mt-2 text-sm leading-relaxed text-[#616889]">{description}</p>
			{/if}
		</div>
	{/if}
	{@render children()}
</div>
