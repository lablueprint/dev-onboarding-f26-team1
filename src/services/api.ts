import type { NewRestaurant, Restaurant, Cuisine } from '@/types/restaurant';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = process.env.EXPO_PUBLIC_API_URL;
  if (!base) throw new Error('EXPO_PUBLIC_API_URL not set');

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw Object.assign(new Error(`${options.method ?? 'GET'} ${path} failed: ${res.status}`), {
      status: res.status,
    });
  }
  return res.json();
}

export const apiGetRestaurants = () => request<Restaurant[]>('/restaurants');

export const apiGetRestaurantsByCuisine = (cuisine: Cuisine) => request<Restaurant[]>(`/restaurants?cuisine=${encodeURIComponent(cuisine)}`);

export const apiGetRestaurantById = (id: string) =>
  request<Restaurant>(`/restaurants/${id}`).catch((err) => {
    if (err.status === 404) return null;
    throw err;
  });

export const apiAddRestaurant = (input: NewRestaurant) =>
  request<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(input) });

export const apiUpdateRestaurant = (id: string, input: NewRestaurant) =>
  request<Restaurant>(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(input) });

