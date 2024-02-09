import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../globals/styles";
import { getUserData } from "../functions/getUserData";
import { LoginContext } from "../contexts/LoginContext";
import { LangContext } from "../contexts/LanguageContext";

const Splash = ({ socket, navigation }) => {
  const { setToken, setUsersData, token, usersData, setIsLoading } =
    useContext(LoginContext);
  const { setLang } = useContext(LangContext);
  // console.log(token);
  // console.log(usersData);

  useEffect(() => {
    const getData = async () => {
      try {
        const lang = await AsyncStorage.getItem("lang");
        if (lang) setLang(lang);
        const userInfo = await getUserData();
        if (!userInfo) {
          setIsLoading(false);
          socket?.disconnect();
          return;
        }
        setToken(userInfo);
        if (token) {
          const userData = await AsyncStorage.getItem("user");
          setUsersData(JSON.parse(userData));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    getData();
  }, [token]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.jpg")}
        style={{ width: 50, height: 50 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "900", color: "orange" }}>
        Egypt
      </Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.logo,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
