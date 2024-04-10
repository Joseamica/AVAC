import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('hammad');
  const [password, setPassword] = useState('hammad');

  const handleLogin = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');

      const response = await axios.post(
        'https://avo-pwa.onrender.com/v1/auth/login',
        {
          username: username,
          password: password,
          fcmToken: fcmToken || '',
        },
      );

      console.log('Login successful:', response.data);

      // Navigate to the Dashboard screen and pass userId as parameter
      navigation.navigate('Dashboard', {userId: response.data.user.id});
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again.',
      );
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        placeholder="Username"
        onChangeText={text => setUsername(text)}
        value={username}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          width: 200,
          color: 'black',
        }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          width: 200,
          color: 'black',
        }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
