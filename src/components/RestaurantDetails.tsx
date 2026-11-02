import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Restaurant } from '@/types/restaurant';

type Props = {
  restaurant: Restaurant;
};

// TODO(Santiago, Sprint 1): show all the restaurant info
export function RestaurantDetails({ restaurant }: Props) {
  return (
    <View>
      <ThemedText type="subtitle">{restaurant.name}</ThemedText>
    </View>
  );
}
