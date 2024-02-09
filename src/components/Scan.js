import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Icon } from "react-native-elements";
import { Audio } from "expo-av";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { showToast } from "../functions/showToast";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Scan = ({ onChildData, hasPermission, check, setLoading }) => {
  const { lang } = useContext(LangContext);
  const { usersData } = useContext(LoginContext);
  // const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isPositionEmpty, setIsPositionEmpty] = useState(false);
  const [q, setQ] = useState(1);
  const [data, setData] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const playBuzzerSound = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require("../../assets/Hello.mp3"));
      await soundObject.playAsync();
      setTimeout(async () => {
        try {
          await soundObject?.unloadAsync();
        } catch (err) {
          console.log(err.message);
        }
      }, 2000);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
    }
  };

  const checkItem = async (code) => {
    try {
      setLoading(true);
      // const storageData = await AsyncStorage.getItem("cart");
      // let storageDataArray = storageData ? JSON.parse(storageData) : [];
      // storageDataArray = storageDataArray.sort((a, b) => b.id - a.id);
      // console.log(storageDataArray);
      // const storageResult = storageDataArray.find(
      //   (d) =>
      //     (d.ItemTo === usersData?.roles?.StockRes[0] && d.Code === code) ||
      //     (d.ItemFrom === usersData?.roles.StockRes[0] && d.Code === code)
      // );
      // console.log(
      //   storageResult
      //     ? `Result => ${JSON.stringify(storageResult)}`
      //     : `Not Found`
      // );

      // if (!storageResult) {
      const url = `/api/v1/sparePartCheckItemInStore`;
      const data = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({ Code: code }),
      });
      const result = data?.data.find(
        (d) => d.Store === usersData?.roles?.StockRes[0]
      );
      let newResult = {};
      if (!result) {
        newResult = data?.data.find((d) => d.Code === code);
        if (!newResult) throw new Error(`This Code is not found in Store DB`);
        newResult = {
          ...newResult,
          Quantity: "0",
          Position: "",
          Status: `New`,
        };
      } else {
        newResult = { ...result, Status: `Current` };
      }
      setQuantity(newResult?.Quantity);
      if (
        newResult?.Quantity === null ||
        newResult?.Quantity === "" ||
        !newResult?.Quantity
      )
        setIsEmpty(true);
      if (
        newResult?.Position === null ||
        newResult?.Position === "" ||
        !newResult?.Position
      )
        setIsPositionEmpty(true);
      setLoading(false);
      setData(newResult);
      return newResult;
      // }
      // let newResult = {};

      // newResult = {
      //   ...storageResult,
      //   Quantity: storageResult.stockQuantity.toString(),
      // };
      // setQuantity(newResult?.Quantity);
      // setData(newResult);
      // console.log(newResult);
      // setLoading(false);
      // return newResult;
    } catch (err) {
      setLoading(false);
      throw new Error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
    }
  };

  //   const sendDataToParent = () => {
  //     onChildData(scanData);
  //   };

  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   };

  //   getBarCodeScannerPermissions();
  // }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setScanned(true);
      setScanData(data);
      await playBuzzerSound();
      if (check && usersData?.roles?.StockRes?.length > 0) {
        const result = await checkItem(data);
        onChildData({
          data,
          quantity: result?.Quantity,
          q: q,
          result: result,
        });
      } else {
        onChildData({ data });
      }
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={{ flex: 1 }}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFill, { flex: 1 }]}
        />
      ) : (
        <View style={styles.view2}>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => {
              setScanned(false);
              setQuantity(null);
              setQ(1);
              if (check) {
                onChildData({ data: "", quantity: null, q: 1, result: data });
              } else {
                onChildData({ data: "" });
              }
            }}
          >
            <Icon
              type="material-community"
              name="barcode-scan"
              size={20}
              color={colors.white}
            />
            <Text style={{ color: colors.white }}>
              {lang === "ar" ? Ar.TapToScanAgain : En.TapToScanAgain}
            </Text>
          </TouchableOpacity>
          <Text>{scanData}</Text>
          {check && (
            <View style={styles.view1}>
              <Text style={styles.txt1}>
                {lang === "ar" ? Ar.Quantity : En.Quantity}
              </Text>
              <TextInput
                onChangeText={(e) => {
                  if (Number(e) || e === "0" || e === "") {
                    setQ(e);
                    onChildData({
                      data: scanData,
                      quantity: quantity,
                      q: e,
                      result: data,
                    });
                  } else {
                    setQ(1);
                    onChildData({
                      data: scanData,
                      quantity: quantity,
                      q: 1,
                      result: data,
                    });
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor="grey"
                style={styles.textInput}
                placeholder={lang === "ar" ? Ar.Quantity : En.Quantity}
                value={q?.toString()}
              />
            </View>
          )}
          {check && (
            <View style={styles.view1}>
              <Text style={styles.txt1}>
                {lang === "ar" ? Ar.ActualQuantity : En.ActualQuantity}
              </Text>
              <TextInput
                onChangeText={(e) => {
                  if (Number(e) || e === "0" || e === "") {
                    setQuantity(e);
                    setData((prev) => ({ ...prev, Quantity: e }));
                    onChildData({
                      data: scanData,
                      quantity: e,
                      q: q,
                      result: { ...data, Quantity: e },
                    });
                  } else {
                    setQuantity("");
                    setData((prev) => ({ ...prev, Quantity: e }));
                    onChildData({
                      data: scanData,
                      quantity: "",
                      q: q,
                      result: { ...data, Quantity: e },
                    });
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor="grey"
                style={styles.textInput}
                placeholder={
                  lang === "ar" ? Ar.ActualQuantity : En.ActualQuantity
                }
                value={quantity?.toString()}
                editable={isEmpty ? true : false}
              />
            </View>
          )}
          {check && (
            <View style={styles.view1}>
              <Text style={styles.txt1}>
                {lang === "ar" ? Ar.Position : En.Position}
              </Text>
              <TextInput
                onChangeText={(e) => {
                  setData((prev) => ({ ...prev, Position: e }));
                  onChildData({
                    data: scanData,
                    quantity: quantity,
                    q: q,
                    result: { ...data, Position: e },
                  });
                }}
                placeholderTextColor="grey"
                style={styles.textInput}
                placeholder={lang === "ar" ? Ar.Position : En.Position}
                value={data?.Position}
                editable={isPositionEmpty ? true : false}
              />
            </View>
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "99%",
    overflow: "hidden",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btn1: {
    width: "100%",
    flexDirection: "row",
    gap: 20,
    backgroundColor: colors.logo,
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  view2: {
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.grey4,
    padding: 2,
    paddingHorizontal: 8,
    width: "48%",
    borderRadius: 8,
  },
  view1: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  txt1: {
    width: "50%",
  },
});
