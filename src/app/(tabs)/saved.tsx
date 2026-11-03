import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

// TODO(Max, Sprint 2): show favorited restaurants
export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <ThemedText themeColor="textSecondary">Your saved restaurants will show up here.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
});
