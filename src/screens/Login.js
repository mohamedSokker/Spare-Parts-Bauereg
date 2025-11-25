import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { Icon } from "react-native-elements";
import Toast from "react-native-toast-message";

import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const Login = ({ navigation, socket }) => {
  const [loading, setLoading] = useState(false);

  const { setToken, setUsersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const username = useRef(undefined);
  const password = useRef();

  const axiosPrivate = useAxiosPrivate();

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const url = `/sparePartLogin`;
      const result = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({
          username: username.current.value,
          password: password.current.value,
        }),
      });
      console.log(result?.data);
      AsyncStorage.getItem("token", async (err, res) => {
        if (err)
          showToast(
            `error`,
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.message
          );
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then(async (token) => {
              const url = `/api/v1/manageUsers/${result?.data?.user?.id}`;
              await axiosPrivate(url, {
                method: "PUT",
                data: JSON.stringify({ Token: token }),
              });
            })
            .catch((err) =>
              showToast(
                `error`,
                err?.response?.data?.message
                  ? err?.response?.data?.message
                  : err?.message
              )
            );
        } else {
          showToast(`error`, `Failed token status ${authStatus}`);
          console.log(`Failed token status ${authStatus}`);
        }
        if (!res) {
          AsyncStorage.setItem("token", result?.data?.token);
          AsyncStorage.setItem("user", JSON.stringify(result?.data?.user));
          setToken(result?.data?.token);
          setUsersData(result?.data?.user);
          // console.log(socket.connected);
          // if (!socket.connected) socket.connect();
          setLoading(false);
          showToast(
            `success`,
            lang === "ar" ? Ar.Successfullylogin : En.Successfullylogin
          );
        }
      });
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingVertical: 25,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.viewLogo}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.logo}
          />
        </View>
        <View style={styles.formFields}>
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: lang === "ar" ? "flex-end" : "flex-start",
            }}
          >
            <Text style={{ color: "white" }}>
              {lang === "ar" ? Ar.Username : En.Username}
            </Text>
          </View>

          <LinearGradient
            colors={["rgb(0,74,128)", "transparent"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: "90%",
              backgroundColor: "#022D4E",
              borderRadius: 5,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: 35,
              position: "relative",
            }}
          >
            <View style={{ position: "absolute", left: 10 }}>
              <Icon
                type="material-community"
                name="account"
                size={20}
                color="rgb(0,74,128)"
              />
            </View>

            <TextInput
              ref={username}
              onChangeText={(e) => (username.current.value = e)}
              style={styles.textInput}
              // placeholder={lang === "ar" ? Ar.Username : En.Username}
              placeholderTextColor="white"
            />
          </LinearGradient>
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: lang === "ar" ? "flex-end" : "flex-start",
            }}
          >
            <Text style={{ color: "white" }}>
              {lang === "ar" ? Ar.Password : En.Password}
            </Text>
          </View>
          <LinearGradient
            colors={["rgb(0,74,128)", "transparent"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: "90%",
              backgroundColor: "#022D4E",
              borderRadius: 5,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: 35,
              position: "relative",
            }}
          >
            <Text></Text>
            <View style={{ position: "absolute", left: 10 }}>
              <Icon
                type="material-community"
                name="lock"
                size={20}
                color="rgb(0,74,128)"
              />
            </View>
            <TextInput
              ref={password}
              secureTextEntry={true}
              onChangeText={(e) => (password.current.value = e)}
              style={styles.textInput}
              // placeholder={lang === "ar" ? Ar.Password : En.Password}
              placeholderTextColor="white"
            />
          </LinearGradient>
        </View>
        <View style={styles.viewSignIn}>
          <LinearGradient
            colors={["rgb(0,74,128)", "transparent"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: "90%",
              backgroundColor: "#022D4E",
              borderRadius: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
              <Text
                style={{
                  color: "orange",
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {lang === "ar" ? Ar.SignIn : En.SignIn}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      {loading && <PageLoading />}
      <Toast />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(0,74,128)",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    height: 100,
    width: 100,
  },
  viewLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flexGrow: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 2,
    paddingLeft: 8,
    color: "white",
  },
  formFields: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  viewSignIn: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signIn: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 40,
  },
});
