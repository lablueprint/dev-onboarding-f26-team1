import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  CUISINES,
  type Cuisine,
  type NewRestaurant,
  type PriceLevel,
} from '@/types/restaurant';

const PRICE_LEVELS: PriceLevel[] = [1, 2, 3, 4];

export type FormValues = {
  name: string;
  cuisine: Cuisine | null;
  priceLevel: PriceLevel | null;
  neighborhood: string;
  address: string;
  menuHighlights: string; // comma-separated, as typed
  description: string;
  imageUrl: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function parseMenuHighlights(text: string): string[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

// Empty image URL falls back to a random placeholder photo.
export function resolveImageUrl(imageUrl: string): string {
  const trimmed = imageUrl.trim();
  return trimmed || `https://picsum.photos/seed/${Date.now()}/600/400`;
}

// Returns one message per invalid field; an empty object means the form is valid.
export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (name.length < 2 || name.length > 50) {
    errors.name = 'Name must be 2–50 characters.';
  }

  if (!values.cuisine) {
    errors.cuisine = 'Pick a cuisine.';
  }

  if (!values.priceLevel) {
    errors.priceLevel = 'Pick a price level.';
  }

  if (!values.neighborhood.trim()) {
    errors.neighborhood = 'Neighborhood is required.';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required.';
  }

  if (parseMenuHighlights(values.menuHighlights).length === 0) {
    errors.menuHighlights = 'Add at least one menu highlight.';
  }

  if (values.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }

  const imageUrl = values.imageUrl.trim();
  if (imageUrl && !imageUrl.startsWith('http')) {
    errors.imageUrl = 'Image URL must start with http.';
  }

  return errors;
}

type Props = {
  initialValues?: NewRestaurant;
  submitLabel?: string;
  onSubmit: (values: NewRestaurant) => void | Promise<void>;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

export function RestaurantForm({ initialValues, submitLabel = 'Save', onSubmit }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [cuisine, setCuisine] = useState<Cuisine | null>(initialValues?.cuisine ?? null);
  const [priceLevel, setPriceLevel] = useState<PriceLevel | null>(
    initialValues?.priceLevel ?? null
  );
  const [neighborhood, setNeighborhood] = useState(initialValues?.neighborhood ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [menuHighlights, setMenuHighlights] = useState(
    initialValues?.menuHighlights.join(', ') ?? ''
  );
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const values: FormValues = {
    name,
    cuisine,
    priceLevel,
    neighborhood,
    address,
    menuHighlights,
    description,
    imageUrl,
  };

  // Errors stay hidden until the first submit, then update live as fields are fixed.
  const errors: FormErrors = submitAttempted ? validate(values) : {};

  async function handleSubmit() {
    setSubmitAttempted(true);
    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0 || !cuisine || !priceLevel) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        cuisine,
        priceLevel,
        neighborhood: neighborhood.trim(),
        address: address.trim(),
        menuHighlights: parseMenuHighlights(menuHighlights),
        description: description.trim(),
        imageUrl: resolveImageUrl(imageUrl),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Name</ThemedText>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="Restaurant name"
        />
        <FieldError message={errors.name} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Cuisine</ThemedText>
        <View style={styles.chips}>
          {CUISINES.map((option) => {
            const selected = cuisine === option;
            return (
              <Pressable
                key={option}
                onPress={() => setCuisine(option)}
                style={[styles.chip, selected && styles.chipSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <FieldError message={errors.cuisine} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Price level</ThemedText>
        <View style={styles.priceRow}>
          {PRICE_LEVELS.map((level) => {
            const selected = priceLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setPriceLevel(level)}
                style={[styles.chip, styles.priceButton, selected && styles.chipSelected]}
                accessibilityRole="button"
                accessibilityLabel={`Price level ${level} of 4`}
                accessibilityState={{ selected }}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {'$'.repeat(level)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <FieldError message={errors.priceLevel} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Neighborhood</ThemedText>
        <TextInput
          style={[styles.input, errors.neighborhood && styles.inputError]}
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder="e.g. Westwood"
        />
        <FieldError message={errors.neighborhood} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Address</ThemedText>
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          value={address}
          onChangeText={setAddress}
          placeholder="Street address"
        />
        <FieldError message={errors.address} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Menu highlights (comma-separated)</ThemedText>
        <TextInput
          style={[styles.input, errors.menuHighlights && styles.inputError]}
          value={menuHighlights}
          onChangeText={setMenuHighlights}
          placeholder="e.g. Ramen, Gyoza, Matcha ice cream"
        />
        <FieldError message={errors.menuHighlights} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Description</ThemedText>
        <TextInput
          style={[styles.input, styles.multiline, errors.description && styles.inputError]}
          value={description}
          onChangeText={setDescription}
          placeholder="What makes this place special?"
          multiline
          textAlignVertical="top"
        />
        <FieldError message={errors.description} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Image URL (optional)</ThemedText>
        <TextInput
          style={[styles.input, errors.imageUrl && styles.inputError]}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <FieldError message={errors.imageUrl} />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        accessibilityRole="button">
        <Text style={styles.submitText}>{submitting ? 'Saving…' : submitLabel}</Text>
      </Pressable>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  chipText: {
    fontSize: 14,
    color: '#888',
  },
  chipTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: '#208AEF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
