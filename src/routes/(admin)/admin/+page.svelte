<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString();
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Ticket Tracker</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold text-[#111218]">Admin Dashboard</h1>
		<p class="mt-2 text-[#616889]">
			Welcome to the admin panel. Manage users, events, and notifications.
		</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Total Users -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-[#616889]">Total Users</p>
					<p class="mt-2 text-3xl font-bold text-[#111218]">{data.stats.totalUsers}</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
					<span class="text-2xl">👥</span>
				</div>
			</div>
		</div>

		<!-- Total Events -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-[#616889]">Total Events</p>
					<p class="mt-2 text-3xl font-bold text-[#111218]">{data.stats.totalEvents}</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
					<span class="text-2xl">🎫</span>
				</div>
			</div>
		</div>

		<!-- Tracked Events -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-[#616889]">Tracked Events</p>
					<p class="mt-2 text-3xl font-bold text-[#111218]">{data.stats.totalTrackedEvents}</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
					<span class="text-2xl">📌</span>
				</div>
			</div>
		</div>

		<!-- Total Notifications -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-[#616889]">Notifications Sent</p>
					<p class="mt-2 text-3xl font-bold text-[#111218]">{data.stats.totalNotifications}</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
					<span class="text-2xl">📧</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="rounded-lg border border-[#dbdde6] bg-white">
		<div class="border-b border-[#dbdde6] p-6">
			<h2 class="text-xl font-bold text-[#111218]">Recent Notifications</h2>
		</div>
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
					{#if data.recentNotifications.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-[#616889]">
								No notifications sent yet
							</td>
						</tr>
					{:else}
						{#each data.recentNotifications as notification (notification.id)}
							<tr class="transition-colors hover:bg-[#f6f6f8]">
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {notification.type ===
										'email'
											? 'bg-blue-100 text-blue-800'
											: 'bg-green-100 text-green-800'}"
									>
										{notification.type === 'email' ? '📧 Email' : '📱 SMS'}
									</span>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-[#111218]">
									{notification.recipient}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-[#616889]">
									{notification.userEmail}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-[#616889]">
									{formatDate(notification.sentAt)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {notification.wasSuccessful
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
									>
										{notification.wasSuccessful ? '✓ Sent' : '✗ Failed'}
									</span>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<a
			href={resolve('/admin/users')}
			data-sveltekit-preload-data
			class="rounded-lg border border-[#dbdde6] bg-white p-6 transition-colors hover:border-[#1337ec]"
		>
			<h3 class="text-lg font-bold text-[#111218]">Manage Users</h3>
			<p class="mt-2 text-sm text-[#616889]">
				View and manage all users, impersonate, and toggle demo mode.
			</p>
		</a>

		<a
			href={resolve('/admin/events/new')}
			data-sveltekit-preload-data
			class="rounded-lg border border-[#dbdde6] bg-white p-6 transition-colors hover:border-[#1337ec]"
		>
			<h3 class="text-lg font-bold text-[#111218]">Create Event</h3>
			<p class="mt-2 text-sm text-[#616889]">Manually add events and price data.</p>
		</a>

		<a
			href={resolve('/admin/notifications/send')}
			data-sveltekit-preload-data
			class="rounded-lg border border-[#dbdde6] bg-white p-6 transition-colors hover:border-[#1337ec]"
		>
			<h3 class="text-lg font-bold text-[#111218]">Send Notification</h3>
			<p class="mt-2 text-sm text-[#616889]">Send manual notifications to users.</p>
		</a>
	</div>
</div>
