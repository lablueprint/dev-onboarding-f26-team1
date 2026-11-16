import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { RestaurantList } from '@/components/RestaurantList';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CUISINES, type Cuisine, type Restaurant } from '@/types/restaurant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chipScroller: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
  },
  message: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});

export default function ApiTestScreen() {
  const theme = useTheme();
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);
  const [data, setData] = useState<Restaurant[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  // Bumping it refetches even when the cuisine is unchanged
  const [attempt, setAttempt] = useState(0);

  const load = (next: Cuisine | null) => {
    setError(undefined);
    setLoading(true);
    setCuisine(next);
    setAttempt((n) => n + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const query = cuisine ? `?cuisine=${encodeURIComponent(cuisine)}` : '';

    (async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/restaurants${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setError(`HTTP ${response.status}`);
          return;
        }
        setData(await response.json());
      } catch (err) {
        if (!controller.signal.aborted) setError(`Fetch failed: ${err}`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [cuisine, attempt]);

  const renderContent = () => {
    if (loading) {
      return <ThemedText style={styles.message}>Loading...</ThemedText>;
    }
    if (error) {
      return (
        <View style={styles.message}>
          <ThemedText>{error}</ThemedText>
          <Pressable
            style={[styles.retryButton, { backgroundColor: theme.backgroundSelected }]}
            onPress={() => load(cuisine)}
            accessibilityRole="button"
          >
            <ThemedText type="smallBold">Retry</ThemedText>
          </Pressable>
        </View>
      );
    }
    if (!data || data.length === 0) {
      return <ThemedText style={styles.message}>No restaurants found</ThemedText>;
    }
    return <RestaurantList restaurants={data} />;
  };

  return (
    <View style={styles.container}>
      {/* SDK 58 makes the iOS 26 header transparent, putting this non-scrolling screen under it */}
      <Stack.Screen options={{ headerTransparent: false }} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroller}
        contentContainerStyle={styles.chips}
      >
        {[null, ...CUISINES].map((option) => {
          const selected = option === cuisine;
          return (
            <Pressable
              key={option ?? 'all'}
              style={[
                styles.chip,
                { backgroundColor: selected ? theme.text : theme.backgroundSelected },
              ]}
              onPress={() => load(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <ThemedText type="smallBold" themeColor={selected ? 'background' : 'text'}>
                {option ?? 'All'}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
      {renderContent()}
    </View>
  );
}
