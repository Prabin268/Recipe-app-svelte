<script lang="ts">
	import { miniAppInit } from '../../miniapp';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';

	let currentView: 'landing' | 'login' | 'signup' = 'landing';
	let loading = false;
	let error = '';

	let name = '';
	let email = '';
	let password = '';
	let confirm_password = '';

	function showLanding() {
		currentView = 'landing';
	}
	function showLogin() {
		currentView = 'login';
	}
	function showSignup() {
		currentView = 'signup';
	}

	function navigateToLogin() {
		showLogin();
	}

	function navigateToSignup() {
		showSignup();
	}

	const handleGoogleLogin = async () => {
		const miniapp = window.miniapp;
		if (!miniapp) return;

		try {
			loading = true;
			const res = await miniapp.login('g');
			console.log('login res', res);
			userStore.set(res?.user_profile);
			goto('/homepage');
		} catch (err) {
			console.log('miniapp login error', err);
		} finally {
			loading = false;
		}
	};
</script>

{#if currentView === 'landing'}
	<div
		class="flex min-h-screen w-full flex-col justify-center bg-cover bg-center"
		style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,1)),url('/image.png')"
	>
		<div
			class="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-14"
		>
			<div class="h-10 w-20"><img src="/hat.png" alt="hat" /></div>
			<h1 class="mb-30 text-[20px] text-white">100K+ Premium Recipe</h1>
			<div class="flex flex-col">
				<h1 class="text-center text-[50px] font-bold text-white">Get <br /> Cooking</h1>
				<p class="text-center text-[20px] text-white">Simple way to find Tasty Recipe</p>
			</div>
			<button
				on:click={navigateToLogin}
				class="rounded-xl bg-[rgba(18,149,117,1)] px-20 py-3 text-white"
			>
				Start Cooking →
			</button>
		</div>
	</div>
{/if}

{#if currentView === 'login'}
	<div
		class="fixed flex h-full w-full flex-col bg-gray-100 bg-cover bg-center p-1
         md:flex md:min-h-screen md:items-center md:justify-center"
	>
		<div class="mx-auto min-h-screen w-full max-w-md space-y-4 rounded-2xl p-8">
			<div class="mt-10 mb-15 text-left md:mt-0">
				<h1 class="text-5xl font-bold">Hello,</h1>
				<p class="text-3xl text-gray-600">Welcome Back!</p>
			</div>

			<form action="?login" method="POST" class="space-y-4 md:space-y-0.5">
				<div class="flex flex-col">
					<label class="md:text-md flex flex-col gap-2 text-[20px] font-semibold text-gray-700">
						Email
						<input
							name="email"
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							required
							class="h-15 rounded-lg border px-4 py-2 text-[15px] focus:border-transparent focus:ring-2 focus:outline-none md:h-12"
						/>
					</label>
				</div>

				<div class="flex flex-col gap-5">
					<label class="md:text-md mb-2 flex flex-col gap-2 text-[20px] font-medium text-gray-700">
						Password
						<input
							name="password"
							bind:value={password}
							type="password"
							placeholder="Enter your password"
							required
							class="h-15 rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none md:h-12"
						/>
					</label>

					{#if error}
						<p class="text-sm text-red-500">{error}</p>
					{/if}
				</div>

				<button
					on:click={() => goto('/homepage')}
					class="w-full rounded-lg bg-[rgba(18,149,117,1)] py-5 font-semibold text-white transition duration-300"
				>
					Sign In →
				</button>
			</form>

			<div class="my-5 mb-10 flex w-full items-center md:mb-4">
				<div class="h-0.5 flex-1 bg-slate-200"></div>
				<p class="mx-5 my-0 text-[10px] whitespace-nowrap text-gray-500">Or Sign In With</p>
				<div class="h-0.5 flex-1 bg-slate-200"></div>
			</div>

			<div class="flex w-full justify-center gap-5 border-0">
				<button
					type="button"
					on:click={handleGoogleLogin}
					disabled={loading}
					class="flex size-15 items-center justify-center rounded-lg shadow-xl"
					aria-label="google-btn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<path
							fill="#FFC107"
							d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20C35.045,44,44,35.045,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						/>
						<path
							fill="#FF3D00"
							d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
						/>
						<path
							fill="#4CAF50"
							d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
						/>
						<path
							fill="#1976D2"
							d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						/>
					</svg>
				</button>

				<button
					type="button"
					class="flex size-15 items-center justify-center rounded-lg shadow-xl"
					aria-label="facebook-btn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<path
							fill="#3F51B5"
							d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
						/>
						<path
							fill="#FFF"
							d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
						/>
					</svg>
				</button>
			</div>

			<h1 class="mt-10 text-center font-semibold md:mt-1">
				Don't have an account?
				<button on:click={navigateToSignup} style="color: rgba(255, 156, 0, 1)">Sign Up</button>
			</h1>
		</div>
	</div>
{/if}

{#if currentView === 'signup'}
	<div
		class="fixed flex h-full w-full flex-col bg-gray-100 bg-cover bg-center p-1
         md:flex md:min-h-screen md:items-center md:justify-center"
	>
		<div
			class="mx-auto min-h-screen w-full max-w-md space-y-6 rounded-2xl
           p-8 md:flex md:min-h-[90vh] md:flex-col md:justify-center md:p-10"
		>
			<div class="mb-10 text-left md:mb-5">
				<h1 class="text-3xl font-bold md:text-3xl">Create an account</h1>
				<p class="text-1xl md:text-md text-gray-600">
					Let's help you set up your account, <br />
					it won't take long.
				</p>
			</div>

			<form action="?signup" method="POST" class="space-y-4 md:mt-0 md:mb-1">
				<div class="flex flex-col">
					<label class="flex flex-col gap-1 text-[20px] font-semibold text-gray-700 md:text-sm">
						Name
						<input
							name="name"
							type="text"
							bind:value={name}
							placeholder="Enter your name"
							required
							class="h-12 rounded-lg border px-4 py-2 text-[15px] focus:border-transparent focus:ring-2 focus:outline-none md:h-10 md:text-sm"
						/>
					</label>
				</div>

				<div class="flex flex-col">
					<label class="flex flex-col gap-1 text-[20px] font-semibold text-gray-700 md:text-sm">
						Email
						<input
							name="email"
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							required
							class="h-12 rounded-lg border px-4 py-2 text-[15px] focus:border-transparent focus:ring-2 focus:outline-none md:h-10 md:text-sm"
						/>
					</label>
				</div>

				<div class="flex flex-col gap-5">
					<label class="mb-1 flex flex-col gap-1 text-[20px] font-medium text-gray-700 md:text-sm">
						Password
						<input
							name="password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							required
							class="h-12 rounded-lg border px-4 py-2 text-[15px] focus:border-transparent focus:ring-2 focus:outline-none md:h-10 md:text-sm"
						/>
					</label>
				</div>

				<div class="flex flex-col gap-5 md:gap-0">
					<label class="mb-1 flex flex-col gap-1 text-[20px] font-medium text-gray-700 md:text-sm">
						Confirm Password
						<input
							name="confirmPassword"
							type="password"
							bind:value={confirm_password}
							placeholder="Retype password"
							required
							class="h-12 rounded-lg border px-4 py-2 text-[15px] focus:border-transparent focus:ring-2 focus:outline-none md:h-10 md:text-sm"
						/>
					</label>

					<div class="h-auto w-full">
						<label class="flex items-center gap-2 text-amber-500 md:text-[10px]">
							<input type="checkbox" class="w-4" />
							Accept Terms & Conditions
						</label>
					</div>
				</div>

				<button
					on:click={() => goto('/homepage')}
					class="w-full rounded-lg bg-[rgba(18,149,117,1)] py-5 font-semibold text-white transition duration-300 md:flex md:h-10 md:items-center md:justify-center"
				>
					Sign Up →
				</button>
			</form>

			<div class="mx-0 my-1 flex w-full items-center">
				<div class="h-0.5 flex-1 bg-slate-200"></div>
				<p class="mx-10 my-0 text-[10px] whitespace-nowrap text-gray-500">Or Sign In With</p>
				<div class="h-0.5 flex-1 bg-slate-200"></div>
			</div>

			<div class="flex w-full justify-center gap-5 md:mb-0">
				<button
					type="button"
					on:click={handleGoogleLogin}
					disabled={loading}
					class="flex size-15 items-center justify-center rounded-lg shadow-xl"
					aria-label="google-btn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<path
							fill="#FFC107"
							d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20C35.045,44,44,35.045,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						/>
						<path
							fill="#FF3D00"
							d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
						/>
						<path
							fill="#4CAF50"
							d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
						/>
						<path
							fill="#1976D2"
							d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						/>
					</svg>
				</button>

				<button
					type="button"
					class="flex size-15 items-center justify-center rounded-lg shadow-xl"
					aria-label="facebook-btn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
						<path
							fill="#3F51B5"
							d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
						/>
						<path
							fill="#FFF"
							d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
						/>
					</svg>
				</button>
			</div>

			<h1 class="mt-5 text-center font-semibold md:text-sm">
				Already have an account?
				<button on:click={navigateToLogin} style="color: rgba(255, 156, 0, 1)">Sign In</button>
			</h1>
		</div>
	</div>
{/if}
