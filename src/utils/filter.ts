import type { Restaurant, RestaurantFilters } from '@/types/restaurant';

// TODO(Emiliano): filter by search (Sprint 1) and cuisine (Sprint 2)
export function filterRestaurants(
  restaurants: Restaurant[],
  { search, cuisine }: RestaurantFilters
): Restaurant[] {
  const sanitized : string = search.trim().toLowerCase(); // clean up search

  if (sanitized === "") { return restaurants; } //empty search returns everything

  const filtered = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(sanitized) || 
    restaurant.neighborhood.toLowerCase().includes(sanitized)); //Must search by name OR neighborhood
  return filtered;
}
