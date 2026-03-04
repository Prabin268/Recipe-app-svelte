<script lang="ts">
  import './layout.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const noLayoutRoutes: string[] = ['/', '/login', '/signup'];

  let hideLayout: boolean;

  $: hideLayout = noLayoutRoutes.includes($page.url.pathname);

</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

{#if !hideLayout}
  <Navbar />
  <Sidebar />
{/if}

<div class={hideLayout ? '' : 'pb-20 md:pl-56'}>
  <slot />
</div>