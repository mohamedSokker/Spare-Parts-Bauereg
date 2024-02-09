import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { BarCodeScanner } from "expo-barcode-scanner";

import { LoginContextProvider } from "./src/contexts/LoginContext";
import { HomeStack } from "./src/navigations/StackNavigation";
import { NotContextProvider } from "./src/contexts/NotificationContext";
import { socket } from "./src/socket/socket";
import { StocksContextProvider } from "./src/contexts/StocksContext";
import { registerForPushNotificationsAsync } from "./src/functions/registerPushNot";
import { LangContextProvider } from "./src/contexts/LanguageContext";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    const register = async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.log(error.message);
      }
    };
    register();
  }, []);

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => console.log(token));
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      const notification = {
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        data: remoteMessage?.data,
      };

      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    });

    const handlePushNotification = async (remoteMessage) => {
      const notification = {
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        data: remoteMessage?.data,
      };

      await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null,
      });
    };

    const unsubscribe = messaging().onMessage(handlePushNotification);

    return unsubscribe;
  }, []);

  return (
    <LangContextProvider>
      <LoginContextProvider>
        <NotContextProvider>
          <StocksContextProvider>
            <NavigationContainer>
              <HomeStack socket={socket} hasPermission={hasPermission} />
            </NavigationContainer>
          </StocksContextProvider>
        </NotContextProvider>
      </LoginContextProvider>
    </LangContextProvider>
  );
}

const styles = StyleSheet.create({});
