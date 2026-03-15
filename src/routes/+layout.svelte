<script lang="ts">
  import './layout.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { miniAppInit } from '../miniapp';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/user';

  const publicRoutes: string[] = ['/'];

  $: {
	const path = $page.url.pathname;
	const user = $userStore;

	if (!user && !publicRoutes.includes(path)) {
		goto('/', { replaceState: true });
	}

	if (user && path === '/') {
		goto('/homepage', { replaceState: true });
	}
}

  const noLayoutRoutes: string[] = ['/'];

  let hideLayout: boolean;

  $: hideLayout = noLayoutRoutes.includes($page.url.pathname);

  onMount(() => {
    miniAppInit();

    const onPopState = () => {
      if (!$userStore) {
        goto('/', { replaceState: true });
      }
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  })

</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

{#if !hideLayout}
  <Navbar />

  <div class="flex max-h-screen overflow-hidden">
    <Sidebar />
    
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
    {:else}
  <slot />
{/if}