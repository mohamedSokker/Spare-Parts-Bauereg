import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
// import Toast from "react-native-toast-message";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SelectNewCategory = ({ navigation, socket }) => {
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [FromSelected, setFromSelected] = React.useState(null);
  const [finshedSelected, setFinishedSelected] = React.useState(false);
  const [desc, setDesc] = useState("");

  const data = [
    {
      value: 1,
      nav: `Bauer Eq. Invoice`,
      label: lang === "ar" ? Ar.Invoice : En.Invoice,
      desc: lang === "ar" ? Ar.InvoiceDesc : En.InvoiceDesc,
    },
    {
      value: 2,
      nav: `Return Item`,
      label: lang === "ar" ? Ar.ReturnItem : En.ReturnItem,
      desc: lang === "ar" ? Ar.ReturnItemDesc : En.ReturnItemDesc,
    },
    {
      value: 3,
      nav: `Procurment`,
      label: lang === "ar" ? Ar.Procurment : En.Procurment,
      desc: lang === "ar" ? Ar.ProcurmentDesc : En.ProcurmentDesc,
    },
    {
      value: 4,
      nav: `Vendors`,
      label: lang === "ar" ? Ar.Vendors : En.Vendors,
      desc: lang === "ar" ? Ar.VendorsDesc : En.VendorsDesc,
    },
  ];

  useEffect(() => {
    if (finshedSelected) {
      const desired = data.find((element) => element["value"] === FromSelected);
      setDesc(desired["desc"]);
    }
  }, [FromSelected, lang]);

  const handleProceed = () => {
    const desired = data.find((element) => element["value"] === FromSelected);
    console.log(desired["nav"]);
    if (
      desired["nav"] === `Bauer Eq. Invoice` ||
      desired["nav"] === `Procurment`
    ) {
      navigation.navigate("SelectCategoryNo", { category: desired["nav"] });
    } else {
      navigation.navigate("New", { category: desired["nav"] });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navbar navigation={navigation} />
      {finshedSelected && (
        <View
          style={{
            // backgroundColor: "rgb(254,240,138)",
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: 6,
            padding: 10,
            width: "90%",
          }}
        >
          <Text
            style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}
          >
            {desc}
          </Text>
        </View>
      )}
      <View style={styles.view1}>
        <DropDownPicker
          onSelectItem={() => setFinishedSelected(true)}
          items={data}
          open={isFromOpen}
          setOpen={() => setIsFromOpen((prev) => !prev)}
          value={FromSelected}
          setValue={(val) => setFromSelected(val)}
          placeholder={lang === "ar" ? Ar.SelectCategory : En.SelectCategory}
          showTickIcon={true}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={90}
          dropDownContainerStyle={{ maxHeight: 400 }}
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

export default SelectNewCategory;

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
