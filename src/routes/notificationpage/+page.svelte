<script>
	let filter = 'All';
</script>

<div class="flex min-h-screen w-full flex-col md:p-5">

	<div class="flex min-h-16 items-center justify-center">
		<h1 class="text-2xl font-bold md:text-2xl">Notifications</h1>
	</div>

	<div class="flex h-12 w-full gap-3 p-2 justify-center md:p-2 md:justify-center md:gap-4">
		{#each ['All', 'Read', 'Unread'] as item}
			<label
				class="flex flex-1 cursor-pointer items-center justify-center rounded-lg text-base font-semibold transition
				md:h-10 md:w-58 md:flex-none md:text-lg
				{filter === item ? 'bg-[rgba(18,149,117,1)] text-white' : 'bg-white text-green-600'}"
			>
				<input type="radio" name="filter" value={item} bind:group={filter} class="hidden" />
				{item}
			</label>
		{/each}
	</div>

	<div class="flex-1 overflow-y-auto">
		<div class="mx-auto w-full max-w-3xl space-y-6 p-4">
			
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
