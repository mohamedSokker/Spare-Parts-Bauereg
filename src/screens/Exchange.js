import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Icon } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import useRefreshToken from "../hooks/useRefreshToken";
import { NotContext } from "../contexts/NotificationContext";

const Exchange = ({ navigation, socket, hasPermission, route }) => {
  const refresh = useRefreshToken();
  const { category } = route.params;
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);
  const { setCart } = useContext(NotContext);

  console.log(`category => ${category}`);

  const [scanData, setScanData] = useState("");
  const [isEqOpen, setIsEqOpen] = React.useState(false);
  const [eqSelected, setEqSelected] = React.useState(0);
  const [eqSelectedData, setEqSelectedData] = React.useState("");
  const [finshedSelected, setFinishedSelected] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [quantity, setQuantity] = useState(null);
  const [q, setQ] = useState(1);
  const [datas, setDatas] = useState([]);

  console.log(datas);

  const axiosPrivate = useAxiosPrivate();

  const handleChildData = (dataFromChild) => {
    setScanData(dataFromChild?.data);
    setQuantity(dataFromChild?.quantity);
    setQ(dataFromChild?.q);
    setDatas(dataFromChild?.result);
  };

  const getWorkshopData = async () => {
    setLoading(true);
    try {
      const url = `/api/v1/sparePartGetWorkshops`;
      const data = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({}),
      });
      const copiedData = [];
      data.data.map((equip) => {
        copiedData.push({ value: equip.ID, label: equip.Name });
      });
      setData(copiedData);
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

  const getEqData = async () => {
    setLoading(true);
    try {
      let user = {};
      if (usersData?.roles?.StockRes && !usersData?.roles?.User?.Sites[0]) {
        user = (await refresh()).user;
      } else {
        user = usersData;
      }
      console.log(user);
      console.log(user?.roles?.User);
      const url = `/api/v1/sparePartGetUserEquipments`;
      const data = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({ site: user?.roles?.User?.Sites[0] }),
      });
      const copiedData = [];
      data.data.map((equip) => {
        copiedData.push({ value: equip.ID, label: equip.Equipment });
      });
      setData(copiedData);
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

  useEffect(() => {
    if (category === "Equipment") {
      getEqData();
    } else {
      getWorkshopData();
    }
  }, []);

  // const handleupdateStore = async () => {
  //   try {
  //     setLoading(true);
  //     if (usersData?.roles?.StockRes?.length > 0) {
  //       const bodyData = {
  //         ID: datas?.ID,
  //         Status: datas?.Status,
  //         Code: scanData,
  //         Quantity: datas.Quantity,
  //         q: q,
  //         stockQuantity: Number(data?.Quantity) - Number(q),
  //         SabCode: datas?.SabCode,
  //         Unit: datas?.Unit,
  //         Description: datas?.Description,
  //         Detail: datas?.Detail,
  //         Position: datas?.Position,
  //         UserName: usersData.username,
  //         ProfileImg: usersData.img,
  //         Item: usersData.roles.StockRes[0],
  //         ItemFrom: usersData.roles.StockRes[0],
  //         ItemTo: eqSelectedData,
  //         catData: category,
  //         ItemStatus: "Exchange",
  //         title: `Spare part Consumed`,
  //         body: `${scanData} has been consumed on ${eqSelectedData} from store ${usersData.roles.StockRes[0]}`,
  //       };
  //       const result = await AsyncStorage.getItem("cart");

  //       let cartData = result ? JSON.parse(result) : [];
  //       cartData.push({ ...bodyData, id: cartData.length + 1 });
  //       await AsyncStorage.setItem("cart", JSON.stringify(cartData));
  //       setCart(cartData);
  //       showToast(
  //         `success`,
  //         lang === "ar"
  //           ? Ar.SuccessfullySparepartConsumed
  //           : En.SuccessfullySparepartConsumed
  //       );
  //       navigation.goBack();
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //       alert(`You are not allowed to Exchange`);
  //     }
  //   } catch (err) {
  //     console.log(
  //       err?.response?.data?.message
  //         ? err?.response?.data?.message
  //         : err?.message
  //     );
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
          ID: datas?.ID,
          Status: datas?.Status,
          Code: scanData,
          Quantity: datas.Quantity,
          q: q,
          SabCode: datas?.SabCode,
          Unit: datas?.Unit,
          Description: datas?.Description,
          Detail: datas?.Detail,
          Position: datas?.Position,
          UserName: usersData.username,
          ProfileImg: usersData.img,
          Item: usersData.roles.StockRes[0],
          ItemFrom: usersData.roles.StockRes[0],
          ItemTo: eqSelectedData,
          catData: category,
          ItemStatus: "Exchange",
          title: `Spare part Consumed`,
          body: `${scanData} has been consumed on ${eqSelectedData} from store ${usersData.roles.StockRes[0]}`,
        };
        const url = `/api/v1/stocksExchange`;
        await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify(bodyData),
        });
        showToast(
          `success`,
          lang === "ar"
            ? Ar.SuccessfullySparepartConsumed
            : En.SuccessfullySparepartConsumed
        );
        navigation.goBack();
        setLoading(false);
      } else {
        setLoading(false);
        alert(`You are not allowed to Exchange`);
      }
    } catch (err) {
      console.log(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setLoading(false);
    }
  };

  // console.log(eqSelectedData);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navbar navigation={navigation} />
      {loading && <PageLoading />}
      {eqSelectedData === "" && (
        <View
          style={{
            gap: 10,
            padding: 10,
            width: 300,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DropDownPicker
            onSelectItem={() => setFinishedSelected(true)}
            maxHeight={200}
            items={data}
            open={isEqOpen}
            setOpen={() => setIsEqOpen((prev) => !prev)}
            value={eqSelected}
            setValue={(val) => setEqSelected(val)}
            placeholder={
              category === "Equipment"
                ? lang === "ar"
                  ? Ar.SelectEquipment
                  : En.SelectEquipment
                : lang === "ar"
                  ? Ar.SelectWorkshop
                  : En.SelectWorkshop
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
            style={{
              flexDirection: "row",
              width: "100%",
              backgroundColor: colors.logo,
              padding: 8,
              paddingHorizontal: 0,
              gap: 10,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              opacity: !finshedSelected ? 0.7 : 1,
            }}
            onPress={() => {
              const desired = data.find(
                (element) => element["value"] === eqSelected
              );
              setEqSelectedData(desired["label"]);
            }}
          >
            <Icon
              type="material-community"
              name="barcode-scan"
              size={20}
              color={colors.white}
            />
            <Text
              style={{ color: colors.white, fontSize: 18, fontWeight: "700" }}
            >
              {lang === "ar" ? Ar.Scan : En.Scan}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {eqSelectedData !== "" && (
        <Scan
          onChildData={handleChildData}
          hasPermission={hasPermission}
          check={true}
          setLoading={setLoading}
        />
      )}

      {scanData !== "" && (
        <View style={styles.view1}>
          <TouchableOpacity
            disabled={
              !quantity ||
              quantity === "" ||
              !q ||
              q === "" ||
              q > quantity ||
              !datas?.Position ||
              datas?.Position === ""
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
                  q > quantity ||
                  !datas?.Position ||
                  datas?.Position === ""
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
        </View>
      )}
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Exchange"}
      />
    </GestureHandlerRootView>
  );
};

export default Exchange;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view1: {
    width: "95%",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 55,
  },
  btn1: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    backgroundColor: colors.logo,
    padding: 8,
    borderRadius: 8,
  },
});
