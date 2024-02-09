import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Scan from "../components/Scan";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { NotContext } from "../contexts/NotificationContext";

const New = ({ socket, navigation, hasPermission, route }) => {
  const { category, catData } = route.params;
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);
  const { setCart } = useContext(NotContext);

  // console.log(category, catData);

  const axiosPrivate = useAxiosPrivate();

  const [scanData, setScanData] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [q, setQ] = useState(1);
  const [data, setData] = useState([]);

  console.log(scanData, quantity, q);

  const handleChildData = (dataFromChild) => {
    setScanData(dataFromChild?.data);
    setQuantity(dataFromChild?.quantity);
    setQ(dataFromChild?.q);
    setData(dataFromChild?.result);
  };

  // const handleupdateStore = async () => {
  //   try {
  //     setLoading(true);
  //     if (usersData?.roles?.StockRes?.length > 0) {
  //       const bodyData = {
  //         ID: data?.ID,
  //         Status: data?.Status,
  //         Code: scanData,
  //         Quantity: data?.Quantity,
  //         q: q,
  //         stockQuantity: Number(data?.Quantity) + Number(q),
  //         SabCode: data?.SabCode,
  //         Unit: data?.Unit,
  //         Description: data?.Description,
  //         Detail: data?.Detail,
  //         Position: data?.Position,
  //         catData: catData,
  //         UserName: usersData.username,
  //         ProfileImg: usersData.img,
  //         Item: usersData.roles.StockRes[0],
  //         ItemFrom: category,
  //         ItemTo: usersData.roles.StockRes[0],
  //         ItemStatus: "New",
  //         title: `New Item`,
  //         body: `${scanData} has been added to store ${usersData.roles.StockRes[0]}`,
  //       };
  //       const result = await AsyncStorage.getItem("cart");

  //       let cartData = result ? JSON.parse(result) : [];
  //       cartData.push({ ...bodyData, id: cartData.length + 1 });
  //       await AsyncStorage.setItem("cart", JSON.stringify(cartData));
  //       setCart(cartData);
  //       setLoading(false);
  //       showToast(
  //         `success`,
  //         lang === "ar"
  //           ? Ar.SuccessfullySparepartAdded
  //           : En.SuccessfullySparepartAdded
  //       );
  //       navigation.goBack();
  //     } else {
  //       setLoading(false);
  //       alert(`You are not allowed to Exchange`);
  //     }
  //   } catch (err) {
  //     showToast(
  //       `error`,
  //       err?.response?.data?.message
  //         ? err?.response?.data?.message
  //         : err?.message
  //     );
  //     setLoading(false);
  //   }
  // };
  const handleupdateStore = async () => {
    try {
      setLoading(true);
      if (usersData?.roles?.StockRes?.length > 0) {
        const bodyData = {
          ID: data?.ID,
          Status: data?.Status,
          Code: scanData,
          Quantity: data?.Quantity,
          q: q,
          SabCode: data?.SabCode,
          Unit: data?.Unit,
          Description: data?.Description,
          Detail: data?.Detail,
          Position: data?.Position,
          catData: catData,
          UserName: usersData.username,
          ProfileImg: usersData.img,
          Item: usersData.roles.StockRes[0],
          ItemFrom: category,
          ItemTo: usersData.roles.StockRes[0],
          ItemStatus: "New",
          title: `New Item`,
          body: `${scanData} has been added to store ${usersData.roles.StockRes[0]}`,
        };
        const url = `/api/v1/stocksNewItem`;
        await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify(bodyData),
        });
        setLoading(false);
        showToast(
          `success`,
          lang === "ar"
            ? Ar.SuccessfullySparepartAdded
            : En.SuccessfullySparepartAdded
        );
        navigation.goBack();
      } else {
        setLoading(false);
        alert(`You are not allowed to Exchange`);
      }
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
      <Navbar navigation={navigation} />
      {loading && <PageLoading />}
      <Scan
        onChildData={handleChildData}
        hasPermission={hasPermission}
        check={true}
        setLoading={setLoading}
      />
      {scanData !== "" && (
        <TouchableOpacity
          disabled={
            !quantity ||
            quantity === "" ||
            !q ||
            q === "" ||
            !data?.Position ||
            data?.Position === ""
              ? true
              : false
          }
          style={[
            styles.btn1,
            {
              opacity:
                !quantity ||
                quantity === "" ||
                !q ||
                q === "" ||
                !data?.Position ||
                data?.Position === ""
                  ? 0.7
                  : 1,
            },
          ]}
          onPress={handleupdateStore}
        >
          <Text style={{ color: colors.white, fontSize: 16 }}>
            {lang === "ar" ? Ar.Confirm : En.Confirm}
          </Text>
        </TouchableOpacity>
      )}
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"SelectScan"}
      />
      {/* <Toast /> */}
    </View>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn1: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    backgroundColor: colors.logo,
    padding: 8,
    borderRadius: 8,
    marginBottom: 55,
  },
});
