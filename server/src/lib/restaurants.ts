import { readFile, writeFile } from 'node:fs/promises';
import { CUISINES, type Cuisine, type Restaurant } from '../../../src/types/restaurant.ts';

const DATA_FILE = new URL('../../data/restaurants.json', import.meta.url);

// Reads the file live instead of importing to avoid caching stale data
export async function readRestaurants(): Promise<Restaurant[]> {
  return JSON.parse(await readFile(DATA_FILE, 'utf8'));
}

// Throws on failure
async function writeRestaurants(data: Restaurant[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Puts a queue in place to prevent writing race conditions
let queue: Promise<unknown> = Promise.resolve();

export function updateRestaurants(mutate: (data: Restaurant[]) => void): Promise<void> {
  const run = queue.then(async () => {
    const data = await readRestaurants();
    mutate(data);
    await writeRestaurants(data);
  });
  queue = run.catch(() => {}); // a failed write must not block later ones
  return run;
}

export function nextId(data: Restaurant[]): string {
  return String(Math.max(0, ...data.map((r) => Number(r.id) || 0)) + 1);
}

// Validate data is a restaurant. Returns one message per invalid field, an empty object means valid.
// TOOD: move this into a .ts file so that we don't have to rewrite.
// Can't import because of react native dependenceis within RestaurantForm.tsx
export function validateNewRestaurant(body: unknown): Record<string, string> {
  if (typeof body !== 'object' || body === null) {
    return { body: 'Request body must be a JSON object.' };
  }
  const r = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Non-strings count as empty, so they fail the same rules as a blank field
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  const name = str(r.name);
  if (name.length < 2 || name.length > 50) {
    errors.name = 'Name must be 2-50 characters.';
  }
  if (!CUISINES.includes(r.cuisine as Cuisine)) {
    errors.cuisine = 'Pick a cuisine.';
  }
  if (![1, 2, 3, 4].includes(r.priceLevel as number)) {
    errors.priceLevel = 'Pick a price level.';
  }
  if (!str(r.neighborhood)) {
    errors.neighborhood = 'Neighborhood is required.';
  }
  if (!str(r.address)) {
    errors.address = 'Address is required.';
  }
  if (
    !Array.isArray(r.menuHighlights) ||
    !r.menuHighlights.every((item) => typeof item === 'string') ||
    !r.menuHighlights.some((item) => item.trim())
  ) {
    errors.menuHighlights = 'Add at least one menu highlight.';
  }
  if (str(r.description).length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }
  if (!str(r.imageUrl).startsWith('http')) {
    errors.imageUrl = 'Image URL must start with http.';
  }

  return errors;
}
