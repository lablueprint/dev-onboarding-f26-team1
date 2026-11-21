import { RESTAURANTS } from '@/data/restaurants';
import type { NewRestaurant, Restaurant } from '@/types/restaurant';
import { apiGetRestaurants, apiGetRestaurantById, apiAddRestaurant, apiUpdateRestaurant } from '@/services/api';

let restaurants: Restaurant[] = [...RESTAURANTS];
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

export async function getRestaurants(): Promise<Restaurant[]> {
  if (!apiUrl) {
    await fakeDelay();
    return [...restaurants];
  }

  return await apiGetRestaurants();

}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  if (!apiUrl) {
    await fakeDelay();
    return restaurants.find((r) => r.id === id) ?? null;
  }

  return await apiGetRestaurantById(id);
}

export async function addRestaurant(input: NewRestaurant): Promise<Restaurant> {
  if (!apiUrl) {
    await fakeDelay();
    const restaurant: Restaurant = { ...input, id: String(Date.now()), rating: 0 };
    restaurants = [restaurant, ...restaurants];
    return restaurant;
  }

  return await apiAddRestaurant(input);
}

export async function updateRestaurant(id: string, input: NewRestaurant): Promise<Restaurant> {
  if (!apiUrl) {
    await fakeDelay();
    const existing = restaurants.find((r) => r.id === id);
    if (!existing) {
      throw new Error('Restaurant not found');
    }
    const updated: Restaurant = { ...input, id: existing.id, rating: existing.rating };
    restaurants = restaurants.map((r) => (r.id === id ? updated : r));
    return updated;
  }

  return await apiUpdateRestaurant(id, input);
}
