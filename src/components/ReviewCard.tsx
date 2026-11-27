import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Review } from '@/types/review';
import { timeAgo } from '@/utils/date';

type Props = {
  review: Review;
  onDelete?: () => void;
};

const MAX_STARS = 5;
const AVATAR_SIZE = 40;
const DELETE_HIT_SLOP = Spacing.two;

export function ReviewCard({ review, onDelete }: Props) {
  const initial = review.author.charAt(0).toUpperCase();
  const stars = '★'.repeat(review.rating) + '☆'.repeat(MAX_STARS - review.rating);
  const date = timeAgo(review.createdAt);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedView type="backgroundSelected" style={styles.avatar}>
          <ThemedText type="smallBold">{initial}</ThemedText>
        </ThemedView>

        <View style={styles.meta}>
          <View style={styles.authorRow}>
            <ThemedText type="smallBold" numberOfLines={1} style={styles.author}>
              {review.author}
            </ThemedText>
            <View style={styles.dateRow}>
              <ThemedText type="small" themeColor="textSecondary">
                {date}
              </ThemedText>
              {onDelete && (
                <Pressable
                  onPress={onDelete}
                  hitSlop={DELETE_HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Delete your review"
                  style={({ pressed }) => pressed && styles.pressed}>
                  <ThemedText type="small">🗑️</ThemedText>
                </Pressable>
              )}
            </View>
          </View>
          <ThemedText type="small" accessibilityLabel={`${review.rating} out of ${MAX_STARS} stars`}>
            {stars}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small">{review.text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  author: {
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.5,
  },
});
