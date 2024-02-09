import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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

const AddWorkshop = ({ navigation, socket }) => {
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [pageLoading, setPageLoading] = useState(false);
  const [workshopData, setWorkshopData] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const Name = useRef();

  useEffect(() => {
    const getData = async () => {
      try {
        setPageLoading(true);
        const url = `/api/v1/sparePartGetWorkshops`;
        const data = await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify({}),
        });
        setWorkshopData(data?.data);
        setPageLoading(false);
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
    getData();
  }, []);

  const handleSubmit = async () => {
    setPageLoading(true);
    const bodyData = {
      name: Name.current.value,
    };
    try {
      const url = `/api/v1/sparePartAddWorkshop`;
      const res = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify(bodyData),
      });
      setPageLoading(false);
      showToast(`success`, `Successfully Added Workshop`);
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
          {lang === "ar" ? Ar.AddWorkshopName : En.AddWorkshopName}
        </Text>
      </View>
      {pageLoading && <PageLoading />}
      <View style={styles.scroll}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 55 }}>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {workshopData.length === 0 ? (
                <Text>Nothing to show</Text>
              ) : (
                workshopData.map((data, i) => <Text key={i}>{data?.Name}</Text>)
              )}
            </View>
            <TextInput
              ref={Name}
              onChangeText={(e) => (Name.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.WorkshopName : En.WorkshopName}
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
        initial={"AddWorkshop"}
      />
      {/* <Toast /> */}
    </View>
  );
};

export default AddWorkshop;

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
