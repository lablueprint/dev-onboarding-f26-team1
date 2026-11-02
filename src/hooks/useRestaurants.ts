import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getRestaurants } from '@/services/restaurants';
import type { Restaurant } from '@/types/restaurant';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    try {
      setRestaurants(await getRestaurants());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload every time the screen comes back into focus so added/edited restaurants show up.
  useFocusEffect(
    useCallback(() => {
      load(false);
    }, [load])
  );

  const refetch = useCallback(() => load(true), [load]);

  return { restaurants, loading, error, refetch };
}
