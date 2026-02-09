<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let typeFilter = $state<'all' | 'email' | 'sms'>('all');
	let statusFilter = $state<'all' | 'successful' | 'failed'>('all');

	let filteredNotifications = $derived(
		data.notifications.filter((notif) => {
			const matchesType = typeFilter === 'all' || notif.type === typeFilter;
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'successful' && notif.wasSuccessful) ||
				(statusFilter === 'failed' && !notif.wasSuccessful);
			return matchesType && matchesStatus;
		})
	);

	function formatDateTime(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString();
	}
</script>

<svelte:head>
	<title>Notifications - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-[#111218]">Notifications</h1>
			<p class="mt-2 text-[#616889]">View notification history and delivery status</p>
		</div>
		<a
			href={resolve('/admin/notifications/send')}
			data-sveltekit-preload-data
			class="rounded-lg bg-[#1337ec] px-4 py-2 font-medium text-white transition-colors hover:bg-[#0f2ab3]"
		>
			Send Notification
		</a>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-5">
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Total Sent</p>
			<p class="text-2xl font-bold text-[#111218]">{data.stats.total}</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Successful</p>
			<p class="text-2xl font-bold text-green-600">{data.stats.successful}</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Failed</p>
			<p class="text-2xl font-bold text-red-600">{data.stats.failed}</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Email</p>
			<p class="text-2xl font-bold text-[#111218]">{data.stats.email}</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">SMS</p>
			<p class="text-2xl font-bold text-[#111218]">{data.stats.sms}</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
		<div class="flex flex-wrap gap-4">
			<!-- Type Filter -->
			<select
				bind:value={typeFilter}
				class="rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
			>
				<option value="all">All Types</option>
				<option value="email">Email Only</option>
				<option value="sms">SMS Only</option>
			</select>

			<!-- Status Filter -->
			<select
				bind:value={statusFilter}
				class="rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
			>
				<option value="all">All Status</option>
				<option value="successful">Successful Only</option>
				<option value="failed">Failed Only</option>
			</select>
		</div>
	</div>

	<!-- Notifications Table -->
	<div class="overflow-hidden rounded-lg border border-[#dbdde6] bg-white">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-[#f6f6f8]">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Type
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Recipient
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							User
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Event
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Sent At
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Status
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#dbdde6]">
					{#if filteredNotifications.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-[#616889]">
								{#if data.notifications.length === 0}
									No notifications sent yet
								{:else}
									No notifications match your filters
								{/if}
							</td>
						</tr>
					{:else}
						{#each filteredNotifications as notification (notification.id)}
							<tr class="transition-colors hover:bg-[#f6f6f8]">
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {notification.type ===
										'email'
											? 'bg-blue-100 text-blue-800'
											: 'bg-green-100 text-green-800'}"
									>
										{notification.type === 'email' ? '📧 Email' : '📱 SMS'}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-[#111218]">
									{notification.recipient}
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">
									{notification.userEmail}
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">
									{notification.eventName}
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">
									{formatDateTime(notification.sentAt)}
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {notification.wasSuccessful
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'}"
										>
											{notification.wasSuccessful ? '✓ Sent' : '✗ Failed'}
										</span>
										{#if notification.errorMessage}
											<button
												title={notification.errorMessage}
												class="text-xs text-red-600 hover:underline"
											>
												View Error
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Pagination Info -->
	<div class="text-center text-sm text-[#616889]">
		Showing last 100 notifications. Use filters to narrow results.
	</div>
</div>
