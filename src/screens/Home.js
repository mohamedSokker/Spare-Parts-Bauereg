import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  BackHandler,
  Linking,
} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import Toast from "react-native-toast-message";

import { parameters } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import { MainStack } from "../navigations/MainStack";

const Home = ({ socket, hasPermission }) => {
  const { token, usersData } = useContext(LoginContext);
  const [userID, setUserID] = useState(null);

  const updateLink =
    "https://play.google.com/store/apps/details?id=com.mohamed_sokker.BaueregMobile";

  const handleAlert = () => {
    BackHandler.exitApp();
    Alert.alert(
      "Update Available",
      "You Must Update If you Want to proceed",
      [
        { text: "Cancel", onPress: () => handleAlert() },
        { text: "Update", onPress: () => handleUpdate() },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = () => {
    BackHandler.exitApp();
    Alert.alert(
      "Update Available",
      "You Must Update If you Want to proceed",
      [
        { text: "Cancel", onPress: () => handleAlert() },
        { text: "Update", onPress: () => handleUpdate() },
      ],
      { cancelable: false }
    );
    Linking.openURL(updateLink);
  };

  const getUserId = (data) => {
    const appVersion = 2;
    if (appVersion !== data.sparePartAppVersion) {
      console.log(data);
      Alert.alert(
        "Update Available",
        "You Must Update If you Want to proceed",
        [
          { text: "Cancel", onPress: () => handleAlert() },
          { text: "Update", onPress: () => handleUpdate() },
        ],
        { cancelable: false }
      );
    }
    socket.emit("userName", usersData?.username);
    setUserID(data.id);
  };

  // useEffect(() => {
  //   socket.on("userID", getUserId);
  //   return () => {
  //     socket.off("userID", getUserId);
  //   };
  // }, []);

  useEffect(() => {
    if (usersData) {
      socket.on("userID", getUserId);
      if (!socket.connected) socket.connect();
    }
    return () => {
      socket.off("userID", getUserId);
    };
  }, [usersData]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {usersData && (
          <MainStack
            socket={socket}
            hasPermission={hasPermission}
            userID={userID}
            usersData={usersData}
          />
        )}

        <Toast />
      </View>

      <StatusBar
        style="light"
        backgroundColor="rgb(0,74,128)"
        translucent={true}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: parameters.statusBarHeight,
    position: "relative",
  },

  body: {
    flex: 1,
  },
});
