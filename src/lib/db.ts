const DB_NAME = "recipesDB";
const STORE_NAME = "recipes";
const DB_VERSION = 1;

function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function addRecipe(recipe) {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	tx.objectStore(STORE_NAME).put(recipe);
	return tx.complete;
}

export async function getAllRecipes() {
	const db = await openDB();
	return new Promise((resolve) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const store = tx.objectStore(STORE_NAME);
		const req = store.getAll();
		req.onsuccess = () => resolve(req.result);
	});
}

export async function getRecipeById(id) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		const store = tx.objectStore(STORE_NAME);
		const request = store.get(id);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function deleteRecipe(id) {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	tx.objectStore(STORE_NAME).delete(id);
	return tx.complete;
}