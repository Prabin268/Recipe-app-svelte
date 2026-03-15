<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { savedMeals } from '$lib/stores/savedMeals';
	import { onMount } from 'svelte';

	let inputValue: string = '';

	interface CommentItem {
		text: string;
		date: string;
	}

	let savedItems: CommentItem[] = [];

	let countLike: number = 0;
	let countDislike: number = 0;

	let isClient: boolean = false;

	onMount(() => {
		isClient = true;
	});

	function increment(): void {
		countLike += 1;
	}

	function decrement(): void {
		countDislike += 1;
	}

	function saveInput(): void {
		if (inputValue.trim() !== '') {
			savedItems = [
				...savedItems,
				{
					text: inputValue,
					date: new Date().toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					}) +
						' - ' +
						new Date().toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit'
						})
				}
			];
			inputValue = '';
		}
	}
</script>

<div class="min-h-screen w-full">

	<div class="flex h-20 items-center gap-4 px-4">
		<button on:click={() => history.back()}>
			<ArrowLeft size="30" />
		</button>

		<h1 class="text-2xl font-bold">Reviews</h1>
	</div>

	<div class="flex justify-between px-4 py-2">
         <p class="text-gray-400">
	{savedItems.length} comments
</p>

		{#if isClient}
			<p class="text-gray-400">{$savedMeals.length} saved</p>
		{/if}
	</div>

	<div class="px-4">
		<h1 class="text-lg font-semibold">Leave a comment</h1>

		<div class="mt-4 flex gap-2">
			<input
				type="text"
				bind:value={inputValue}
				placeholder="Say something..."
				class="w-full rounded-lg border-2 border-gray-300 p-3"
			/>

			<button
				on:click={saveInput}
				class="rounded-lg bg-emerald-600 px-4 font-bold text-white"
			>
				Send
			</button>
		</div>
	</div>

	<div class="mt-6 space-y-4 px-4">
		{#each savedItems as item}
			<div class="rounded-lg bg-gray-100 p-4">
				<div class="flex items-center gap-3">
					<img
						src="/review-pic.jpg"
						alt="profile"
						class="h-10 w-10 rounded-full"
					/>

					<div>
						<h1 class="text-sm text-gray-500">
							Cristopher Oshana
						</h1>
						<p class="text-xs text-gray-400">{item.date}</p>
					</div>
				</div>

				<p class="mt-3 text-lg">{item.text}</p>

				<div class="mt-3 flex gap-3">
					<button
						on:click={increment}
						class="rounded-lg bg-gray-300 px-3 py-1"
					>
						👍 {countLike}
					</button>

					<button
						on:click={decrement}
						class="rounded-lg bg-gray-300 px-3 py-1"
					>
						👎 {countDislike}
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>