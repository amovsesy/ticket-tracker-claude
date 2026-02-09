<script lang="ts">
	interface Props {
		title?: string;
		variant?: 'info' | 'warning' | 'success' | 'error';
		children: import('svelte').Snippet;
	}

	let { title, variant = 'info', children }: Props = $props();

	const styles = {
		info: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-[#111218]',
			iconBg: 'bg-primary/10',
			iconColor: 'text-primary'
		},
		warning: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			text: 'text-yellow-900',
			iconBg: 'bg-yellow-100',
			iconColor: 'text-yellow-600'
		},
		success: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-900',
			iconBg: 'bg-green-100',
			iconColor: 'text-green-600'
		},
		error: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			text: 'text-red-900',
			iconBg: 'bg-red-100',
			iconColor: 'text-red-600'
		}
	};

	const style = $derived(styles[variant]);

	const icons = {
		info: 'info',
		warning: 'warning',
		success: 'check_circle',
		error: 'error'
	};

	const icon = $derived(icons[variant]);
</script>

<div class="rounded-2xl border {style.border} {style.bg} p-6 shadow-sm">
	<div class="flex gap-4">
		<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl {style.iconBg}">
			<span class="material-symbols-outlined {style.iconColor}">
				{icon}
			</span>
		</div>
		<div class="flex-1 {style.text}">
			{#if title}
				<h3 class="mb-2 leading-tight font-bold">{title}</h3>
			{/if}
			{@render children()}
		</div>
	</div>
</div>
