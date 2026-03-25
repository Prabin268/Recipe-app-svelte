<!-- <script lang="ts">
	import { page } from "$app/state";
  
    const displayStatus = page.status
    
    $:console.log("error status: ", displayStatus);
</script>

<svelte:head>
  <title>{displayStatus} - Error</title>
</svelte:head>

<div class="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  <div class="text-center space-y-4">
    <h1 class="text-6xl font-bold text-gray-800 dark:text-white">{displayStatus}</h1>
    <p class="text-lg text-gray-600 dark:text-gray-300">Not found</p>
    <a 
      href="/" 
      class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
    >
      Home
    </a>
  </div>
</div> -->

<script lang="ts">
	import { page } from "$app/stores";

	$: displayStatus = $page.status;
	$: console.log("error status:", displayStatus);
</script>

<svelte:head>
	<title>{displayStatus} - Error</title>
</svelte:head>

<div class="h-screen flex items-center justify-center bg-gray-100">
	<div class="text-center space-y-4">
		<h1 class="text-6xl font-bold text-gray-800">
			{displayStatus}
		</h1>

		<p class="text-lg text-gray-600 dark:text-gray-300">
			{$page.error?.message || "Not found"}
		</p>

		<a 
			href="/home" 
			class="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-600 transition"
		>
			Home
		</a>
	</div>
</div>