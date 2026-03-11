<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let activeItem: 'All' | 'Read' | 'Unread' = 'All';

	const filterItems: Array<'All' | 'Read' | 'Unread'> = ['All', 'Read', 'Unread'];

	function goBack(): void {
		goto('/homepage');
	}
</script>

<div class="flex h-full w-full flex-col md:p-5">
	<div
		class="mt-5 mb-2 flex items-center justify-between p-2 md:mb-5 md:items-center md:justify-center"
	>
		<button class="flex text-left md:hidden" on:click={goBack}>
			<ArrowLeft />
		</button>

		<h1 class="flex-1 text-center text-2xl font-semibold">Notifications</h1>
	</div>

	<div
		class="flex h-12 w-full justify-between gap-3 px-4 py-1 md:justify-between md:gap-3 md:px-4 md:py-1"
	>
		{#each filterItems as item}
			<button
				type="button"
				class="flex w-full cursor-pointer items-center justify-center rounded-lg text-base font-semibold transition
			    md:flex-1 md:text-lg
				{activeItem === item ? 'bg-[rgba(18,149,117,1)] text-white' : 'bg-white text-green-600'}"
				on:click={() => (activeItem = item)}
			>
				{item}
			</button>
		{/each}
	</div>

	<div class="flex-1 overflow-y-auto">
		<div class="mx-auto w-full max-w-full space-y-6 p-4">
			<div class="space-y-3">
				<h1 class="text-center text-lg font-bold">Today</h1>

				<div class="relative rounded-2xl bg-gray-100 p-3">
					<h1 class="text-md font-bold md:text-base">New Recipe Alert!</h1>
					<p class="mb-2 text-sm text-gray-400">
						Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum
					</p>
					<p class="text-xs text-gray-400">10 mins ago</p>
					<img src="/Docs.png" alt="notification icon" class="absolute top-3 right-3 h-5" />
				</div>

				<div class="relative rounded-2xl bg-gray-100 p-3">
					<h1 class="text-md font-bold md:text-base">New Recipe Alert!</h1>
					<p class="mb-2 text-sm text-gray-400">
						Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum
					</p>
					<p class="text-xs text-gray-400">30 mins ago</p>
					<img src="/Docs.png" alt="notification icon" class="absolute top-3 right-3 h-5" />
				</div>
			</div>

			<div class="space-y-3">
				<h1 class="text-center text-lg font-bold">Yesterday</h1>

				<div class="relative rounded-2xl bg-gray-100 p-3">
					<h1 class="text-md font-bold md:text-base">Save Recipe Alert!</h1>
					<p class="mb-2 text-sm text-gray-400">
						Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum
					</p>
					<p class="text-xs text-gray-400">30 mins ago</p>
					<img src="/Docs.png" alt="notification icon" class="absolute top-3 right-3 h-5" />
				</div>

				<div class="relative rounded-2xl bg-gray-100 p-3">
					<h1 class="text-md font-bold md:text-base">Save Recipe Alert!</h1>
					<p class="mb-2 text-sm text-gray-400">
						Lorem Ipsum tempor incididunt ut labore et dolore,in voluptate velit esse cillum
					</p>
					<p class="text-xs text-gray-400">30 mins ago</p>
					<img src="/Docs.png" alt="notification icon" class="absolute top-3 right-3 h-5" />
				</div>
			</div>
		</div>
	</div>
</div>
