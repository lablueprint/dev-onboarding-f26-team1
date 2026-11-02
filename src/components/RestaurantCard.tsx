import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Restaurant } from '@/types/restaurant';

type Props = {
  restaurant: Restaurant;
};

// TODO(Max, Sprint 1): build the real card (image, name, cuisine, price, rating)
export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link href={`/restaurant/${restaurant.id}`} style={styles.placeholder}>
      <ThemedText>{restaurant.name}</ThemedText>
    </Link>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    paddingVertical: Spacing.two,
  },
});
