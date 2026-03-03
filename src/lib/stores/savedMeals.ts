import { writable } from 'svelte/store';

const stored =
	typeof window !== 'undefined'
		? JSON.parse(localStorage.getItem('savedMeals') || '[]')
		: [];

function createSavedMeals() {
	const { subscribe, set, update } = writable(stored);

	subscribe((value) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('savedMeals', JSON.stringify(value));
		}
	});

	return {
		subscribe,

		add(meal) {
			update((meals) => {
				const exists = meals.some((m) => m.id === meal.idMeal);
				if (exists) return meals;

				return [
					...meals,
					{
						id: meal.idMeal,
						name: meal.strMeal,
						image: meal.strMealThumb,
						video: meal.strYoutube
					}
				];
			});
		},

		
		remove(id) {
			update((meals) => meals.filter((m) => m.id !== id));
		},

		
		toggle(meal) {
			update((meals) => {
				const exists = meals.some((m) => m.id === meal.idMeal);

				if (exists) {
					return meals.filter((m) => m.id !== meal.idMeal);
				}

				return [
					...meals,
					{
						id: meal.idMeal,
						name: meal.strMeal,
						image: meal.strMealThumb,
						video: meal.strYoutube
					}
				];
			});
		}
	};
}

export const savedMeals = createSavedMeals();