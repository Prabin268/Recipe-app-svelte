const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strYoutube?: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Area {
  strArea: string;
}

export async function searchMeals(query: string = ''): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data: { meals: Meal[] | null } = await res.json();
  return data.meals || [];
}

export async function getAreas(): Promise<Area[]> {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  const data: { meals: Area[] | null } = await res.json();
  return data.meals || [];
}

export async function getRandomMeals(): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/search.php?f=c`);
  const data: { meals: Meal[] | null } = await res.json();
  return data.meals || [];
}

export async function getMealsByArea(area: string): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
  const data: { meals: Meal[] | null } = await res.json();
  return data.meals || [];
}

export async function getMealsByCategory(category: string): Promise<Meal[]> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const data: { meals: Meal[] | null } = await res.json();
  return data.meals || [];
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data: { categories: Category[] | null } = await res.json();
  return data.categories || [];
}