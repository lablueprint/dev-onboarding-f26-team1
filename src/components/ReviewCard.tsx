import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Review } from '@/types/review';
import { timeAgo } from '@/utils/date';

type Props = {
  review: Review;
};

const MAX_STARS = 5;
const AVATAR_SIZE = 40;

export function ReviewCard({ review }: Props) {
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
            <ThemedText type="small" themeColor="textSecondary">
              {date}
            </ThemedText>
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
});
