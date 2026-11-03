import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Cuisine } from '@/types/restaurant';

type Props = {
  search: string;
  onSearchChange: (search: string) => void;
  cuisine: Cuisine | null;
  onCuisineChange: (cuisine: Cuisine | null) => void;
  resultCount: number;
};

// TODO(Emiliano, Sprint 1): search bar. Sprint 2: cuisine chips
export function SearchFilters(props: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        Search goes here
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
});
