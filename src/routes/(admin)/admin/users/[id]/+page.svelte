<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	}

	function formatDateTime(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString();
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}
</script>

<svelte:head>
	<title>{data.user.email} - User Details</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header with Back Button -->
	<div class="flex items-center gap-4">
		<a
			href={resolve('/admin/users')}
			class="inline-flex items-center text-[#616889] hover:text-[#111218]"
			data-sveltekit-preload-data
		>
			<span class="mr-2">←</span>
			Back to Users
		</a>
	</div>

	<!-- User Profile Card -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-[#111218]">{data.user.email}</h1>
				<div class="mt-2 flex gap-2">
					<span
						class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {data
							.user.tier === 'pro'
							? 'bg-blue-100 text-blue-800'
							: 'bg-gray-100 text-gray-800'}"
					>
						{data.user.tier === 'pro' ? '⭐ Pro' : 'Free'}
					</span>
					{#if data.user.isAdmin}
						<span
							class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"
						>
							Admin
						</span>
					{/if}
					{#if data.isDemoMode}
						<span
							class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
						>
							Demo Mode
						</span>
					{/if}
				</div>
			</div>
			<div class="flex gap-2">
				<a
					href={resolve('/admin/impersonate/{data.user.id}')}
					data-sveltekit-preload-data
					class="rounded-lg bg-[#1337ec] px-4 py-2 text-white transition-colors hover:bg-[#0f2ab3]"
				>
					Impersonate
				</a>
			</div>
		</div>

		<div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<p class="text-sm text-[#616889]">Email</p>
				<p class="text-sm font-medium text-[#111218]">{data.user.email}</p>
			</div>
			<div>
				<p class="text-sm text-[#616889]">Phone</p>
				<p class="text-sm font-medium text-[#111218]">{data.user.phone || 'Not provided'}</p>
			</div>
			<div>
				<p class="text-sm text-[#616889]">Email Notifications</p>
				<p class="text-sm font-medium text-[#111218]">
					{data.user.emailNotifications ? 'Enabled' : 'Disabled'}
				</p>
			</div>
			<div>
				<p class="text-sm text-[#616889]">SMS Notifications</p>
				<p class="text-sm font-medium text-[#111218]">
					{data.user.smsNotifications ? 'Enabled' : 'Disabled'}
				</p>
			</div>
			<div>
				<p class="text-sm text-[#616889]">Notification Frequency</p>
				<p class="text-sm font-medium text-[#111218]">{data.user.notificationFrequency}</p>
			</div>
			<div>
				<p class="text-sm text-[#616889]">Joined</p>
				<p class="text-sm font-medium text-[#111218]">{formatDate(data.user.createdAt)}</p>
			</div>
		</div>
	</div>

	<!-- Admin Actions -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<h2 class="mb-4 text-lg font-bold text-[#111218]">Admin Actions</h2>
		<div class="flex flex-wrap gap-4">
			<!-- Toggle Demo Data -->
			<form method="POST" action="?/toggleDemoMode" use:enhance>
				<input type="hidden" name="enabled" value={(!data.isDemoMode).toString()} />
				<button
					type="submit"
					class="rounded-lg border-2 border-[#1337ec] bg-white px-4 py-2 font-medium text-[#1337ec] transition-colors hover:bg-[#1337ec] hover:text-white"
				>
					{data.isDemoMode ? 'Disable Demo Data' : 'Enable Demo Data'}
				</button>
			</form>

			<!-- Change Tier -->
			<form method="POST" action="?/updateTier" use:enhance>
				<input type="hidden" name="tier" value={data.user.tier === 'free' ? 'pro' : 'free'} />
				<button
					type="submit"
					class="rounded-lg border-2 border-green-600 bg-white px-4 py-2 font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
				>
					{#if data.user.tier === 'free'}
						Upgrade to Pro Tier
					{:else}
						Downgrade to Free Tier
					{/if}
				</button>
			</form>

			<!-- Toggle Admin Status -->
			{#if !data.user.isAdmin}
				<form method="POST" action="?/toggleAdmin" use:enhance>
					<input type="hidden" name="isAdmin" value="true" />
					<button
						type="submit"
						class="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
					>
						Promote to Admin
					</button>
				</form>
			{:else}
				<form method="POST" action="?/toggleAdmin" use:enhance>
					<input type="hidden" name="isAdmin" value="false" />
					<button
						type="submit"
						class="rounded-lg border-2 border-purple-600 bg-white px-4 py-2 font-medium text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
					>
						Revoke Admin
					</button>
				</form>
			{/if}
		</div>
		<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
			<p class="text-xs text-blue-800">
				<strong>Tier Info:</strong> Free tier: 3 events max, email notifications only. Pro tier: Unlimited
				events, email + SMS notifications.
			</p>
		</div>
	</div>

	<!-- Tracked Events -->
	<div class="rounded-lg border border-[#dbdde6] bg-white">
		<div class="border-b border-[#dbdde6] p-6">
			<h2 class="text-xl font-bold text-[#111218]">
				Tracked Events ({data.trackedEvents.length})
			</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-[#f6f6f8]">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Event
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Venue
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Target Price
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Section
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Status
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#dbdde6]">
					{#if data.trackedEvents.length === 0}
						<tr>
							<td colspan="6" class="px-6 py-8 text-center text-[#616889]"> No tracked events </td>
						</tr>
					{:else}
						{#each data.trackedEvents as event (event.id)}
							<tr class="transition-colors hover:bg-[#f6f6f8]">
								<td class="px-6 py-4">
									<a
										href={resolve('/admin/events/{event.eventId}')}
										data-sveltekit-preload-data
										class="text-sm font-medium text-[#1337ec] hover:underline"
									>
										{event.eventName}
									</a>
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{event.eventVenue}</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{formatDate(event.eventDate)}</td>
								<td class="px-6 py-4 text-sm font-medium text-[#111218]">
									{formatCurrency(event.targetPrice)}
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{event.section || 'Any'}</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {event.isPaused
											? 'bg-yellow-100 text-yellow-800'
											: event.isActive
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'}"
									>
										{event.isPaused ? 'Paused' : event.isActive ? 'Active' : 'Inactive'}
									</span>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Notification History -->
	<div class="rounded-lg border border-[#dbdde6] bg-white">
		<div class="border-b border-[#dbdde6] p-6">
			<h2 class="text-xl font-bold text-[#111218]">
				Notification History ({data.notifications.length})
			</h2>
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
					{#if data.notifications.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-[#616889]">
								No notifications sent
							</td>
						</tr>
					{:else}
						{#each data.notifications as notification (notification.id)}
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
								<td class="px-6 py-4 text-sm text-[#111218]">{notification.recipient}</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{notification.eventName}</td>
								<td class="px-6 py-4 text-sm text-[#616889]">
									{formatDateTime(notification.sentAt)}
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {notification.wasSuccessful
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}"
										title={notification.errorMessage || ''}
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
</div>
