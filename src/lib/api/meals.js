const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query = '') {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getAreas() {
	const res = await fetch(`${BASE_URL}/list.php?a=list`);
	const data = await res.json();
	return data.meals || [];
}

export async function getRandomMeals() {
  const res = await fetch(`${BASE_URL}/search.php?f=c`);
  const data = await res.json();
  return data.meals || [];
}

export async function getMealsByArea(area) {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getMealsByCategory(category) {
	const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
	const data = await res.json();
	return data.meals || [];
}

export async function getCategories() {
	const res = await fetch(`${BASE_URL}/categories.php`);
	const data = await res.json();
	return data.categories || [];
}