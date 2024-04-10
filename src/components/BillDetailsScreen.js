// BillDetailsScreen.js
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';

import socketIOClient from 'socket.io-client';

const BillDetailsScreen = ({route}) => {
  const [billDetails, setBillDetails] = useState(null);

  const socket = socketIOClient('https://avo-pwa.onrender.com');
  const {venueId, billId, tableNumber} = route.params;

  useEffect(() => {
    fetchBillDetails();

    const roomInfo = {venueId: venueId, table: tableNumber};
    socket.on('connect', () => {
      console.log('Connected to server...');
    });
    socket.emit('joinRoom', roomInfo);

    socket.on('updateOrder', updatedBill => {
      console.log('Received updateOrder event:', updatedBill);
      setBillDetails(updatedBill);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      // Clean up event listeners
      socket.off('connect');
      socket.off('updateOrder');
      socket.off('disconnect');
    };
  }, [venueId, billId, tableNumber]);

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(
        `https://avo-pwa.onrender.com/v1/dashboard/${venueId}/${billId}`,
      );
      setBillDetails(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  return (
    <View style={styles.container}>
      {billDetails ? (
        <View>
          <Text>Table No: {billDetails.tableNumber}</Text>
          <Text>Total Amount: ${billDetails.total}</Text>
          <Text>Payments Made:</Text>
          <FlatList
            data={billDetails.payments}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View>
                <Text>
                  Date & Time: {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Text>Amount: ${item.amount}</Text>
                <Text>Payment Method: {item.method}</Text>
                {/* Add more payment details here if needed */}
              </View>
            )}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
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
});

export default BillDetailsScreen;
