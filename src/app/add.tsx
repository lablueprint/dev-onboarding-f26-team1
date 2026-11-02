import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

// TODO(Dhvani, Sprint 1): render <RestaurantForm />, call addRestaurant() on submit, then router.back()
export default function AddRestaurantScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Add restaurant (coming soon)</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
});
