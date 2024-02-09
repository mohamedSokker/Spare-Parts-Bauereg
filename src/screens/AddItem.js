import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
// import Toast from "react-native-toast-message";

import { BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const AddItem = ({ navigation, socket }) => {
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [pageLoading, setPageLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const Code = useRef();
  const SabCode = useRef();
  const Unit = useRef();
  const Quantity = useRef();
  const Store = useRef();
  const Description = useRef();
  const Detail = useRef();
  const Position = useRef();

  const handleSubmit = async () => {
    setPageLoading(true);
    const bodyData = {
      Code: Code.current.value,
      SabCode: SabCode.current.value,
      Unit: Unit.current.value,
      Quantity: Quantity.current.value,
      Store: Store.current.value,
      Description: Description.current.value,
      Detail: Detail.current.value,
      Position: Position.current.value,
    };
    try {
      const url = `/api/v1/AppStocks`;
      const res = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify(bodyData),
      });
      setPageLoading(false);
      showToast(`success`, `Successfully Add Item`);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setPageLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.logo,
          padding: 6,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>
          {lang === "ar" ? Ar.AddItemsInStock : En.AddItemsInStock}
        </Text>
      </View>
      {pageLoading && <PageLoading />}
      <View style={styles.scroll}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 55 }}>
            <TextInput
              ref={Code}
              onChangeText={(e) => (Code.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Code : En.Code}
            />
            <TextInput
              ref={SabCode}
              onChangeText={(e) => (SabCode.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.SabCode : En.SabCode}
              keyboardType="numeric"
            />
            <TextInput
              ref={Unit}
              onChangeText={(e) => (Unit.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Unit : En.Unit}
            />
            <TextInput
              ref={Quantity}
              onChangeText={(e) => (Quantity.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Quantity : En.Quantity}
              keyboardType="numeric"
            />
            <TextInput
              ref={Store}
              onChangeText={(e) => (Store.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Store : En.Store}
            />
            <TextInput
              ref={Description}
              onChangeText={(e) => (Description.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Description : En.Description}
            />
            <TextInput
              ref={Position}
              onChangeText={(e) => (Position.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Position : En.Position}
            />
            <TextInput
              ref={Detail}
              onChangeText={(e) => (Detail.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.Details : En.Details}
            />
          </View>
        </ScrollView>
        <View style={styles.view1}>
          <TouchableOpacity style={styles.btn1} onPress={handleSubmit}>
            <Text style={styles.txt1}>
              {lang === "ar" ? Ar.Submit : En.Submit}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"AddItem"}
      />
      {/* <Toast /> */}
    </View>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.grey10,
    // padding: 8,
  },
  scroll: {
    width: "100%",
    flex: 1,
    padding: 8,
    paddingBottom: 50,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey4,
    padding: 2,
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  view1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  btn1: {
    backgroundColor: colors.logo,
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  txt1: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});
