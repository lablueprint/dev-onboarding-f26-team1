import { RESTAURANTS } from '@/data/restaurants';
import type { NewRestaurant, Restaurant } from '@/types/restaurant';

// Mock data layer. Everything is stored in memory, so changes reset when the app reloads.
// In Sprint 2 these functions will call the real API instead. The function signatures
// should stay the same so nothing else in the app has to change.

let restaurants: Restaurant[] = [...RESTAURANTS];

const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

export async function getRestaurants(): Promise<Restaurant[]> {
  await fakeDelay();
  return [...restaurants];
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  await fakeDelay();
  return restaurants.find((r) => r.id === id) ?? null;
}

export async function addRestaurant(input: NewRestaurant): Promise<Restaurant> {
  await fakeDelay();
  const restaurant: Restaurant = { ...input, id: String(Date.now()), rating: 0 };
  restaurants = [restaurant, ...restaurants];
  return restaurant;
}

export async function updateRestaurant(id: string, input: NewRestaurant): Promise<Restaurant> {
  await fakeDelay();
  const existing = restaurants.find((r) => r.id === id);
  if (!existing) {
    throw new Error('Restaurant not found');
  }
  const updated: Restaurant = { ...input, id: existing.id, rating: existing.rating };
  restaurants = restaurants.map((r) => (r.id === id ? updated : r));
  return updated;
}
