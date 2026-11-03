import type { Restaurant, RestaurantFilters } from '@/types/restaurant';

// TODO(Emiliano): filter by search (Sprint 1) and cuisine (Sprint 2)
export function filterRestaurants(
  restaurants: Restaurant[],
  { search, cuisine }: RestaurantFilters
): Restaurant[] {
  return restaurants;
}
