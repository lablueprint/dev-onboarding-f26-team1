import { Router } from 'express';
import { readFile } from 'node:fs/promises';
import type { Restaurant } from '../../src/types/restaurant.ts';
import type { Request, Response } from 'express';

const DATA_FILE = new URL('../data/restaurants.json', import.meta.url);

// Reads the file live instead of importing to avoid caching stale data
async function readRestaurants(): Promise<Restaurant[]> {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
}

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { cuisine } = req.query;
    const restaurants = await readRestaurants();

    const results = cuisine
        ? restaurants.filter(r => r.cuisine.toLowerCase() === String(cuisine).toLowerCase())
        : restaurants

    res.json(results);
    
});

router.get('/:id', async (req: Request, res: Response) => {
    const restaurants = await readRestaurants();

    const restaurant = restaurants.find(o => o.id == req.params.id);

    if (restaurant != undefined){
        res.json(restaurant);
    } else {
        res.status(404).json({ error: `Cannot find restaurant with id: ${req.params.id}` });
    }
})

export default router;
