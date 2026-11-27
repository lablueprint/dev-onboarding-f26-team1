import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

const STAR_LEVELS = [1, 2, 3, 4, 5];
const ERROR_COLORS = { light: '#D32F2F', dark: '#FF6B6B' };
const BORDER_COLORS = { light: '#ccc', dark: '#3a3d42' };

export type ReviewFormValues = { author: string; rating: number; text: string };

type FormValues = Omit<ReviewFormValues, 'rating'> & { rating: number | null };
type FormErrors = Partial<Record<keyof FormValues, string>>;

type Props = {
  onSubmit: (values: ReviewFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const authorLength = values.author.trim().length;
  const textLength = values.text.trim().length;

  if (authorLength === 0) {
    errors.author = 'Name is required';
  } else if (authorLength > 50) {
    errors.author = 'Name must be 50 characters or less';
  }

  if (values.rating === null) {
    errors.rating = 'Pick a rating';
  }

  if (textLength < 10 || textLength > 500) {
    errors.text = 'Review must be 10–500 characters';
  }

  return errors;
}

function FieldError({ message, color }: { message?: string; color: string }) {
  if (!message) return null;
  return <ThemedText type="small" style={{ color }}>{message}</ThemedText>;
}

// placeholder
function StarPicker({
  rating,
  onChange,
  color,
  borderColor,
}: {
  rating: number | null;
  onChange: (rating: number) => void;
  color: string;
  borderColor: string;
}) {
  return (
    <View style={[styles.starRow, { borderColor }]}>
      {STAR_LEVELS.map((n) => (
        <Pressable
          key={n}
          onPress={() => onChange(n)}
          accessibilityRole="button"
          accessibilityLabel={`${n} star${n === 1 ? '' : 's'}`}
          accessibilityState={{ selected: rating === n }}
          style={styles.starButton}>
          <ThemedText style={[styles.star, { color }]}>{n <= (rating ?? 0) ? '★' : '☆'}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

export function ReviewForm({ onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const errorColor = ERROR_COLORS[scheme];
  const borderColor = BORDER_COLORS[scheme];

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const values = { author, rating, text };
  // Show validation after the first submit, then update it as the user edits
  const errors = submitAttempted ? validate(values) : {};
  const textLength = text.trim().length;
  const counterColor = textLength > 500 || errors.text ? errorColor : theme.textSecondary;

  async function handleSubmit() {
    setSubmitAttempted(true);
    // `rating === null` is already covered by validate; it's repeated so TypeScript knows rating is a number
    if (rating === null || Object.keys(validate(values)).length > 0) return;

    setSubmitting(true);
    await onSubmit({ author: author.trim(), rating, text: text.trim() });
    setSubmitting(false);
  }

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Name</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: errors.author ? errorColor : borderColor },
          ]}
          value={author}
          onChangeText={setAuthor}
          accessibilityLabel="Name"
          placeholder="Your name"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="words"
        />
        <FieldError message={errors.author} color={errorColor} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Rating</ThemedText>
        <StarPicker
          rating={rating}
          onChange={setRating}
          color={theme.text}
          borderColor={errors.rating ? errorColor : borderColor}
        />
        <FieldError message={errors.rating} color={errorColor} />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold">Review</ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.multiline,
            { color: theme.text, borderColor: errors.text ? errorColor : borderColor },
          ]}
          value={text}
          onChangeText={setText}
          accessibilityLabel="Review"
          placeholder="What did you think?"
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
        />
        <ThemedText type="small" style={[styles.counter, { color: counterColor }]}>
          {`${textLength}/500`}
        </ThemedText>
        <FieldError message={errors.text} color={errorColor} />
      </View>

      <View style={styles.buttons}>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="smallBold">Cancel</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityState={{ disabled: submitting }}
          style={({ pressed }) => [
            styles.button,
            styles.submitButton,
            (pressed || submitting) && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={styles.submitText}>
            {submitting ? 'Posting…' : 'Post review'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    lineHeight: 20,
  },
  multiline: {
    minHeight: 100,
  },
  starRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
  },
  starButton: {
    flex: 1,
    paddingVertical: Spacing.one,
    alignItems: 'center',
  },
  star: {
    fontSize: 24,
    lineHeight: 32,
  },
  counter: {
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  button: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  submitButton: {
    backgroundColor: '#208AEF',
  },
  submitText: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.7,
  },
});
