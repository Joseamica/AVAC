import React from 'react';
import {Modal, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Popup = ({title, body, onClose}) => {
  const navigation = useNavigation();

  const navigateToVenueDetails = () => {
    onClose();
    //  navigation.navigate('VenueDetails');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose} // Call the onClose function passed as props when modal is closed
    >
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{body}</Text>

          <View style={styles.buttonContainer}>
            {/* Show Bills Button */}
            <TouchableOpacity
              onPress={navigateToVenueDetails}
              style={[styles.button, {backgroundColor: 'green'}]}>
              <Text style={styles.buttonText}>Show Bills</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, {backgroundColor: 'red'}]}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Popup;
