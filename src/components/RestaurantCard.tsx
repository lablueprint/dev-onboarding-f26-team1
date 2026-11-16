import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Restaurant } from '@/types/restaurant';
import { Image } from 'expo-image';

type Props = {
  restaurant: Restaurant;
};

// TODO(Max, Sprint 1): build the real card (image, name, cuisine, price, rating)
export function RestaurantCard({ restaurant }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}
      style={styles.placeholder}>
      <Image source={{ uri: restaurant.imageUrl }} style={{ width: '100%', height: 180 }} contentFit="cover" />
      <View style={styles.cardContent}>
        <ThemedText>{restaurant.name}</ThemedText>
        <ThemedText>{restaurant.cuisine} · {'$'.repeat(restaurant.priceLevel)} · {restaurant.neighborhood}</ThemedText>
        <ThemedText>⭐ {restaurant.rating.toFixed(1)}</ThemedText>

        {expanded && <ThemedText>{restaurant.description}</ThemedText>}
        <Pressable onPress={() => setExpanded(!expanded)}>
          <ThemedText type="link">{expanded ? 'Show Less' : 'Show More'}</ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({ 
  placeholder: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(80, 73, 84, 0.5)',
  },
  cardContent: {
    padding: 12,
  }
});
