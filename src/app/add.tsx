import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { RestaurantForm } from '@/components/RestaurantForm';
import { Spacing } from '@/constants/theme';
import { addRestaurant } from '@/services/restaurants';
import type { NewRestaurant } from '@/types/restaurant';

export default function AddRestaurantScreen() {
  async function handleSubmit(values: NewRestaurant) {
    await addRestaurant(values);
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <RestaurantForm submitLabel="Add restaurant" onSubmit={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: Spacing.three,
  },
});
