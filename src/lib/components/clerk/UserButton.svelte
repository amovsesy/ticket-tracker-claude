<script lang="ts">
	import clerkStore from './store';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { theme } from '$lib/stores/theme';

	let clerk = $state($clerkStore);
	let user = $derived(clerk?.user);
	let currentTheme = $state($theme);

	clerkStore.subscribe((value) => {
		clerk = value;
	});

	theme.subscribe((value) => {
		currentTheme = value;
	});

	async function handleSignOut() {
		if (clerk) {
			await clerk.signOut();
			goto(resolve('/'));
		}
	}

	function openUserProfile() {
		if (clerk) {
			clerk.openUserProfile();
		}
	}
</script>

{#if user}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="focus:outline-none">
			<Avatar.Root class="size-10 cursor-pointer border border-[#dbdde6]">
				<Avatar.Image
					src={user.imageUrl}
					alt={user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
				/>
				<Avatar.Fallback class="bg-primary/10 text-primary">
					{(
						user.firstName?.[0] ||
						user.primaryEmailAddress?.emailAddress?.[0] ||
						'U'
					).toUpperCase()}
				</Avatar.Fallback>
			</Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56 bg-white dark:bg-slate-900">
			<DropdownMenu.Label class="font-normal">
				<div class="flex flex-col space-y-1">
					<p class="text-sm leading-none font-medium text-slate-900 dark:text-slate-100">
						{user.fullName || 'User'}
					</p>
					<p class="text-xs leading-none text-slate-600 dark:text-slate-400">
						{user.primaryEmailAddress?.emailAddress}
					</p>
				</div>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={openUserProfile} class="text-slate-900 dark:text-slate-100">
				<span class="material-symbols-outlined mr-2 size-4 text-base">account_circle</span>
				Manage Account
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => goto(resolve('/settings'))}
				class="text-slate-900 dark:text-slate-100"
			>
				<span class="material-symbols-outlined mr-2 size-4 text-base">settings</span>
				Settings
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => theme.toggle()} class="text-slate-900 dark:text-slate-100">
				<span class="material-symbols-outlined mr-2 size-4 text-base">
					{currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
				</span>
				{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleSignOut} class="text-slate-900 dark:text-slate-100">
				<span class="material-symbols-outlined mr-2 size-4 text-base">logout</span>
				Sign Out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
