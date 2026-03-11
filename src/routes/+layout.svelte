<script lang="ts">
  import './layout.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { miniAppInit } from '../miniapp';
   import { goto } from '$app/navigation';
	import LandingPage from '$lib/components/LandingPage.svelte';

    const publicRoutes = ['/', '/login', '/signup'];

  const noLayoutRoutes: string[] = ['/', '/login', '/signup'];

  let hideLayout: boolean;
  // let loggedIn = false;

  $: hideLayout = noLayoutRoutes.includes($page.url.pathname);

  onMount(() => {
    miniAppInit();
    
    const token = document.cookie.includes('foodapp_access-token');
    // loggedIn = token;

        if (token && publicRoutes.includes(window.location.pathname)) {
            goto('/homepage', { replaceState: true });
        }

        if (!token && !publicRoutes.includes(window.location.pathname)) {
            goto('/login', { replaceState: true });
        }
  })

</script>

<!-- {#if !loggedIn}
<LandingPage />
{/if} -->

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