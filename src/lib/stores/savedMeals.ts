import { writable } from 'svelte/store';
import type { Meal } from '$lib/api/meals';

interface SavedMeal {
	id: string;
	name: string;
	image?: string;
	video?: string;
}

const stored: SavedMeal[] =
	typeof window !== 'undefined'
		? JSON.parse(localStorage.getItem('savedMeals') || '[]')
		: [];

function createSavedMeals() {
	const { subscribe, set, update } = writable<SavedMeal[]>(stored);

	subscribe((value: SavedMeal[]) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('savedMeals', JSON.stringify(value));
		}
	});

	return {
		subscribe,

		add(meal: Meal) {
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

		
		remove(id: string) {
			update((meals) => meals.filter((m) => m.id !== id));
		},

		
		toggle(meal: Meal) {
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