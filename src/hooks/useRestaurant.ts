import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getRestaurantById } from '@/services/restaurants';
import type { Restaurant } from '@/types/restaurant';

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reload on focus so the screen is up to date after editing.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getRestaurantById(id)
        .then((r) => {
          if (!cancelled) {
            setRestaurant(r);
            setError(null);
          }
        })
        .catch((e) => {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Something went wrong');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, [id])
  );

  return { restaurant, loading, error };
}
