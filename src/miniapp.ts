
import { userStore } from '$lib/stores/user';
import { jwtDecode } from 'jwt-decode';

declare global {
	interface Window {
		hamromini_sdkjs?: HamroMiniSDK;
		miniapp: MiniApp;
	}
}

export enum MiniappPlatform {
	BROWSER = 'BROWSER',
	IOS = 'IOS',
	ANDROID = 'ANDROID'
}

interface HamroMiniSDK {
	MiniApp: new () => MiniApp;
	initialize: (clientId: string, miniapp: MiniApp) => Promise<any>;
}

interface MiniApp {
	getPlatform(): MiniappPlatform;
	getHostVersion(): Promise<string>;
	getContacts(): Promise<string | Array<any>>;
	showQR(param: string): Promise<any>;
	close(): Function;
	downloadFile(url?: string, fileType?: string): Promise<any>;
	login(provider?: string): Promise<any>;
	logout(): Promise<any>;
	getAccessToken(): Promise<string>;
	putCache(key: string, value: string): Promise<any>;
	getCache(key: string): Promise<string>;
	clearCache(key: string): Promise<any>;
	clearAllCache(): Promise<any>;
	getHWSHostVersion(): Promise<string>;
	downloadHWS(version: string, autoRefresh: boolean): Promise<any>;
	initialized: boolean;
}

const CLIENT_ID = 'test-ma-2';

export function miniAppInit(retryTimes = 3): Promise<any> {
	const hamromini_sdkjs = window?.hamromini_sdkjs;
	if (hamromini_sdkjs) {
		window.miniapp = new hamromini_sdkjs.MiniApp();
	}
	return new Promise(async (resolve, reject) => {
		try {
			const userDetail = await hamromini_sdkjs?.initialize(CLIENT_ID, window.miniapp);
			console.log("user detail", userDetail)
			if (userDetail?.user_profile) {
				userDetail.isLoggedIn = true;
				localStorage.setItem('foodapp_user', JSON.stringify(userDetail.user_profile));
				userStore.set(userDetail?.user_profile)
			}


			let expireTime: number;
			let currentTime: number = Date.now();

			if (userDetail?.access_token) {
				expireTime = jwtDecode(userDetail?.access_token)?.exp! * 1000;
				localStorage.setItem('exp', expireTime.toString());
				localStorage.setItem('foodapp_access-token', userDetail?.access_token);
			}

			if (window.miniapp && userDetail?.access_token && expireTime! - 15 * 60000 <= currentTime) {
				window.miniapp.getAccessToken().then((token: string) => {
					localStorage.setItem('foodapp_access-token', token);
				});
			}
			resolve(userDetail as any);
		} catch (err) {
			if (retryTimes === 1) reject(err);
			else {
				setTimeout(() => {
					miniAppInit(retryTimes - 1)
						.then((res) => {
							resolve(res);
						})
						.catch((error) => reject(error));
				}, 1000);
			}
		}
	});
}

export function getAccessToken() {
	const expireIn: any = localStorage.getItem('exp');
	const currentTimestamp: any = Date.now();

	if (expireIn < currentTimestamp && localStorage.getItem('foodapp_access-token')) {
		miniAppInit(3).then();
		return localStorage.getItem('foodapp_access-token');
	}
	return localStorage.getItem('foodapp_access-token');
}