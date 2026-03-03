<script>
  import './layout.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const noLayoutRoutes = ['/', '/login', '/signup'];

  const hideLayout = $derived(
    noLayoutRoutes.includes($page.url.pathname)
  );

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

{#if !hideLayout}
  <Navbar />
  <Sidebar />
{/if}

<div class={hideLayout ? '' : 'pb-20 md:pl-56'}>
  {@render children()}
</div>