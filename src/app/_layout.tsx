import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { FavoritesProvider } from '@/context/FavoritesContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Discover' }} />
          <Stack.Screen name="restaurant/[id]" options={{ title: '' }} />
          <Stack.Screen name="add" options={{ title: 'Add Restaurant', presentation: 'modal' }} />
          <Stack.Screen name="edit/[id]" options={{ title: 'Edit Restaurant' }} />
          <Stack.Screen name="api-test" options={{ title: 'API Test' }} />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
