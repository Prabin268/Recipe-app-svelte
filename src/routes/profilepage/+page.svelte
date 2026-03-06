<script lang="ts">
	import { onMount } from 'svelte';
	import { Ellipsis, Bookmark, Play } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { getAllRecipes, deleteRecipe } from '$lib/db';

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
	let activeTab: 'Recipe' | 'Videos' | 'Tag' = 'Recipe';

	onMount(async () => {
		recipes = await getAllRecipes();
	});

	async function removeRecipe(id: number) {
		await deleteRecipe(id);
		recipes = await getAllRecipes();
	}
</script>

<div class="flex w-full flex-col space-y-4 p-4 md:p-10">
	
	<div class="flex items-center justify-between">
		<h1 class="flex-1 text-center text-2xl font-bold">Profile</h1>
		<Ellipsis size="24" />
	</div>

	<div class="flex w-full items-center gap-6 md:flex-row md:gap-10">
		<img
			src="/profile-pic.png"
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

	<div class="space-y-1 text-left md:text-left">
		<h1 class="text-lg font-bold">ALfuwape Abiodun</h1>
		<p class="text-sm text-gray-400">Chef</p>
		<p class="text-gray-500">Private Chef</p>
		<p class="text-gray-500">Passionate about food and life</p>
		<h3 class="cursor-pointer text-emerald-500">More...</h3>
	</div>

	<div class="flex gap-2">
		{#each ['Recipe', 'Videos', 'Tag'] as tab}
			<button
				type="button"
				class="flex-1 rounded-xl py-2 font-semibold transition
					{activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}"
				on:click={() => (activeTab = tab as 'Recipe' | 'Videos' | 'Tag')}
			>
				{tab}
			</button>
		{/each}
	</div>

	{#if activeTab === 'Recipe'}
		{#if recipes.length === 0}
			<p class="mt-4 text-center text-gray-500">No recipes yet.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each recipes as meal (meal.id)}
					<div
						role="button"
						tabindex="0"
						class="relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
						on:click={() => goto(`/localrecipe/${meal.id}`)}
						on:keydown={(e: KeyboardEvent) =>
							(e.key === 'Enter' || e.key === ' ') && goto(`/localrecipe/${meal.id}`)}
					>
						<img
							src={meal.imageUrl}
							alt={meal.name}
							class="h-48 w-full rounded-lg object-cover md:h-45"
						/>
						<img src="/Rating4.0.png" alt="Rating 4.0" class="absolute top-2 right-2 w-18 md:w-10 md:h-6" />
						<h2 class="absolute bottom-8 left-2 truncate text-lg font-bold text-white md:font-bold">
							{meal.name}
						</h2>
						<div class="absolute right-2 bottom-2 left-2 flex items-center justify-between">
							<p class="text-white md:text-sm">By Chef Jhon</p>
							<img src="/Time.png" alt="Time icon" class="relative left-14 md:left-5 h-8 w-16 md:h-8 md:w-15" />
							<button
								type="button"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-600 md:h-6 md:w-6"
								on:click|stopPropagation={() => removeRecipe(meal.id)}
							>
								<Bookmark size={18} fill="currentColor" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if activeTab === 'Videos'}
		{#if recipes.filter((r) => r.videoUrl).length === 0}
			<p class="mt-4 text-center text-gray-500">No videos available.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each recipes.filter((r) => r.videoUrl) as meal (meal.id)}
					<div
						role="button"
						tabindex="0"
						class="relative cursor-pointer"
						on:click={() => goto(`/localrecipe/${meal.id}`)}
						on:keydown={(e: KeyboardEvent) =>
							(e.key === 'Enter' || e.key === ' ') && goto(`/localrecipe/${meal.id}`)}
					>
						<video src={meal.videoUrl} class="h-48 w-full rounded-lg object-cover md:h-56" controls>
							<track kind="captions" src="/captions/en.vtt" srclang="en" label="English" default />
						</video>
						<button
							class="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-900"
						>
							<Play size="24" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if activeTab === 'Tag'}
		<p class="mt-4 text-center text-gray-500">No tags available.</p>
	{/if}
</div>
