<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Create Event - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href={resolve('/admin/events')}
			class="inline-flex items-center text-[#616889] hover:text-[#111218]"
			data-sveltekit-preload-data
		>
			<span class="mr-2">←</span>
			Back to Events
		</a>
	</div>

	<div>
		<h1 class="text-3xl font-bold text-[#111218]">Create New Event</h1>
		<p class="mt-2 text-[#616889]">Manually add an event and pricing data</p>
	</div>

	<!-- Error Message -->
	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-sm text-red-800">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form method="POST" use:enhance class="space-y-6">
		<!-- Basic Information -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<h2 class="mb-4 text-lg font-bold text-[#111218]">Basic Information</h2>

			<div class="space-y-4">
				<!-- Event Name -->
				<div>
					<label for="name" class="mb-1 block text-sm font-medium text-[#111218]">
						Event Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder="Taylor Swift | The Eras Tour"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<!-- Venue -->
				<div>
					<label for="venue" class="mb-1 block text-sm font-medium text-[#111218]"> Venue * </label>
					<input
						type="text"
						id="venue"
						name="venue"
						required
						placeholder="SoFi Stadium"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<!-- Location -->
				<div>
					<label for="location" class="mb-1 block text-sm font-medium text-[#111218]">
						Location *
					</label>
					<input
						type="text"
						id="location"
						name="location"
						required
						placeholder="Los Angeles, CA"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- Date -->
					<div>
						<label for="date" class="mb-1 block text-sm font-medium text-[#111218]">
							Event Date *
						</label>
						<input
							type="datetime-local"
							id="date"
							name="date"
							required
							class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
						/>
					</div>

					<!-- Category -->
					<div>
						<label for="category" class="mb-1 block text-sm font-medium text-[#111218]">
							Category *
						</label>
						<select
							id="category"
							name="category"
							required
							class="w-full rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
						>
							<option value="concerts">Concerts</option>
							<option value="sports">Sports</option>
							<option value="theater">Theater</option>
							<option value="other">Other</option>
						</select>
					</div>
				</div>

				<!-- Image URL -->
				<div>
					<label for="imageUrl" class="mb-1 block text-sm font-medium text-[#111218]">
						Image URL
					</label>
					<input
						type="url"
						id="imageUrl"
						name="imageUrl"
						placeholder="https://images.unsplash.com/photo-..."
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
					<p class="mt-1 text-xs text-[#616889]">Optional: Direct link to event image</p>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="mb-1 block text-sm font-medium text-[#111218]">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						placeholder="Additional details about the event..."
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Platform URLs -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<h2 class="mb-4 text-lg font-bold text-[#111218]">Platform URLs</h2>
			<p class="mb-4 text-sm text-[#616889]">
				Add event URLs from ticketing platforms. These will be used for price scraping.
			</p>

			<div class="space-y-4">
				<!-- StubHub URL -->
				<div>
					<label for="stubhub_url" class="mb-1 block text-sm font-medium text-[#111218]">
						StubHub URL
					</label>
					<input
						type="url"
						id="stubhub_url"
						name="stubhub_url"
						placeholder="https://www.stubhub.com/..."
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<!-- Ticketmaster URL -->
				<div>
					<label for="ticketmaster_url" class="mb-1 block text-sm font-medium text-[#111218]">
						Ticketmaster URL
					</label>
					<input
						type="url"
						id="ticketmaster_url"
						name="ticketmaster_url"
						placeholder="https://www.ticketmaster.com/..."
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<!-- SeatGeek URL -->
				<div>
					<label for="seatgeek_url" class="mb-1 block text-sm font-medium text-[#111218]">
						SeatGeek URL
					</label>
					<input
						type="url"
						id="seatgeek_url"
						name="seatgeek_url"
						placeholder="https://seatgeek.com/..."
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>
			</div>
		</div>

		<!-- Initial Price (Optional) -->
		<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
			<h2 class="mb-4 text-lg font-bold text-[#111218]">Initial Price (Optional)</h2>
			<p class="mb-4 text-sm text-[#616889]">
				Add an initial price point to seed the price history.
			</p>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Price -->
				<div>
					<label for="initial_price" class="mb-1 block text-sm font-medium text-[#111218]">
						Price ($)
					</label>
					<input
						type="number"
						id="initial_price"
						name="initial_price"
						step="0.01"
						min="0"
						placeholder="450.00"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<!-- Section -->
				<div>
					<label for="section" class="mb-1 block text-sm font-medium text-[#111218]">
						Section
					</label>
					<input
						type="text"
						id="section"
						name="section"
						placeholder="Floor Section A"
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex gap-4">
			<button
				type="submit"
				class="rounded-lg bg-[#1337ec] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0f2ab3]"
			>
				Create Event
			</button>
			<a
				href={resolve('/admin/events')}
				data-sveltekit-preload-data
				class="rounded-lg border border-[#dbdde6] px-6 py-3 font-medium text-[#616889] transition-colors hover:bg-[#f6f6f8]"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
