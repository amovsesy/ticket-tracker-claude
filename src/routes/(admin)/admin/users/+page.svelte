<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		PageHeader,
		StatCard,
		FilterBar,
		SearchInput,
		DataTable,
		EmptyState
	} from '$lib/components/admin';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let tierFilter = $state<'all' | 'free' | 'pro'>('all');

	let filteredUsers = $derived(
		data.users.filter((user) => {
			const matchesSearch =
				user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTier = tierFilter === 'all' || user.tier === tierFilter;
			return matchesSearch && matchesTier;
		})
	);

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Users - Admin Panel</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
	<style>
		.material-symbols-outlined {
			font-variation-settings:
				'FILL' 0,
				'wght' 400,
				'GRAD' 0,
				'opsz' 24;
		}
	</style>
</svelte:head>

<div class="space-y-6">
	<PageHeader title="Users" description="Manage all users and their activity" />

	<FilterBar>
		<SearchInput bind:value={searchQuery} placeholder="Search by email or phone..." />
		<select
			bind:value={tierFilter}
			class="h-11 rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm font-medium text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
		>
			<option value="all">All Tiers</option>
			<option value="free">Free</option>
			<option value="pro">Pro</option>
		</select>
	</FilterBar>

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<StatCard label="Total Users" value={filteredUsers.length} icon="group" />
		<StatCard
			label="Free Tier"
			value={filteredUsers.filter((u) => u.tier === 'free').length}
			icon="person"
		/>
		<StatCard
			label="Pro Tier"
			value={filteredUsers.filter((u) => u.tier === 'pro').length}
			icon="star"
		/>
	</div>

	<!-- Users Table -->
	<DataTable
		headers={['Email', 'Phone', 'Tier', 'Tracked Events', 'Notifications', 'Joined', 'Actions']}
	>
		{#if filteredUsers.length === 0}
			<EmptyState message="No users found" colspan={7} />
		{:else}
			{#each filteredUsers as user (user.id)}
				<tr class="transition-colors hover:bg-[#f6f6f8]">
					<td class="px-6 py-4 whitespace-nowrap">
						<div class="flex items-center gap-2">
							<a
								href={resolve(`/admin/users/${user.id}`)}
								data-sveltekit-preload-data
								class="text-sm font-medium text-[#1337ec] hover:underline"
							>
								{user.email}
							</a>
							{#if user.isAdmin}
								<span
									class="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
								>
									Admin
								</span>
							{/if}
						</div>
					</td>
					<td class="px-6 py-4 text-sm whitespace-nowrap">
						{#if user.phone}
							<a
								href={resolve(`/admin/users/${user.id}`)}
								class="text-[#1337ec] hover:underline"
								data-sveltekit-preload-data
							>
								{user.phone}
							</a>
						{:else}
							<span class="text-[#616889]">-</span>
						{/if}
					</td>
					<td class="px-6 py-4 whitespace-nowrap">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {user.tier ===
							'pro'
								? 'bg-blue-100 text-blue-800'
								: 'bg-gray-100 text-gray-800'}"
						>
							{user.tier === 'pro' ? '⭐ Pro' : 'Free'}
						</span>
					</td>
					<td class="px-6 py-4 text-sm whitespace-nowrap text-[#111218]">
						{user.trackedEventsCount}
					</td>
					<td class="px-6 py-4 text-sm whitespace-nowrap text-[#111218]">
						{user.notificationsSent}
					</td>
					<td class="px-6 py-4 text-sm whitespace-nowrap text-[#616889]">
						{formatDate(user.createdAt)}
					</td>
					<td class="px-6 py-4 text-sm whitespace-nowrap">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="focus:ring-primary/20 inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm font-medium text-[#111218] shadow-sm transition-all hover:shadow-md focus:ring-2 focus:outline-none"
							>
								Actions
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56">
								<DropdownMenu.Item href={resolve(`/admin/users/${user.id}`)}>
									<span class="flex items-center gap-2 text-[#111218]">
										<span>👁️</span>
										<span>View Details</span>
									</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item href={resolve('/admin/impersonate/{user.id}')}>
									<span class="flex items-center gap-2 text-[#111218]">
										<span>👤</span>
										<span>Impersonate User</span>
									</span>
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item
									onclick={() => {
										window.location.href = `/admin/users/${user.id}#demo-data`;
									}}
								>
									<span class="flex items-center gap-2 text-[#111218]">
										<span>🎭</span>
										<span>Toggle Demo Data</span>
									</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item
									onclick={() => {
										window.location.href = `/admin/users/${user.id}#tier`;
									}}
								>
									<span class="flex items-center gap-2 text-[#111218]">
										<span>{user.tier === 'free' ? '⭐' : '📦'}</span>
										<span>{user.tier === 'free' ? 'Upgrade to Pro' : 'Downgrade to Free'}</span>
									</span>
								</DropdownMenu.Item>
								{#if !user.isAdmin}
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											window.location.href = `/admin/users/${user.id}#admin`;
										}}
									>
										<span class="flex items-center gap-2 text-[#111218]">
											<span>🔑</span>
											<span>Promote to Admin</span>
										</span>
									</DropdownMenu.Item>
								{:else}
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											window.location.href = `/admin/users/${user.id}#admin`;
										}}
									>
										<span class="flex items-center gap-2 text-red-600">
											<span>❌</span>
											<span>Revoke Admin</span>
										</span>
									</DropdownMenu.Item>
								{/if}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</td>
				</tr>
			{/each}
		{/if}
	</DataTable>
</div>
