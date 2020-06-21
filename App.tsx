import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  StatusBar,
  Platform,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';

const App: React.FC = () => {
  const alertWithNotification = useCallback(() => {
    try {
      messaging().onMessage((message) => {
        Alert.alert('Received', JSON.stringify(message));
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }, []);

  const requestUserPermission = useCallback(async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }, []);

  const firebasePushSetup = useCallback(async () => {
    if (Platform.OS === 'android') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    console.log('TOKEN =', token);

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message Data:', remoteMessage.data);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestUserPermission();
    }
    firebasePushSetup();
    alertWithNotification();
  }, [alertWithNotification, firebasePushSetup, requestUserPermission]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text>React Native Push Notification</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
