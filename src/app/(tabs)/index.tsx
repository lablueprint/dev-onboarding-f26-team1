import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RestaurantList } from '@/components/RestaurantList';
import { SearchFilters } from '@/components/SearchFilters';
import { useRestaurants } from '@/hooks/useRestaurants';
import type { Cuisine } from '@/types/restaurant';
import { filterRestaurants } from '@/utils/filter';

// This screen owns the search/filter state and passes it down.
// Please check with the lead before editing this file.
export default function DiscoverScreen() {
  const { restaurants, loading, refetch } = useRestaurants();
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState<Cuisine | null>(null);

  const visible = filterRestaurants(restaurants, { search, cuisine });

  return (
    <View style={styles.container}>
      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        cuisine={cuisine}
        onCuisineChange={setCuisine}
        resultCount={visible.length}
      />
      <RestaurantList restaurants={visible} refreshing={loading} onRefresh={refetch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
