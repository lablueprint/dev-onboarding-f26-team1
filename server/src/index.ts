import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { constants, copyFileSync } from 'node:fs';

import restaurantRoutes from './routes.ts';

// Seeds restaurants.json on first run; COPYFILE_EXCL keeps an existing file untouched
try {
  copyFileSync(
    new URL('../data/restaurants.seed.json', import.meta.url),
    new URL('../data/restaurants.json', import.meta.url),
    constants.COPYFILE_EXCL,
  );
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
    console.error('Could not copy seed data:', error);
    process.exit(1); // exits early since nothing would be served
  }
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/restaurants', restaurantRoutes);
app.use('/', (req, res) => {
  res.status(404).json({ error: 'The requested endpoint could not be found' });
});

// Express only treats middleware with 4 parameters as an error handler, so we have to keep 'next'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
