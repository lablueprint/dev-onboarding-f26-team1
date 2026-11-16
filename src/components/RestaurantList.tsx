import { FlatList, StyleSheet } from 'react-native';

import { RestaurantCard } from '@/components/RestaurantCard';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Restaurant } from '@/types/restaurant';

type Props = {
  restaurants: Restaurant[];
  refreshing?: boolean;
  onRefresh?: () => void;
};

// TODO(Max, Sprint 1): replace with a FlatList (pull-to-refresh, empty state)
export function RestaurantList({ restaurants, refreshing, onRefresh }: Props) {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      contentContainerStyle={styles.container}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={<ThemedText>No restaurants found!</ThemedText>}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
  },
});
