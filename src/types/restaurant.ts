export const CUISINES = [
  'American',
  'Chinese',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mexican',
  'Thai',
] as const;

export type Cuisine = (typeof CUISINES)[number];

export type PriceLevel = 1 | 2 | 3 | 4;

export type Restaurant = {
  id: string;
  name: string;
  cuisine: Cuisine;
  priceLevel: PriceLevel;
  neighborhood: string;
  address: string;
  rating: number; // average rating, 0-5
  imageUrl: string;
  description: string;
  menuHighlights: string[];
};

// What the add/edit form produces. The app sets id and rating.
export type NewRestaurant = Omit<Restaurant, 'id' | 'rating'>;

export type RestaurantFilters = {
  search: string;
  cuisine: Cuisine | null;
};
