// App.js

import 'react-native-gesture-handler';
import React, {useEffect,useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';


// Import your screens
import LoginScreen from './src/components/LoginScreen';
import Dashboard from './src/components/Dashboard';
import VenueScreen from './src/components/VenueScreen';
import VenueDetailScreen from './src/components/VenueDetailsScreen';
import BillDetailsScreen from './src/components/BillDetailsScreen';
import Popup from './src/components/Popup';
import {  PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Create a Stack Navigator
const Stack = createStackNavigator();
const notificationSound = new Sound('noti.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Failed to load the sound s', error);
    return;
  }
});





function App() {

  const [popupData, setPopupData] = useState(null);
  const [isVisible, setIsVisible] = React.useState(false); // State to manage visibility

    const handleClose = () => {
      setIsVisible(false); // Update visibility state to hide the modal
    };


  const GetFCMToken = async () => {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log(fcmToken);
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const NotificationListner = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('opened app', remoteMessage);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('background', remoteMessage);
      setPopupData(remoteMessage);
      setIsVisible(true);
    });

    messaging().getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage, 'notification received');
      });

    messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        channelId: 'fcm_fallback_notification_channel',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
      });
      console.log(remoteMessage, 'forground');
      setPopupData(remoteMessage);
      setIsVisible(true)
      notificationSound.play(success => {
        if (!success) {
          console.log('Failed to play the sound');
        }
        else {
          console.log('Sound played successfully');
        }
      });
    });
  };


  const requestUserPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          GetFCMToken();
        } else {
          ToastAndroid.show('Please grant permission for notifications',ToastAndroid.BOTTOM);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    } 

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      GetFCMToken();
    }
  };

  useEffect(() => {
    requestUserPermission();
    NotificationListner();
  }, []);
  return (
    <>
  
    <NavigationContainer>
    
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard'}}
        />
        <Stack.Screen
          name="Venue"
          component={VenueScreen}
          options={{title: 'Venues'}}
        />
        <Stack.Screen
          name="VenueDetails"
          component={VenueDetailScreen}
          options={{title: 'Venues Bills'}}
        />
        <Stack.Screen name="BillDetails" component={BillDetailsScreen}  options={{title: 'Bill Detail'}}/>
        
        
      </Stack.Navigator>
      {isVisible && (
        <Popup
          title={popupData.notification.title}
          body={popupData.notification.body}
         onClose={handleClose}
  
        />
      )}
     

    </NavigationContainer>
   
 
    </>
  );
}

export default App;
