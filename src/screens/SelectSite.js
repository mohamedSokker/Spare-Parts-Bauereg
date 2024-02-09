import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
// import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../globals/styles";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { LoginContext } from "../contexts/LoginContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SelectSite = ({ navigation, socket }) => {
  const { lang } = useContext(LangContext);
  const { usersData } = useContext(LoginContext);

  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [FromSelected, setFromSelected] = React.useState("");
  const [finshedSelected, setFinishedSelected] = React.useState(false);
  const [siteData, setSiteData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const axiosPrivate = useAxiosPrivate();

  const getSite = async (copiedData) => {
    try {
      const site = await AsyncStorage.getItem("site");
      console.log(site);
      if (site) {
        copiedData?.map((data) => {
          if (data?.storage === site) {
            setFromSelected(data?.value);
            setFinishedSelected(true);
          }
        });
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

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const url = `/api/v1/sparePartGetActiveSites`;

        const data = await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify({}),
        });
        // console.log(data?.data);
        const copiedData = [];
        data?.data?.map((d, i) => {
          copiedData.push({
            value: i,
            label: lang === "ar" ? d?.Location_Ar : d?.Location,
            storage: d?.Location,
          });
        });
        setSiteData(copiedData);
        await getSite(copiedData);
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

  const handleProceed = async () => {
    try {
      setLoading(true);
      const desired = siteData.find(
        (element) => element["value"] === FromSelected
      );
      const url = `api/v1/setUserSite`;
      await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({
          username: usersData?.username,
          site: desired["storage"],
        }),
      });
      await AsyncStorage.setItem("site", desired["storage"]);
      navigation.navigate("Timeline", { site: desired["storage"] });
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

  return (
    <GestureHandlerRootView style={styles.container}>
      {loading && <PageLoading />}
      <View style={styles.view1}>
        <DropDownPicker
          onSelectItem={() => setFinishedSelected(true)}
          items={siteData}
          open={isFromOpen}
          setOpen={() => setIsFromOpen((prev) => !prev)}
          value={FromSelected}
          setValue={(val) => setFromSelected(val)}
          placeholder={lang === "ar" ? Ar.SelectSite : En.SelectSite}
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
      {/* <Toast /> */}
    </GestureHandlerRootView>
  );
};

export default SelectSite;

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
    marginBottom: 15,
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
