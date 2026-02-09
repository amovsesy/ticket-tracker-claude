<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="rounded-2xl border border-[#dbdde6] bg-white p-4 shadow-sm">
	<div class="flex flex-wrap gap-4">
		{@render children()}
	</div>
</div>
