<script lang="ts">
	interface Props {
		variant?: 'info' | 'warning' | 'success' | 'error';
		icon?: string;
		title?: string;
		children: import('svelte').Snippet;
	}

	let { variant = 'info', icon, title, children }: Props = $props();

	const styles = {
		info: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-900',
			icon: 'text-blue-600'
		},
		warning: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			text: 'text-yellow-900',
			icon: 'text-yellow-600'
		},
		success: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-900',
			icon: 'text-green-600'
		},
		error: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			text: 'text-red-900',
			icon: 'text-red-600'
		}
	};

	const style = $derived(styles[variant]);
</script>

<div class="rounded-2xl border {style.border} {style.bg} p-4 shadow-sm">
	<div class="flex items-center gap-3">
		{#if icon}
			<span class="text-2xl {style.icon}">{icon}</span>
		{/if}
		<div class="flex-1 {style.text}">
			{#if title}
				<p class="text-sm font-bold">{title}</p>
			{/if}
			<div class="text-xs">
				{@render children()}
			</div>
		</div>
	</div>
</div>
