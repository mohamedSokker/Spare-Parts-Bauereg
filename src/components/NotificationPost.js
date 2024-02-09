import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";

import { BASE_URL } from "@env";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const getDate = (date) => {
  const dt = new Date(date);
  dt.setMinutes(dt.getMinutes() - 3.5 * dt.getTimezoneOffset());
  return dt.toISOString();
};

const Post = ({ item }) => {
  const { lang } = useContext(LangContext);
  return (
    <View style={styles.view1}>
      <View style={styles.view2}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ color: "red", fontWeight: "800", fontSize: 16 }}>
            {item.Item}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.Body}</Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Text style={{ color: "grey", fontSize: 13 }}>
            {new Date(getDate(item.DateTime)).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.view3}>
        <View style={styles.view4}>
          <Image
            source={{ uri: `${BASE_URL}/${item?.FromUserImg}` }}
            style={styles.img}
          />
          <Text style={styles.txt1}>{item.FromUserName}</Text>
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  view1: {
    backgroundColor: colors.white,
    flexDirection: "row",
    height: 120,
    width: "100%",
    justifyContent: "center",
    gap: 5,
    marginBottom: 8,
  },
  view2: {
    flexDirection: "column",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  },
  view3: {
    flexDirection: "column",
    width: "50%",
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  view4: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: colors.grey10,
    borderRadius: 8,
  },
  txt1: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.grey3,
  },
});
