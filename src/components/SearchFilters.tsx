import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
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
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  //Writing the search bar and button into the same view tag so that they appear in the same line when styled
  return (
    <View style={styles.container}>
      <View style={[styles.bar, isFocused && styles.barFocused]}>
        <ThemedText>🔍</ThemedText>
        <TextInput 
          value={props.search} 
          onChangeText={props.onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          autoCapitalize="none"
          style={[styles.input, { color: theme.text }]}
        />
        { props.search !== "" && (
          <Pressable 
            onPress={() => props.onSearchChange('')} 
            style={styles.clearButton} 
            hitSlop={10}
          > 
            <ThemedText themeColor="textSecondary" >✕</ThemedText>
          </Pressable>
        )}
      </View>
      { props.search !== "" && 
      <ThemedText type="small" themeColor="textSecondary" style={styles.count}>{
          props.resultCount === 0 ? "No restaurants" :( // Result count 
          props.resultCount === 1 ? "1 restaurant" :    // each JSX tag corresponds to the condition right before it
          `${props.resultCount} restaurants`)
          }</ThemedText> 
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  bar: { //writing this so that the x button is in the right side of the search bar
  flexDirection: 'row',     //put children side by side
  alignItems: 'center',     //center them vertically
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 999,
  paddingHorizontal: 16,
  },
  barFocused: {
      borderColor: '#007AFF',
  },
  input: {
    flex: 1,              // pushes the x button to the right
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  clearButton: {
    padding: 4,
  },
  count: {
  marginTop: Spacing.two,       // gap below the bar
  paddingHorizontal: Spacing.three, // lines the text up with the inside of the bar
  },
});
