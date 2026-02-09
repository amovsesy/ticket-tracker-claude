<script lang="ts">
	import { enhance } from '$app/forms';

	let { userEmail }: { userEmail: string } = $props();
</script>

<div class="border-b-2 border-yellow-400 bg-yellow-100">
	<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="text-2xl">⚠️</span>
				<div>
					<p class="text-sm font-bold text-yellow-900">Impersonation Mode Active</p>
					<p class="text-xs text-yellow-800">
						You are viewing as <span class="font-semibold">{userEmail}</span>
					</p>
				</div>
			</div>
			<form method="POST" action="/admin/impersonate/exit" use:enhance>
				<button
					type="submit"
					class="rounded-lg bg-yellow-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-800"
				>
					Exit Impersonation
				</button>
			</form>
		</div>
	</div>
</div>
