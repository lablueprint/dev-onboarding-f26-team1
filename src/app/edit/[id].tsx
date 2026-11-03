import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

// TODO(Dhvani, Sprint 2): reuse <RestaurantForm /> to edit an existing restaurant
export default function EditRestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <ThemedText>Editing restaurant {id} (coming in Sprint 2)</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
});
