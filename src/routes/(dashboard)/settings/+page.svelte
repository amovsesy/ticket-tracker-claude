<script lang="ts">
	import { goto } from '$app/navigation';
	import clerkStore from '$lib/components/clerk/store';

	let clerk = $state($clerkStore);
	let user = $derived(clerk?.user);

	clerkStore.subscribe((value) => {
		clerk = value;
	});

	let emailAlerts = $state(true);
	let smsAlerts = $state(false);
	let frequency = $state('realtime');
</script>

<svelte:head>
	<title>Notification Settings - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4 pb-24">
	<div class="flex flex-col gap-1">
		<!-- CHANNELS SECTION -->
		<h3
			class="px-0 pb-2 pt-6 text-sm font-semibold uppercase leading-tight tracking-wider text-[#616889]"
		>
			Channels
		</h3>
		<div class="overflow-hidden rounded-xl bg-white shadow-sm">
			<!-- Email Alerts -->
			<div
				class="flex min-h-[72px] items-center justify-between gap-4 border-b border-gray-50 px-4 py-2"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f4]"
					>
						<span class="material-symbols-outlined text-[#111218]">mail</span>
					</div>
					<div class="flex flex-col justify-center">
						<p class="line-clamp-1 text-base font-medium leading-normal text-[#111218]">
							Email Alerts
						</p>
						<p class="line-clamp-2 text-sm font-normal leading-normal text-[#616889]">
							Get price drops in your inbox
						</p>
					</div>
				</div>
				<div class="shrink-0">
					<label
						class="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#f0f1f4] p-0.5 transition-all duration-200 has-[:checked]:justify-end has-[:checked]:bg-primary"
					>
						<div class="h-full w-[27px] rounded-full bg-white shadow-md"></div>
						<input bind:checked={emailAlerts} class="invisible absolute" type="checkbox" />
					</label>
				</div>
			</div>
			<!-- SMS Alerts -->
			<div class="flex min-h-[72px] items-center justify-between gap-4 px-4 py-2">
				<div class="flex items-center gap-4">
					<div
						class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f1f4]"
					>
						<span class="material-symbols-outlined text-[#111218]">chat_bubble</span>
					</div>
					<div class="flex flex-col justify-center">
						<div class="flex items-center gap-2">
							<p class="line-clamp-1 text-base font-medium leading-normal text-[#111218]">
								SMS Alerts
							</p>
							<span
								class="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700"
							>
								Premium
							</span>
						</div>
						<p class="line-clamp-2 text-sm font-medium leading-normal text-primary">
							Free during Launch
						</p>
					</div>
				</div>
				<div class="shrink-0">
					<label
						class="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#f0f1f4] p-0.5 transition-all duration-200 has-[:checked]:justify-end has-[:checked]:bg-primary"
					>
						<div class="h-full w-[27px] rounded-full bg-white shadow-md"></div>
						<input bind:checked={smsAlerts} class="invisible absolute" type="checkbox" />
					</label>
				</div>
			</div>
		</div>

		<!-- FREQUENCY SECTION -->
		<h3
			class="px-0 pb-2 pt-6 text-sm font-semibold uppercase leading-tight tracking-wider text-[#616889]"
		>
			Frequency
		</h3>
		<div class="overflow-hidden rounded-xl bg-white shadow-sm">
			<!-- Real-time -->
			<div
				class="flex min-h-[64px] items-center justify-between gap-4 border-b border-gray-50 px-4 py-2"
			>
				<div class="flex flex-col justify-center">
					<p class="text-base font-medium leading-normal text-[#111218]">Real-time</p>
					<p class="text-sm font-normal leading-normal text-[#616889]">
						Instantly when prices drop
					</p>
				</div>
				<div class="shrink-0">
					<input
						bind:group={frequency}
						value="realtime"
						class="size-5 border-gray-300 text-primary focus:ring-primary"
						name="frequency"
						type="radio"
					/>
				</div>
			</div>
			<!-- Daily Digest -->
			<div class="flex min-h-[64px] items-center justify-between gap-4 px-4 py-2">
				<div class="flex flex-col justify-center">
					<p class="text-base font-medium leading-normal text-[#111218]">Daily Digest</p>
					<p class="text-sm font-normal leading-normal text-[#616889]">
						Summary of changes once a day
					</p>
				</div>
				<div class="shrink-0">
					<input
						bind:group={frequency}
						value="daily"
						class="size-5 border-gray-300 text-primary focus:ring-primary"
						name="frequency"
						type="radio"
					/>
				</div>
			</div>
		</div>

		<!-- CONTACT INFO SECTION -->
		<h3
			class="px-0 pb-2 pt-6 text-sm font-semibold uppercase leading-tight tracking-wider text-[#616889]"
		>
			Contact Information
		</h3>
		<div class="overflow-hidden rounded-xl bg-white shadow-sm">
			<!-- Email Address -->
			<div
				class="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 border-b border-gray-50 px-4 py-2"
			>
				<div class="flex flex-col justify-center">
					<p class="text-xs font-semibold uppercase text-[#616889]">Email Address</p>
					<p class="text-base font-medium text-[#111218]">
						{user?.primaryEmailAddress?.emailAddress || 'Not set'}
					</p>
				</div>
				<span class="material-symbols-outlined text-gray-400">chevron_right</span>
			</div>
			<!-- Phone Number -->
			<div class="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 px-4 py-2">
				<div class="flex flex-col justify-center">
					<div class="flex items-center gap-2">
						<p class="text-xs font-semibold uppercase text-[#616889]">Phone Number</p>
						<span
							class="rounded bg-red-50 px-1 text-[9px] font-bold uppercase text-red-600"
						>
							Unverified
						</span>
					</div>
					<p class="text-base font-medium text-[#111218]">
						{user?.primaryPhoneNumber?.phoneNumber || 'Not set'}
					</p>
				</div>
				<span class="material-symbols-outlined text-gray-400">chevron_right</span>
			</div>
		</div>

		<div class="px-0 pb-12 pt-4">
			<p class="text-center text-xs leading-relaxed text-[#616889]">
				Message and data rates may apply. SMS alerts are currently available for US and Canada
				phone numbers only.
			</p>
		</div>
	</div>

	<!-- Sticky Save Button -->
	<div
		class="fixed bottom-0 left-1/2 w-full max-w-7xl -translate-x-1/2 border-t border-gray-100 bg-white/80 p-4 backdrop-blur-md md:left-auto md:right-0 md:max-w-[calc(100%-16rem)] md:translate-x-0"
	>
		<button
			type="button"
			onclick={() => alert('Settings saved!')}
			class="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98]"
		>
			Save Changes
		</button>
	</div>
</div>
