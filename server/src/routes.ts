import { Router } from 'express';
import { nextId, readRestaurants, updateRestaurants, validateNewRestaurant } from './lib/restaurants.ts';
import type { NewRestaurant, Restaurant } from '../../src/types/restaurant.ts';

const router = Router();

router.get('/', async (req, res) => {
  const { cuisine } = req.query;
  const restaurants = await readRestaurants();

  const results = cuisine
    ? restaurants.filter((r) => r.cuisine.toLowerCase() === String(cuisine).toLowerCase())
    : restaurants;

  res.json(results);
});

router.get('/:id', async (req, res) => {
  const restaurants = await readRestaurants();
  const restaurant = restaurants.find((r) => r.id === req.params.id);

  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: `Cannot find restaurant with id: ${req.params.id}` });
  }
});

router.post('/', async (req, res) => {
  const errors = validateNewRestaurant(req.body);
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: 'Invalid restaurant', errors });
    return;
  }

  const body: NewRestaurant = req.body;
  let created: Restaurant | undefined;

  try {
    // id is computed inside the locked update so concurrent POSTs never share one
    await updateRestaurants((restaurants) => {
      created = { ...body, id: nextId(restaurants), rating: 0 };
      restaurants.push(created!);
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save restaurant' });
  }
});

router.put('/:id', async (req, res) => {
  const restaurants = await readRestaurants();
  const restaurant = restaurants.find((r) => r.id === req.params.id);
  const errors = validateNewRestaurant(req.body);

  if (!restaurant) {
    res.status(404).json({ error: `Cannot find restaurant with id: ${req.params.id}` });
    return;
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: 'Invalid restaurant', errors });
    return;
  }

  const body: NewRestaurant = req.body;
  let updated: Restaurant | undefined;

  try {
    // Define current inside to cath concurrent deletes
    await updateRestaurants((current) => {
      const i = current.findIndex((r) => r.id === req.params.id);
      if (i === -1) return;
      updated = { ...body, id: current[i].id, rating: current[i].rating };
      current[i] = updated;
    });

    if (!updated) {
      res.status(404).json({ error: `Cannot find restaurant with id: ${req.params.id}` });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to update restaurant"})
  }
})

export default router;
