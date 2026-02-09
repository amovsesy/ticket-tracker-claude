<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let notificationType = $state<'email' | 'sms'>('email');
</script>

<svelte:head>
	<title>Send Notification - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href={resolve('/admin/notifications')}
			data-sveltekit-preload-data
			class="inline-flex items-center text-[#616889] hover:text-[#111218]"
		>
			<span class="mr-2">←</span>
			Back to Notifications
		</a>
	</div>

	<div>
		<h1 class="text-3xl font-bold text-[#111218]">Send Notification</h1>
		<p class="mt-2 text-[#616889]">Send manual email or SMS notifications</p>
	</div>

	<!-- Success Message -->
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 p-4">
			<p class="text-sm text-green-800">✓ {form.message}</p>
		</div>
	{/if}

	<!-- Error Message -->
	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-800">{form.error}</p>
		</div>
	{/if}

	<!-- Send Custom Message Form -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<h2 class="mb-4 text-lg font-bold text-[#111218]">Custom Notification</h2>

		<form method="POST" action="?/sendCustom" use:enhance class="space-y-4">
			<!-- Type Selection -->
			<div>
				<label class="mb-2 block text-sm font-medium text-[#111218]"> Notification Type * </label>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input
							type="radio"
							name="type"
							value="email"
							bind:group={notificationType}
							class="h-4 w-4 text-[#1337ec] focus:ring-[#1337ec]"
						/>
						<span class="text-sm text-[#111218]">📧 Email</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="radio"
							name="type"
							value="sms"
							bind:group={notificationType}
							class="h-4 w-4 text-[#1337ec] focus:ring-[#1337ec]"
						/>
						<span class="text-sm text-[#111218]">📱 SMS</span>
					</label>
				</div>
			</div>

			<!-- Recipient -->
			<div>
				<label for="recipient" class="mb-1 block text-sm font-medium text-[#111218]">
					Recipient *
				</label>
				<input
					type={notificationType === 'email' ? 'email' : 'tel'}
					id="recipient"
					name="recipient"
					required
					placeholder={notificationType === 'email' ? 'user@example.com' : '+1 (555) 123-4567'}
					class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
				/>
				<p class="mt-1 text-xs text-[#616889]">
					{#if notificationType === 'email'}
						Enter the recipient's email address
					{:else}
						Enter the recipient's phone number (include country code)
					{/if}
				</p>
			</div>

			<!-- Subject (Email only) -->
			{#if notificationType === 'email'}
				<div>
					<label for="subject" class="mb-1 block text-sm font-medium text-[#111218]">
						Subject *
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						required
						placeholder="Price drop notification"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>
			{/if}

			<!-- Message -->
			<div>
				<label for="message" class="mb-1 block text-sm font-medium text-[#111218]">
					Message *
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows="6"
					placeholder={notificationType === 'email'
						? 'Enter your email message here...'
						: 'Enter your SMS message (keep it brief, ~160 characters)'}
					class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
				></textarea>
				<p class="mt-1 text-xs text-[#616889]">
					{#if notificationType === 'sms'}
						Keep SMS messages brief to avoid multiple message charges
					{:else}
						You can use HTML formatting in email messages
					{/if}
				</p>
			</div>

			<!-- Submit Button -->
			<div class="flex gap-4">
				<button
					type="submit"
					class="rounded-lg bg-[#1337ec] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0f2ab3]"
				>
					Send Notification
				</button>
				<a
					href={resolve('/admin/notifications')}
					data-sveltekit-preload-data
					class="rounded-lg border border-[#dbdde6] px-6 py-3 font-medium text-[#616889] transition-colors hover:bg-[#f6f6f8]"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>

	<!-- Info Box -->
	<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
		<h3 class="mb-2 text-sm font-bold text-blue-900">💡 Tips</h3>
		<ul class="space-y-1 text-sm text-blue-800">
			<li>• Email notifications use the Resend service</li>
			<li>• SMS notifications use the Plivo service</li>
			<li>• Both services must be configured with API keys in environment variables</li>
			<li>• Test with your own email/phone first before sending to users</li>
		</ul>
	</div>

	<!-- Available Users -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<h3 class="mb-4 text-lg font-bold text-[#111218]">Available Users</h3>
		<div class="max-h-64 overflow-y-auto">
			<table class="w-full text-sm">
				<thead class="sticky top-0 bg-[#f6f6f8]">
					<tr>
						<th class="px-4 py-2 text-left text-xs font-medium text-[#616889] uppercase">
							Email
						</th>
						<th class="px-4 py-2 text-left text-xs font-medium text-[#616889] uppercase">
							Phone
						</th>
						<th class="px-4 py-2 text-left text-xs font-medium text-[#616889] uppercase"> Tier </th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#dbdde6]">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-[#f6f6f8]">
							<td class="px-4 py-2 text-[#111218]">{user.email}</td>
							<td class="px-4 py-2 text-[#616889]">{user.phone || '-'}</td>
							<td class="px-4 py-2">
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {user.tier ===
									'pro'
										? 'bg-blue-100 text-blue-800'
										: 'bg-gray-100 text-gray-800'}"
								>
									{user.tier}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
