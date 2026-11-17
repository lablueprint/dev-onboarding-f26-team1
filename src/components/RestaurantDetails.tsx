import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { PriceLevel, Restaurant } from '@/types/restaurant';
import { Image } from 'expo-image';

import { useState } from 'react';

type Props = {
  restaurant: Restaurant;
};

function formatPrice(tag : PriceLevel) : string {

  const money : string = "$".repeat(tag);
  let level : string = "";

  if (tag === 1) level = "Low";
  if (tag === 2) level = "Moderate";
  if (tag === 3) level = "Expensive";
  if (tag === 4) level = "Very expensive";




  return (`${money} · ${level}`);

}

export function RestaurantDetails({ restaurant }: Props) {

  const [expanded, setExpanded] = useState(false);

  const lines = expanded ? undefined : 3;
  
  return (
    <View>
      <Image source={{ uri: restaurant.imageUrl }} style={{ width: '100%', height: 300}}/>

      <ThemedText type="title">{restaurant.name}</ThemedText>
      <ThemedText type="subtitle">CUISINE: {restaurant.cuisine}</ThemedText>
      <ThemedText type="default">{formatPrice(restaurant.priceLevel)}</ThemedText>

      <ThemedText type="default">{restaurant.neighborhood}</ThemedText>
      <ThemedText type="default">{restaurant.address}</ThemedText>
      <ThemedText type="smallBold">{restaurant.rating}★</ThemedText>

      <ThemedText type= "subtitle">Highlights: </ThemedText>
      {restaurant.menuHighlights.map((menuHighlight) => <ThemedText type= "default" key = {menuHighlight}>- {menuHighlight}</ThemedText>)}

      <ThemedText type= "default" numberOfLines={lines}>{restaurant.description}</ThemedText>
      <ThemedText type="linkPrimary" onPress={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Read more"}</ThemedText>

    </View>
  );
}
