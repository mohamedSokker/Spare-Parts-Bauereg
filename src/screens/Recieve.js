import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Scan from "../components/Scan";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { NotContext } from "../contexts/NotificationContext";

const Recieve = ({ navigation, socket, hasPermission }) => {
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);
  const { setCart } = useContext(NotContext);

  const [scanData, setScanData] = useState("");
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [FromSelected, setFromSelected] = React.useState("");
  const [FromSelectedData, setFromSelectedData] = React.useState("");
  const [finshedSelected, setFinishedSelected] = React.useState(false);
  const [siteData, setSiteData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [quantity, setQuantity] = useState(null);
  const [q, setQ] = useState(1);
  const [data, setData] = useState([]);

  console.log(data);
  console.log(quantity);
  console.log(q);

  const axiosPrivate = useAxiosPrivate();

  const handleChildData = (dataFromChild) => {
    setScanData(dataFromChild?.data);
    setQuantity(dataFromChild?.quantity);
    setQ(dataFromChild?.q);
    setData(dataFromChild?.result);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const url = `/api/v1/sparePartGetStocksList`;
        const data = await axiosPrivate(url, { method: "GET" });
        const copiedData = [];
        data?.data?.map((site, i) => {
          copiedData.push({
            value: i,
            label: site,
          });
        });
        setSiteData(copiedData);
        setLoading(false);
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
    getData();
  }, []);

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
  //         UserName: usersData.username,
  //         ProfileImg: usersData.img,
  //         Item: usersData.roles.StockRes[0],
  //         ItemFrom: FromSelectedData,
  //         ItemTo: usersData.roles.StockRes[0],
  //         ItemStatus: "Recieve",
  //         title: `Item Recieved`,
  //         body: `${scanData} has been recieved from ${FromSelectedData} by ${usersData.roles.StockRes[0]}`,
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
  //           ? Ar.SuccessfullySparepartRecieved
  //           : En.SuccessfullySparepartRecieved
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
          UserName: usersData.username,
          ProfileImg: usersData.img,
          Item: usersData.roles.StockRes[0],
          ItemFrom: FromSelectedData,
          ItemTo: usersData.roles.StockRes[0],
          ItemStatus: "Recieve",
          title: `Item Recieved`,
          body: `${scanData} has been recieved from ${FromSelectedData} by ${usersData.roles.StockRes[0]}`,
        };
        const url = `/api/v1/stocksRecieve`;
        await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify(bodyData),
        });
        setLoading(false);
        showToast(
          `success`,
          lang === "ar"
            ? Ar.SuccessfullySparepartRecieved
            : En.SuccessfullySparepartRecieved
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

  const handleScan = () => {
    const desired = siteData.find(
      (element) => element["value"] === FromSelected
    );
    setFromSelectedData(desired["label"]);
    setFinishedSelected(true);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navbar navigation={navigation} />
      {loading && <PageLoading />}
      {FromSelectedData === "" && (
        <View style={styles.view1}>
          <DropDownPicker
            onSelectItem={() => setFinishedSelected(true)}
            items={siteData}
            open={isFromOpen}
            setOpen={() => setIsFromOpen((prev) => !prev)}
            value={FromSelected}
            setValue={(val) => setFromSelected(val)}
            placeholder={
              lang === "ar" ? Ar.SelectStoreFrom : En.SelectStoreFrom
            }
            showTickIcon={true}
            searchable={true}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            zIndex={90}
          />
          <TouchableOpacity
            disabled={!finshedSelected ? true : false}
            style={[styles.btn2, { opacity: !finshedSelected ? 0.7 : 1 }]}
            onPress={handleScan}
          >
            <Icon
              type="material-community"
              name="barcode-scan"
              size={20}
              color={colors.white}
            />
            <Text style={styles.txt1}>{lang === "ar" ? Ar.Scan : En.Scan}</Text>
          </TouchableOpacity>
          {/* <Toast /> */}
        </View>
      )}

      {FromSelectedData !== "" && (
        <Scan
          onChildData={handleChildData}
          hasPermission={hasPermission}
          check={true}
          setLoading={setLoading}
        />
      )}
      {scanData !== "" && (
        <>
          <TouchableOpacity
            disabled={
              (!quantity && quantity !== "0") ||
              quantity === "" ||
              (!q && q !== "0") ||
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
                  (!quantity && quantity !== "0") ||
                  quantity === "" ||
                  (!q && q !== "0") ||
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
          {/* <Toast /> */}
        </>
      )}
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Recieve"}
      />
    </GestureHandlerRootView>
  );
};

export default Recieve;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
  view1: {
    gap: 10,
    padding: 10,
    width: 300,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn2: {
    flexDirection: "row",
    width: `100%`,
    backgroundColor: colors.logo,
    padding: 8,
    paddingHorizontal: 0,
    gap: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  txt1: { color: colors.white, fontSize: 18, fontWeight: "700" },
});
