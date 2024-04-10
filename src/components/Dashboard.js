// Dashboard.js
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import axios from 'axios';
import Popup from './Popup';

const Dashboard = ({navigation, route}) => {
  const [chains, setChains] = useState([]);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const userId = route.params.userId;
        const response = await axios.get(
          `https://avo-pwa.onrender.com/v1/dashboard/get-chain?userId=${userId}`,
        );
        setChains([response.data.chain]);
      } catch (error) {
        console.error('Error fetching chains:', error);
      }
    };

    fetchChains();
  }, []);

  // Close popup when bill update is triggered

  const handleVenuePress = venues => {
    navigation.navigate('Venue', {venues: venues});
  };

  const renderChainItem = ({item}) => (
    <TouchableOpacity onPress={() => handleVenuePress(item.venues)}>
      <View style={styles.chainItem}>
        <Text style={styles.chainName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chains</Text>
      <FlatList
        data={chains}
        renderItem={renderChainItem}
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
  },
  chainItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chainName: {
    fontSize: 16,
  },
});

export default Dashboard;
