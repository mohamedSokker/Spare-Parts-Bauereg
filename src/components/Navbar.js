import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import { showToast } from "../functions/showToast";
import { NotContext } from "../contexts/NotificationContext";

const Navbar = ({ navigation, initial }) => {
  // const { cart, setCart } = useContext(NotContext);

  // useEffect(() => {
  //   const getCartData = async () => {
  //     try {
  //       const cartData = await AsyncStorage.getItem("cart");
  //       console.log(cartData);
  //       if (cartData) setCart(JSON.parse(cartData));
  //     } catch (err) {
  //       showToast(
  //         `error`,
  //         err?.response?.data?.message
  //           ? err?.response?.data?.message
  //           : err?.message
  //       );
  //     }
  //   };
  //   getCartData();
  // }, []);
  console.log(BASE_URL);
  const { usersData } = useContext(LoginContext);
  return (
    <View style={styles.view1}>
      <View style={styles.view2}>
        <Image source={require("../../assets/logo.jpg")} style={styles.logo} />
      </View>
      <View style={styles.view3}>
        <TouchableOpacity onPress={() => navigation.navigate("ScanItem")}>
          <Icon
            type={`ionicon`}
            name={initial === `ScanItem` ? `scan` : `scan-outline`}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Icon
            type={`ionicon`}
            name={initial === `Search` ? `search` : `search-outline`}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Icon
            type={`ionicon`}
            name={
              initial === `Notifications`
                ? "notifications"
                : `notifications-outline`
            }
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={{ position: "relative" }}
        >
          <Icon
            type={`ionicon`}
            name={initial === `Cart` ? `cart` : `cart-outline`}
            color={colors.white}
            size={25}
          />
          {cart.length > 0 && (
            <View
              style={{
                height: 15,
                // padding: 3,
                aspectRatio: 3 / 2,
                borderRadius: 1000,
                position: "absolute",
                backgroundColor: "red",
                top: -6,
                right: -10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  height: 15,
                  fontSize: 10,
                  aspectRatio: 3 / 2,
                  textAlign: "center",
                }}
              >
                {cart.length}
              </Text>
            </View>
          )}
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            style={styles.img}
            source={{
              uri: `${BASE_URL}/${usersData?.img}`,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  view1: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.logo,
  },
  view2: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    paddingHorizontal: 15,
  },
  txt1: {
    color: colors.white,
    fontWeight: "900",
  },
  view3: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  img: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 40,
    resizeMode: "contain",
  },
});
