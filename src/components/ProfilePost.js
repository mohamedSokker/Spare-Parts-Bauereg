import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const ProfilePost = ({ item, navigation, usersData }) => {
  const { lang } = useContext(LangContext);
  const handleView = (OrderNo, ID) => {
    navigation.navigate("Confirm", { OrderNo: OrderNo, ID: ID });
  };
  return (
    <View style={styles.view1}>
      <View style={styles.view7}>
        <View style={[styles.view3, { flex: 6 / 9 }]}>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>
            {item.FromStore}
          </Text>
          {/* <Text>{getDate(new Date(item.DateTime))}</Text> */}
          <Text>{item.DateTime}</Text>
        </View>
        <View style={styles.view8}>
          <TouchableOpacity
            disabled={
              usersData?.roles?.StockRes
                ? item.Confirmed === "false"
                  ? false
                  : false
                : item.Confirmed === "false"
                  ? false
                  : false
            }
            style={[
              styles.btn1,
              {
                backgroundColor: usersData?.roles?.StockRes
                  ? item.Confirmed === "false"
                    ? "red"
                    : "green"
                  : item.Confirmed === "false"
                    ? "red"
                    : "green",
                opacity: usersData?.roles?.StockRes
                  ? item.Confirmed === "false"
                    ? 1
                    : 1
                  : item.Confirmed === "false"
                    ? 1
                    : 1,
              },
            ]}
            onPress={() => handleView(item?.OrderNo, item?.ID)}
          >
            <Text style={styles.text3}>
              {usersData?.roles?.StockRes
                ? item.Confirmed === "false"
                  ? lang === "ar"
                    ? Ar.Pending
                    : En.Pending
                  : lang === "ar"
                    ? Ar.Confirmed
                    : En.Confirmed
                : item.Confirmed === "false"
                  ? lang === "ar"
                    ? Ar.Confirm
                    : En.Confirm
                  : lang === "ar"
                    ? Ar.Confirmed
                    : En.Confirmed}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.view4}>
        <View style={{ maxWidth: "80%" }}>
          <Text
            style={styles.text1}
          >{`Order No (${item.OrderNo}) From ${item.FromStore}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfilePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 8,
  },
  view1: {
    backgroundColor: colors.white,
    // borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  view6: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 4,
  },
  img: {
    width: 50,
    height: 50,
  },
  view3: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 10,
    padding: 8,
    alignItems: "flex-start",
  },
  view4: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text1: {
    fontSize: 16,
    color: colors.logo,
    fontWeight: "800",
  },
  text2: {
    backgroundColor: "green",
    padding: 4,
    borderRadius: 4,
  },
  view5: {
    height: "100%",
    width: "100%",
  },
  btn1: {
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  text3: {
    textAlign: "center",
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
    width: "100%",
  },
  view7: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
  },
  view8: {
    justifyContent: "flex-end",
    flex: 3 / 9,
  },
  view9: {
    width: "98%",
    padding: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  view10: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 5,
    flexGrow: 1,
    padding: 8,
    flexDirection: "column",
  },
  txtInput: {
    padding: 8,
    paddingLeft: 8,
    backgroundColor: colors.white,
    width: "100%",
    borderRadius: 6,
  },
  btn2: {
    backgroundColor: colors.logo,
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text4: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  flatlist: {
    width: "100%",
    // padding: 10,
    // borderRadius: 10,
  },
});
