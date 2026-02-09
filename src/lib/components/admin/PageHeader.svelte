<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		children?: import('svelte').Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-3xl leading-tight font-black tracking-tight text-[#111218]">{title}</h1>
		{#if description}
			<p class="mt-2 text-base text-[#616889]">{description}</p>
		{/if}
	</div>
	{#if children}
		<div>
			{@render children()}
		</div>
	{/if}
</div>
