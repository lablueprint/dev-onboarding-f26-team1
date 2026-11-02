import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ReviewsSection } from '@/components/ReviewsSection';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO(Santiago, Sprint 1): load the restaurant with useRestaurant(id) and render <RestaurantDetails />
  // Keep the Edit link (Dhvani) and <ReviewsSection /> (Andy) on this screen.
  return (
    <View style={styles.container}>
      <ThemedText>Restaurant {id}</ThemedText>

      <Link href={`/edit/${id}`} style={styles.editLink}>
        <ThemedText type="linkPrimary">Edit</ThemedText>
      </Link>

      <ReviewsSection restaurantId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  editLink: {
    marginTop: Spacing.two,
  },
});
