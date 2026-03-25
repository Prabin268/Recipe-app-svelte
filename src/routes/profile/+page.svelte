<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import {
		Ellipsis,
		Bookmark,
		Play,
		ArrowLeft,
		Timer,
		Star,
		LogOut
	} from 'lucide-svelte';
	import ProfileSkeleton from '$lib/components/ProfileSkeleton.svelte';
	import { userStore, type User } from '$lib/stores/user';
	import { getAllRecipes, deleteRecipe } from '$lib/db/db';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { get } from 'svelte/store';

	interface Ingredient {
		name: string;
		measure: string;
	}

	interface Recipe {
		id: number;
		name: string;
		category: string;
		area: string;
		mediaType: string;
		imageUrl: string;
		videoUrl: string;
		ingredients: Ingredient[];
		procedure: string;
	}

	let recipes: Recipe[] = [];
	let isLoading = true;
	let activeTab: 'Recipe' | 'Videos' | 'Tag' = 'Recipe';
	let showPopup = false;

	async function loadRecipes() {
		isLoading = true;
		await new Promise((r) => setTimeout(r, 300)); 
		recipes = await getAllRecipes();
		isLoading = false;
	}

	onMount(() => {
		console.log("UserStore: ", $userStore)
		loadRecipes();
	});

	afterNavigate((nav) => {
		if (nav.to?.url.pathname === '/profile') loadRecipes();
	});

	async function removeRecipe(id: number) {
		await deleteRecipe(id);
		recipes = await getAllRecipes();
	}

	function goBack() {
		goto('/home');
	}

	function openPopup() {
		showPopup = true;
	}
	function closePopup() {
		showPopup = false;
	}

	const handleLogout = async () => {
		const miniapp = window.miniapp;
		if (miniapp) {
			try {
				await miniapp.logout();
			} catch (err) {
				console.error('MiniApp logout error', err);
			}
		}
		userStore.set(null);
		localStorage.removeItem('user');
		showPopup = false;
		goto('/', { replaceState: true });
	};
</script>

<div class="flex min-h-screen w-full flex-col space-y-4 p-4 md:p-10">
	
	<div class="flex items-center justify-between">
		<button class="md:hidden" on:click={goBack}>
			<ArrowLeft />
		</button>
		<h1 class="flex-1 text-center text-2xl font-bold">Profile</h1>
		<button on:click={openPopup} class="md:hidden">
			<Ellipsis size="24" />
		</button>
	</div>

	<div class="flex w-full items-center gap-6 md:flex-row md:gap-10">
		<img
			src={get(userStore)?.photo_url}
			alt="Profile"
			class="h-20 w-20 rounded-full object-cover md:h-40 md:w-40"
		/>

		<div class="flex gap-6 md:gap-10">
			<div class="flex flex-col items-center">
				<p class="text-gray-400">Recipes</p>
				<h1 class="text-2xl md:text-3xl">{recipes.length}</h1>
			</div>
			<div class="flex flex-col items-center">
				<p class="text-gray-400">Followers</p>
				<h1 class="text-2xl md:text-3xl">2.5M</h1>
			</div>
			<div class="flex flex-col items-center">
				<p class="text-gray-400">Following</p>
				<h1 class="text-2xl md:text-3xl">259</h1>
			</div>
		</div>
	</div>

	<div class="space-y-1 text-left">
		<h1 class="text-lg font-bold">{get(userStore)?.display_name}</h1>
		<p class="text-sm text-gray-400">Chef</p>
		<p class="text-gray-500">Private Chef</p>
		<p class="text-gray-500">Passionate about food and life</p>
		<h3 class="cursor-pointer text-emerald-500">More...</h3>
	</div>

	<div class="flex gap-2">
		{#each ['Recipe', 'Videos', 'Tag'] as tab}
			<button
				type="button"
				class="flex-1 cursor-pointer rounded-xl py-2 font-semibold transition
					{activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}"
				on:click={() => (activeTab = tab as 'Recipe' | 'Videos' | 'Tag')}
			>
				{tab}
			</button>
		{/each}
	</div>

	{#if activeTab === 'Recipe'}
		{#if isLoading}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each Array(3) as _}
					<ProfileSkeleton />
				{/each}
			</div>
		{:else if recipes.length === 0}
			<p class="mt-4 text-center text-gray-500">No recipes yet.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each recipes as meal (meal.id)}
					<div
						role="button"
						tabindex="0"
						class="relative h-40 w-full cursor-pointer overflow-hidden rounded-lg shadow-lg md:h-48"
						on:click={() => goto(`/localrecipe/${meal.id}`)}
						on:keydown={(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && goto(`/localrecipe/${meal.id}`)}
					>
						<div
							class="absolute inset-0 bg-cover bg-center"
							style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1)),url({meal.imageUrl})"
						></div>
						<div class="absolute top-2 right-2 flex items-center gap-1 rounded-xl bg-orange-200 px-2">
							<Star fill="orange" color="orange" size="15" />
							<h1>4.0</h1>
						</div>
						<div class="absolute right-3 bottom-10 left-3 z-10 text-white">
							<h2 class="truncate text-lg font-bold">{meal.name}</h2>
						</div>
						<div class="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between">
							<p class="text-white font-semibold text-sm">By Chef Jhon</p>
							<div class="flex items-center gap-2">
								<div class="flex h-10 w-22 items-center justify-center gap-1 text-white md:w-25 md:gap-1">
									<Timer />
									<h1>20 mins</h1>
								</div>
								<button
									type="button"
									class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-600 md:h-6 md:w-6"
									on:click|stopPropagation={() => removeRecipe(meal.id)}
								>
									<Bookmark size={18} />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if activeTab === 'Videos'}
		{#if recipes.filter(r => r.videoUrl).length === 0}
			<p class="mt-4 text-center text-gray-500">No videos available.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each recipes.filter(r => r.videoUrl) as meal (meal.id)}
					<div
						role="button"
						tabindex="0"
						class="relative cursor-pointer"
						on:click={() => goto(`/localrecipe/${meal.id}`)}
						on:keydown={(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && goto(`/localrecipe/${meal.id}`)}
					>
						<video src={meal.videoUrl} class="h-48 w-full rounded-lg object-cover md:h-56">
							<track
								kind="captions"
								src="/captions/empty.vtt"
								srclang="en"
								label="English"
								default
							/>
						</video>
						<h2 class="absolute bottom-10 left-5 truncate text-lg font-bold text-black">{meal.name}</h2>
						<p class="absolute bottom-6 left-5 font-semibold text-black text-sm">By Chef Jhon</p>
						<div class="absolute inset-0 flex items-center justify-center">
							<button class="flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-900 bg-white/30">
								<Play size="24" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if activeTab === 'Tag'}
		<p class="mt-4 text-center text-gray-500">No tags available.</p>
	{/if}

	{#if showPopup}
		<button
			type="button"
			class="absolute inset-0 z-10 bg-black/40"
			aria-label="Close popup"
			on:click={closePopup}
		>
		</button>
		<div class="absolute top-12 right-4 z-50 w-64 rounded-lg bg-white p-2 shadow-lg">
			<div class="flex w-full items-center gap-2 p-2 text-left hover:bg-gray-100">
				<img src={get(userStore)?.photo_url ?? '/default-avatar.png'} alt="pic" class="h-10 w-10 rounded-full" />
				<div class="flex flex-col justify-center text-[10px]">
					<p>{get(userStore)?.display_name}</p>
					<p>{get(userStore)?.email}</p>
				</div>
			</div>

			<AlertDialog.Root>
				<AlertDialog.Trigger class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-100">
					<LogOut />
					Logout
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
								Logout
							</button>
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	{/if}
</div>