<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { miniAppInit } from '../miniapp';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';
	import { get } from 'svelte/store';
	import { pwaInfo } from 'virtual:pwa-info';

	const publicRoutes: string[] = ['/'];
	let hideLayout: boolean;
	let userLoaded = false;
	$: hideLayout = publicRoutes.includes($page.url.pathname);
	$: webManifestLink = pwaInfo?.webManifest.linkTag ?? '';

	onMount(() => {
		miniAppInit();

		const user = get(userStore);
		const path = $page.url.pathname;

		if (!user && !publicRoutes.includes(path)) {
			goto('/');
		} else if (user && path === '/') {
			goto('/home');
		}

		userLoaded = true;

		const onPopState = () => {
			const currentUser = get(userStore);
			const currentPath = window.location.pathname;
			if (!currentUser && !publicRoutes.includes(currentPath)) {
				goto('/', { replaceState: true });
			} else if (currentUser && currentPath === '/') {
				goto('/home', { replaceState: true });
			}
		};

		window.addEventListener('popstate', onPopState);

		import('virtual:pwa-register').then(({ registerSW }) => {
			const updateSW = registerSW({
				immediate: true,
			});
		});

		return () => {
			window.removeEventListener('popstate', onPopState);
		};
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	{@html webManifestLink}
</svelte:head>

{#if !hideLayout}
	<Navbar />
	<div class="flex max-h-screen overflow-hidden">
		<Sidebar />
		<main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
			<slot />
		</main>
	</div>
{:else}
	<main class="max-h-screen bg-gray-50 dark:bg-gray-900">
		<slot />
	</main>
{/if}
