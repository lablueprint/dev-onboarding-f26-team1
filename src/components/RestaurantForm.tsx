import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { NewRestaurant } from '@/types/restaurant';

type Props = {
  initialValues?: NewRestaurant;
  submitLabel?: string;
  onSubmit: (values: NewRestaurant) => void | Promise<void>;
};

// TODO(Dhvani, Sprint 1): inputs, validation, submit
export function RestaurantForm(props: Props) {
  return (
    <View>
      <ThemedText>Form coming soon</ThemedText>
    </View>
  );
}
