import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { NewRestaurant } from '@/types/restaurant';

type Props = {
  initialValues?: NewRestaurant;
  submitLabel?: string;
  onSubmit: (values: NewRestaurant) => void | Promise<void>;
};

// TODO(Dhvani, Sprint 1): validation, submit
export function RestaurantForm({ initialValues }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [neighborhood, setNeighborhood] = useState(initialValues?.neighborhood ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [menuHighlights, setMenuHighlights] = useState(
    initialValues?.menuHighlights.join(', ') ?? ''
  );
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '');

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Name</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Restaurant name"
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Neighborhood</ThemedText>
        <TextInput
          style={styles.input}
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder="e.g. Westwood"
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Address</ThemedText>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Street address"
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Menu highlights (comma-separated)</ThemedText>
        <TextInput
          style={styles.input}
          value={menuHighlights}
          onChangeText={setMenuHighlights}
          placeholder="e.g. Ramen, Gyoza, Matcha ice cream"
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Description</ThemedText>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="What makes this place special?"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Image URL (optional)</ThemedText>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
  },
});
