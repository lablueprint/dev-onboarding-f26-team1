import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ReviewCard } from '@/components/ReviewCard';
import { ReviewForm, type ReviewFormValues } from '@/components/ReviewForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useReviews, type ReviewItem } from '@/hooks/useReviews';
import { useTheme } from '@/hooks/use-theme';
import type { Review } from '@/types/review';

type Props = {
  restaurantId: string;
};

type SortOrder = 'newest' | 'highest';

const INITIAL_VISIBLE = 3;
const STAR_LEVELS = [5, 4, 3, 2, 1];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest', label: 'Highest rated' },
];

const PRIMARY_BLUE = '#208AEF';

function sortReviews<T extends Review>(reviews: T[], order: SortOrder): T[] {
  const byNewest = (a: T, b: T) => b.createdAt.localeCompare(a.createdAt);

  if (order === 'highest') {
    return [...reviews].sort((a, b) => b.rating - a.rating || byNewest(a, b));
  }
  return [...reviews].sort(byNewest);
}

export function ReviewsSection({ restaurantId }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();

  const { reviews, addReview, deleteReview } = useReviews(restaurantId);

  async function handleSubmit(values: ReviewFormValues) {
    await addReview(values);
    setSortOrder('newest');
    setShowForm(false);
  }

  function confirmDelete(review: ReviewItem) {
    Alert.alert('Delete review?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReview(review.id) },
    ]);
  }

  const header = (
    <View style={styles.headerRow}>
      <ThemedText type="smallBold">
        {reviews.length > 0 ? `Reviews (${reviews.length})` : 'Reviews'}
      </ThemedText>
      {!showForm && (
        <Pressable
          onPress={() => setShowForm(true)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.writeButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.writeButtonText}>
            + Write a review
          </ThemedText>
        </Pressable>
      )}
    </View>
  );

  const form = showForm && (
    <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
  );

  if (reviews.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        {form}
        <ThemedView type="backgroundElement" style={styles.empty}>
          <ThemedText type="small" themeColor="textSecondary">
            No reviews yet. Be the first!
          </ThemedText>
        </ThemedView>
      </View>
    );
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const breakdown = STAR_LEVELS.map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    return { stars, count, percent: (count / reviews.length) * 100 };
  });

  const sorted = sortReviews(reviews, sortOrder);
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hiddenCount = reviews.length - INITIAL_VISIBLE;

  return (
    <View style={styles.container}>
      {header}
      {form}

      <ThemedView type="backgroundElement" style={styles.summary}>
        <View style={styles.average}>
          <View style={styles.averageRow}>
            <ThemedText type="subtitle">{average.toFixed(1)}</ThemedText>
            <ThemedText style={styles.averageStar}>★</ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            average
          </ThemedText>
        </View>

        <View style={styles.breakdown}>
          {breakdown.map(({ stars, count, percent }) => (
            <View
              key={stars}
              style={styles.breakdownRow}
              accessibilityLabel={`${stars} stars: ${count} ${count === 1 ? 'review' : 'reviews'}`}>
              <ThemedText type="small" style={styles.breakdownLabel}>
                {stars}★
              </ThemedText>
              <ThemedView type="backgroundSelected" style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${percent}%`, backgroundColor: theme.text }]}
                />
              </ThemedView>
              <ThemedText type="small" themeColor="textSecondary" style={styles.breakdownCount}>
                {count}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map(({ value, label }) => {
          const selected = sortOrder === value;
          return (
            <Pressable
              key={value}
              onPress={() => setSortOrder(value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView
                type={selected ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.button}>
                <ThemedText
                  type={selected ? 'smallBold' : 'small'}
                  themeColor={selected ? 'text' : 'textSecondary'}>
                  {label}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.list}>
        {visible.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onDelete={review.isOwn ? () => confirmDelete(review) : undefined}
          />
        ))}
      </View>

      {hiddenCount > 0 && (
        <Pressable
          onPress={() => setShowAll((value) => !value)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}>
          <ThemedView type="backgroundElement" style={styles.button}>
            <ThemedText type="small">
              {showAll ? 'Show less' : `See all ${reviews.length} reviews`}
            </ThemedText>
          </ThemedView>
        </Pressable>
      )}
    </View>
  );
}

const BAR_HEIGHT = Spacing.two;

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  writeButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  writeButtonText: {
    color: '#fff',
  },
  empty: {
    padding: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
  },
  average: {
    alignItems: 'center',
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  averageStar: {
    fontSize: 24,
    lineHeight: 32,
  },
  breakdown: {
    flex: 1,
    gap: Spacing.one,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  breakdownLabel: {
    width: Spacing.four,
  },
  barTrack: {
    flex: 1,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BAR_HEIGHT / 2,
  },
  breakdownCount: {
    width: Spacing.three,
    textAlign: 'right',
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  list: {
    gap: Spacing.three,
  },
  seeAll: {
    alignSelf: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
