<script lang="ts">
	import clerkStore from './store';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { goto } from '$app/navigation';
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
			goto('/');
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
				<Avatar.Image src={user.imageUrl} alt={user.fullName || user.primaryEmailAddress?.emailAddress || 'User'} />
				<Avatar.Fallback class="bg-primary/10 text-primary">
					{(user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0] || 'U').toUpperCase()}
				</Avatar.Fallback>
			</Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Label class="font-normal">
				<div class="flex flex-col space-y-1">
					<p class="text-sm font-medium leading-none">{user.fullName || 'User'}</p>
					<p class="text-xs leading-none text-muted-foreground">
						{user.primaryEmailAddress?.emailAddress}
					</p>
				</div>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={openUserProfile}>
				<span class="material-symbols-outlined mr-2 size-4 text-base">account_circle</span>
				Manage Account
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => goto('/settings')}>
				<span class="material-symbols-outlined mr-2 size-4 text-base">settings</span>
				Settings
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => theme.toggle()}>
				<span class="material-symbols-outlined mr-2 size-4 text-base">
					{currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
				</span>
				{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleSignOut}>
				<span class="material-symbols-outlined mr-2 size-4 text-base">logout</span>
				Sign Out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
