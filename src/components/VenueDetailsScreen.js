import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import Sound from 'react-native-sound';
import Popup from './Popup';

const socket = io('https://avo-pwa.onrender.com');
const notificationSound = new Sound('noti.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Failed to load the sound s', error);
    return;
  }
});

const VenueDetailsScreen = ({route, navigation}) => {
  const [bills, setBills] = useState([]);

  const venueId = route.params.venueId;

  useEffect(() => {
    // Fetch initial bills data
    fetchBills();
    
  }, []);

  

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        `https://avo-pwa.onrender.com/v1/dashboard/${venueId}/get-bills`,
      );
      console.log('Bills:', response.data);

      setBills(response.data);
      
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const renderBillItem = ({item}) => (
    <TouchableOpacity
      style={styles.billItem}
      onPress={() =>
        navigation.navigate('BillDetails', {
          venueId: route.params.venueId,
          billId: item.id,
          tableNumber: item.tableNumber,
        })
      }>
      <Text style={styles.billText}>Table Number: {item.tableNumber}</Text>
      <Text style={styles.billText}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Bills</Text>
        <FlatList
          data={bills}
          renderItem={renderBillItem}
          keyExtractor={item => item.id}
        />
      </View>
      {/* {showNotification && <Popup payment={newPayment} onClose={closeNotification} />} */}
    </>
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
  billItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
  billText: {
    fontSize: 16,
    color: 'black',
  },
});

export default VenueDetailsScreen;
