import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginContext } from "../contexts/LoginContext";
import { colors } from "../globals/styles";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LangContext } from "../contexts/LanguageContext";
import { Ar, En } from "../globals/language";

const Sidebar = ({ navigation, socket }) => {
  const { usersData, token, setToken, setUsersData } = useContext(LoginContext);
  const { setLang, lang } = useContext(LangContext);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View style={{ padding: 16, gap: 20, paddingBottom: 55 }}>
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 6,
            }}
            onPress={async () => {
              setLang("ar");
              await AsyncStorage.setItem("lang", "ar");
            }}
          >
            <Image
              source={require("../../assets/Ar.jpg")}
              style={{ width: 30, height: 20 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Ar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 6,
            }}
            onPress={async () => {
              setLang("en");
              await AsyncStorage.setItem("lang", "en");
            }}
          >
            <Image
              source={require("../../assets/En.png")}
              style={{ width: 30, height: 20 }}
            />
            <Text style={{ fontSize: 16, fontWeight: "600" }}>En</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "white",
            padding: 20,
            paddingVertical: 10,
            borderRadius: 6,
          }}
          onPress={() => navigation.navigate("AddWorkshop")}
        >
          <Image
            source={require("../../assets/Workshop.jpg")}
            style={{ width: 60, height: 40 }}
          />
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {lang === "ar" ? Ar.WorkShop : En.WorkShop}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 50,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.white,
              borderRadius: 10,
              gap: 15,
            }}
            onPress={async () => {
              try {
                AsyncStorage.removeItem("token");
                AsyncStorage.removeItem("user");
                setToken(null);
                setUsersData(null);
                socket.disconnect();
              } catch (error) {
                console.log(error.message);
              }
            }}
          >
            <Icon
              type="material-community"
              name="logout"
              size={25}
              color={colors.logo}
            />
            <Text style={{ justifyContent: "center", alignItems: "center" }}>
              {lang === "ar" ? Ar.SignOut : En.SignOut}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Sidebar"}
      />
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
  },
});
