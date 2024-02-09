import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
// import Toast from "react-native-toast-message";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SelectCategoryNo = ({ navigation, socket, route }) => {
  const { category } = route.params;
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [FromSelected, setFromSelected] = React.useState("");
  const [finshedSelected, setFinishedSelected] = React.useState(false);
  const [siteData, setSiteData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        let url = ``;
        if (category === `Bauer Eq. Invoice`) {
          url = `/api/v1/sparePartGetUnrecievedInv`;
        } else if (category === `Procurment`) {
          url = `/api/v1/sparePartGetProcurment`;
        }

        const data = await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify({}),
        });
        const copiedData = [];
        data?.data?.map((d, i) => {
          if (category === `Bauer Eq. Invoice`) {
            copiedData.push({
              value: i,
              label: d?.Invoices,
            });
          } else if (category === `Procurment`) {
          }
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
        navigation.goBack();
      }
    };
    getData();
  }, []);

  const handleProceed = () => {
    const desired = siteData.find(
      (element) => element["value"] === FromSelected
    );
    navigation.navigate("New", {
      category: category,
      catData: desired["label"],
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navbar navigation={navigation} />
      {loading && <PageLoading />}
      <View style={styles.view1}>
        <DropDownPicker
          onSelectItem={() => setFinishedSelected(true)}
          items={siteData}
          open={isFromOpen}
          setOpen={() => setIsFromOpen((prev) => !prev)}
          value={FromSelected}
          setValue={(val) => setFromSelected(val)}
          placeholder={
            category === "Bauer Eq. Invoice"
              ? lang === "ar"
                ? Ar.SelectInvoce
                : En.SelectInvoce
              : lang === "ar"
                ? Ar.SelectProcurmentNo
                : En.SelectProcurmentNo
          }
          showTickIcon={true}
          searchable={true}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={90}
        />
      </View>

      <TouchableOpacity
        disabled={!finshedSelected ? true : false}
        style={[styles.btn1, { opacity: !finshedSelected ? 0.7 : 1 }]}
        onPress={handleProceed}
      >
        <Text style={{ color: colors.white, fontSize: 16 }}>
          {lang === "ar" ? Ar.Proceed : En.Proceed}
        </Text>
      </TouchableOpacity>
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"SelectNewCategory"}
      />
      {/* <Toast /> */}
    </GestureHandlerRootView>
  );
};

export default SelectCategoryNo;

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
});
