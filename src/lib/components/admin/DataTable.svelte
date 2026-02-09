<script lang="ts">
	interface Props {
		headers: string[];
		children: import('svelte').Snippet;
	}

	let { headers, children }: Props = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-[#dbdde6] bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-[#f6f6f8]">
				<tr>
					{#each headers as header (header)}
						<th
							class="px-6 py-3 text-left text-xs font-bold tracking-wider text-[#616889] uppercase"
						>
							{header}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-[#dbdde6]">
				{@render children()}
			</tbody>
		</table>
	</div>
</div>
