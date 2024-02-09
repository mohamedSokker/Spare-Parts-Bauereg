import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import Toast from "react-native-toast-message";

import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import { colors } from "../globals/styles";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import { LoginContext } from "../contexts/LoginContext";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const PlaceOrderFields = ({ getChildData, OrderNo, val }) => {
  const { usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const axiosPrivate = useAxiosPrivate();

  const [Item, setItem] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (val !== null) {
      setItem(val.Item.toString());
      setQuantity(val.Quantity.toString());
    }
  }, []);

  const handleDetails = async () => {
    try {
      setIsDetail((prev) => !prev);
      setIsDetailLoading(true);
      const url = `/api/v1/sparePartGetTargetCode`;
      const data = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({ Code: Item }),
      });
      setDetailData(data?.data);
      setIsDetailLoading(false);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setIsDetailLoading(false);
    }
  };

  const handleSave = () => {
    if (Item && Quantity) {
      getChildData({
        ID: val !== null ? val.ID : null,
        OrderNo: OrderNo,
        Item: Item,
        Quantity: Quantity,
      });
      setDisabled(true);
    } else {
      alert(`Field Cann't be Empty`);
    }
  };

  return (
    <View style={styles.view2}>
      <View style={styles.view1}>
        <TextInput
          onChangeText={(e) => setItem(e)}
          style={styles.textInput}
          placeholder={lang === "ar" ? Ar.TypeItemCode : En.TypeItemCode}
          placeholderTextColor="grey"
          value={Item}
          editable={val !== null ? false : true}
        />
        <TextInput
          onChangeText={(e) => setQuantity(e)}
          style={styles.textInput}
          placeholder={lang === "ar" ? Ar.Quantity : En.Quantity}
          placeholderTextColor="grey"
          keyboardType="numeric"
          value={Quantity}
          editable={
            val !== null
              ? !(val.Confirmed === "true") && !usersData?.roles?.StockRes
                ? true
                : false
              : true
          }
        />
        {((usersData?.roles?.StockRes && val === null) ||
          (!usersData?.roles?.StockRes &&
            val !== null &&
            val.Confirmed !== "true")) && (
          <View style={styles.view3}>
            <TouchableOpacity
              style={[styles.btn2, { opacity: disabled ? 0.7 : 1 }]}
              disabled={disabled}
              onPress={handleSave}
            >
              <Text style={styles.txt1}>
                {disabled
                  ? lang === "ar"
                    ? Ar.Saved
                    : En.Saved
                  : lang === "ar"
                  ? Ar.Save
                  : En.Save}
              </Text>
            </TouchableOpacity>
            {val !== null && (
              <TouchableOpacity style={styles.btn3} onPress={handleDetails}>
                <Text style={styles.txt1}>
                  {lang === "ar" ? Ar.Details : En.Details}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {isDetail && (
          <ScrollView style={{ width: "100%", maxHeight: 200 }}>
            {isDetailLoading && (
              <View style={[{ zIndex: 100, width: "98%", padding: 10 }]}>
                <ActivityIndicator size={20} color={colors.logo} />
              </View>
            )}
            {detailData.length > 0 &&
              detailData.map((data, i) => (
                <View style={styles.view4} key={i}>
                  <View style={styles.view5}>
                    <Text>Store : {data?.Store}</Text>
                  </View>
                  <View style={styles.view5}>
                    <Text>Quantity: {data?.Quantity}</Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        )}
      </View>
      {/* <Toast /> */}
    </View>
  );
};

export default PlaceOrderFields;

const styles = StyleSheet.create({
  view1: {
    width: "100%",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  view2: {
    width: "98%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: colors.grey3,
  },
  view3: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  view4: {
    flexDirection: "row",
    width: "100%",
    padding: 4,
  },
  view5: {
    width: "50%",
    flexDirection: "row",
    gap: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.grey4,
    padding: 2,
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  btn1: {
    backgroundColor: colors.logo,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btn2: {
    backgroundColor: colors.logo,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btn3: {
    backgroundColor: colors.logo,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  txt1: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
