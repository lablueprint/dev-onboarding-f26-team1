import { ScrollView, StyleSheet } from 'react-native';

import { RestaurantCard } from '@/components/RestaurantCard';
import { Spacing } from '@/constants/theme';
import type { Restaurant } from '@/types/restaurant';

type Props = {
  restaurants: Restaurant[];
  refreshing?: boolean;
  onRefresh?: () => void;
};

// TODO(Max, Sprint 1): replace with a FlatList (pull-to-refresh, empty state)
export function RestaurantList({ restaurants }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
  },
});
