import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

const VenueScreen = ({navigation, route}) => {
  const venues = route.params.venues;

  const handleVenuePress = venueId => {
    // Navigate to VenueDetailsScreen and pass venue ID
    navigation.navigate('VenueDetails', {venueId});
  };

  const renderVenueItem = ({item}) => (
    <TouchableOpacity onPress={() => handleVenuePress(item.id)}>
      <View style={styles.venueItem}>
        <Text style={styles.venueName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Venues</Text>
      <FlatList
        data={venues}
        renderItem={renderVenueItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  venueItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
  venueName: {
    fontSize: 16,
    color: 'black',
  },
});

export default VenueScreen;
