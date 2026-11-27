import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { REVIEWS } from '@/data/reviews';
import type { Review } from '@/types/review';

export type ReviewInput = { author: string; rating: number; text: string };
export type ReviewItem = Review & { isOwn: boolean };

function storageKey(restaurantId: string) {
  return `reviews:${restaurantId}`;
}

async function loadOwnReviews(restaurantId: string): Promise<Review[]> {
  try {
    const stored = await AsyncStorage.getItem(storageKey(restaurantId));
    return stored ? (JSON.parse(stored) as Review[]) : [];
  } catch (error) {
    console.warn('Could not load reviews', error);
    return [];
  }
}

export function useReviews(restaurantId: string) {
  // Remember which restaurant the saved list belongs to, so the previous restaurant's
  // reviews never show while the new ones are loading
  const [saved, setSaved] = useState<{ restaurantId: string; reviews: Review[] } | null>(null);
  const ownReviews = saved?.restaurantId === restaurantId ? saved.reviews : [];

  useEffect(() => {
    let cancelled = false;
    loadOwnReviews(restaurantId).then((loaded) => {
      if (!cancelled) setSaved({ restaurantId, reviews: loaded });
    });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  async function saveOwnReviews(next: Review[]) {
    setSaved({ restaurantId, reviews: next });
    try {
      await AsyncStorage.setItem(storageKey(restaurantId), JSON.stringify(next));
    } catch (error) {
      console.warn('Could not save reviews', error);
    }
  }

  function addReview(input: ReviewInput) {
    const review: Review = {
      id: `user-${Date.now()}`,
      restaurantId,
      author: input.author.trim(),
      rating: input.rating,
      text: input.text.trim(),
      createdAt: new Date().toISOString(),
    };
    return saveOwnReviews([...ownReviews, review]);
  }

  function deleteReview(id: string) {
    return saveOwnReviews(ownReviews.filter((review) => review.id !== id));
  }

  const reviews: ReviewItem[] = [
    ...REVIEWS.filter((review) => review.restaurantId === restaurantId).map((review) => ({
      ...review,
      isOwn: false,
    })),
    ...ownReviews.map((review) => ({ ...review, isOwn: true })),
  ];

  return { reviews, addReview, deleteReview };
}
