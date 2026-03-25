<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		House,
		Bookmark,
		Bell,
		User as UserIcon,
		Plus,
		ChevronLeft,
		ChevronRight,
		LogOut
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { userStore, type User} from '$lib/stores/user';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
    import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	let collapsed = false;

	onMount(() => {
		console.log("UserStore: ", $userStore)
	});

	const handleLogout = async () => {
		const miniapp = window.miniapp;
		if (!miniapp) return;

		try {
			await miniapp.logout();
			userStore.set(null);
			// localStorage.removeItem('user'); 
			goto('/', { replaceState: true });
		} catch (err) {
			console.error('Logout error', err);
		}
	};

	type Route = '/home' | '/saved' | '/notification' | '/profile' | '/addedit';

	interface NavItem {
		icon: ComponentType;
		label: string;
		route: Route;
	}

	const items: NavItem[] = [
		{ icon: House, label: 'Home', route: '/home' },
		{ icon: Bookmark, label: 'Saved', route: '/saved' },
		{ icon: Bell, label: 'Notifications', route: '/notification' },
		{ icon: UserIcon, label: 'Profile', route: '/profile' },
		{ icon: Plus, label: 'Add Recipe', route: '/addedit' }
	];
</script>

<aside class="sticky top-0 hidden max-h-screen flex-col border-r bg-white transition-all duration-300 md:flex {collapsed ? 'w-16' : 'w-56'}">
	<div class="flex cursor-pointer justify-end p-3">
		<div class="w-full transition-all duration-300 {collapsed ? 'opacity-0 ' : 'opacity-100'}">
			<h1 class="text-left text-lg font-semibold whitespace-nowrap text-gray-800">Recipe App</h1>
		</div>

		<button on:click={() => (collapsed = !collapsed)} class="z-100 cursor-pointer rounded-md p-2 hover:bg-gray-100">
			{#if collapsed}
				<ChevronRight size={22} />
			{:else}
				<ChevronLeft size={22} />
			{/if}
		</button>
	</div>

	<nav class="flex flex-col gap-3 px-2">
		{#each items as item}
			<button
				on:click={() => goto(item.route)}
				class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm
					{$page.url.pathname === item.route ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}"
			>
				<svelte:component this={item.icon} size={22} class="shrink-0"/>
				<span class="overflow-hidden whitespace-nowrap transition-all duration-300 {collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
					{item.label}
				</span>
			</button>
		{/each}
	</nav>

	<div class="mt-auto mb-3 flex flex-col gap-2 px-2">
		<button class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-green-100 hover:text-green-600"
				on:click={() => goto('/profile')}>
			<img src={get(userStore)?.photo_url} alt="pic" class="h-6 w-6 rounded-full shrink-0" />
			<div class="flex flex-col text-left overflow-hidden whitespace-nowrap transition-all duration-300 {collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}">
				<p class="text-xs font-medium">{get(userStore)?.display_name}</p>
				<p class="text-[10px]">{get(userStore)?.email}</p>
			</div>
		</button>

		<AlertDialog.Root>
			<AlertDialog.Trigger
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-300 hover:bg-green-100 hover:text-green-600"
			>
				<LogOut size={22} class="shrink-0" />
				<span class="overflow-hidden whitespace-nowrap transition-all duration-300 {collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
					Logout
				</span>
			</AlertDialog.Trigger>

			<AlertDialog.Content class="rounded-lg bg-white p-6 shadow-lg" portalProps={{}}>
				<AlertDialog.Header class="space-y-2">
					<AlertDialog.Title class="text-lg font-semibold">
						Are you absolutely sure you want to logout?
					</AlertDialog.Title>
				</AlertDialog.Header>

				<AlertDialog.Footer class="mt-4 flex justify-end gap-2">
					<AlertDialog.Cancel class="rounded-md border px-4 py-2">Cancel</AlertDialog.Cancel>

					<AlertDialog.Action asChild class="">
						<button class="rounded-md px-4 py-2 text-white" on:click={handleLogout}>
							Continue
						</button>
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</aside>