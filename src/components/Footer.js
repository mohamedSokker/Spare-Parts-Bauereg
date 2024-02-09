import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import IconHeader from "./IconHeader";

import { NotContext } from "../contexts/NotificationContext";
import useFetch from "../hooks/useFetch";
import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const Footer = ({ navigation, socket, token, usersData, initial }) => {
  const { setUpdateNot, updateNot } = useContext(NotContext);
  const { lang } = useContext(LangContext);

  const [notify, setNotify] = useState({ count: 0, message: "", img: "" });

  // useEffect(() => {
  //   const socketUpdateNot = () => {
  //     setUpdateNot((prev) => !prev);
  //   };

  //   socket.on("updateNotification", socketUpdateNot);

  //   return () => {
  //     socket.off("updateNotification", socketUpdateNot);
  //   };
  // }, [token, socket]);

  // const url = `/api/v1/AppNotification?fullquery=
  //         SELECT TOP 50 * FROM AppNotification WHERE ToUser = '${usersData?.username}'
  //         AND Seen = 'false' ORDER BY ID DESC`;
  // const { data } = useFetch(url, "GET", token, [updateNot, usersData]);

  // useEffect(() => {
  //   setNotify((prev) => ({ ...prev, count: data.length }));
  // }, [data]);
  return (
    <View style={[styles.header, {}]}>
      <IconHeader
        name={`home-outline`}
        type={`ionicon`}
        pageName={lang === "ar" ? Ar.Home : En.Home}
        size={30}
        customFn={() => {
          navigation.navigate("Timeline");
        }}
        style={{
          borderTopWidth: 2,
          borderTopColor: initial === "Timeline" ? colors.logo : colors.white,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <IconHeader
        name={`cart-outline`}
        type={`ionicon`}
        disabled={
          usersData?.roles?.StockRes && usersData?.roles?.StockRes[0] === "Main"
            ? true
            : false
        }
        pageName={lang === "ar" ? Ar.PlaceOrder : En.PlaceOrder}
        size={30}
        customFn={() => {
          navigation.navigate("PlaceOrder");
        }}
        style={{
          borderTopWidth: 2,
          borderTopColor: initial === "PlaceOrder" ? colors.logo : colors.white,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          opacity:
            usersData?.roles?.StockRes &&
            usersData?.roles?.StockRes[0] === "Main"
              ? 0.5
              : 1,
        }}
      />
      <IconHeader
        name={`add-circle-outline`}
        type={`ionicon`}
        pageName={``}
        size={40}
        customFn={() => {
          navigation.navigate("AddItem");
        }}
        style={{
          borderTopWidth: 2,
          borderTopColor: initial === "AddItem" ? colors.logo : colors.white,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <IconHeader
        name={`scan-outline`}
        type={`ionicon`}
        disabled={
          usersData?.roles?.StockRes && usersData?.roles?.StockRes[0].length > 0
            ? false
            : true
        }
        pageName={lang === "ar" ? Ar.ScanItem : En.ScanItem}
        size={30}
        customFn={() => {
          navigation.navigate("SelectScan");
        }}
        style={{
          borderTopWidth: 2,
          borderTopColor: initial === "ScanItem" ? colors.logo : colors.white,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          opacity:
            usersData?.roles?.StockRes &&
            usersData?.roles?.StockRes[0].length > 0
              ? 1
              : 0.5,
        }}
      />
      <IconHeader
        name={`menu-outline`}
        type={`ionicon`}
        pageName={lang === "ar" ? Ar.Menu : En.Menu}
        size={30}
        customFn={() => {
          navigation.navigate("Sidebar");
        }}
        style={{
          borderTopWidth: 2,
          borderTopColor: initial === "Sidebar" ? colors.logo : colors.white,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: colors.white,
    height: 50,
    borderTopWidth: 1,
    borderColor: colors.grey4,
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    position: "absolute",
    bottom: 0,
  },
});
