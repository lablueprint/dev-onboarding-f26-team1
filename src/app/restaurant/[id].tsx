import { Link, useLocalSearchParams , Stack} from 'expo-router';
import { StyleSheet, ScrollView, ActivityIndicator} from 'react-native';

import { ReviewsSection} from '@/components/ReviewsSection';
import { RestaurantDetails } from '@/components/RestaurantDetails';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRestaurant } from '@/hooks/useRestaurant';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { restaurant , loading } = useRestaurant(id);

  if (loading === true){

    return (
    <ActivityIndicator></ActivityIndicator>
    )

  }

  else {

    if (restaurant === null) {
      return (
        <ThemedText>Restaurant not found</ThemedText>
      );
  
    }


      return (
        <ScrollView contentContainerStyle={styles.contentContainer}>

          <Stack.Screen options={{ title: restaurant.name }} />

          <RestaurantDetails restaurant={restaurant}></RestaurantDetails>
    
          <Link href={`/edit/${id}`} style={styles.editLink}>
            <ThemedText type="linkPrimary">Edit</ThemedText>
          </Link>
    
          <ReviewsSection restaurantId={id} />
        </ScrollView>
      );


    

  }


}

const styles = StyleSheet.create({
  contentContainer: {
    padding : Spacing.three
  },

  editLink: {
    marginTop: Spacing.two,
  },
});
