import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import { Icon } from "react-native-elements";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const PostLists = ({ navigation, initial }) => {
  const { lang } = useContext(LangContext);

  console.log(initial);

  const data = [
    {
      ID: 1,
      name: `Pending`,
      iconNameOutline: `timer-outline`,
      iconNameSharp: `timer-sharp`,
      virtualName: lang === "ar" ? Ar.Pending : En.Pending,
      pageName: "ItemsPending",
    },
    {
      ID: 2,
      name: `New`,
      iconNameOutline: `star-outline`,
      iconNameSharp: `star-sharp`,
      virtualName: lang === "ar" ? Ar.New : En.New,
      pageName: `ItemsNew`,
    },
    {
      ID: 3,
      name: `Transitions`,
      iconNameOutline: `swap-vertical-outline`,
      iconNameSharp: `swap-vertical-sharp`,
      virtualName: lang === "ar" ? Ar.Transitions : En.Transitions,
      pageName: `ItemsTransitions`,
    },
    {
      ID: 4,
      name: `Consumptions`,
      iconNameOutline: `build-outline`,
      iconNameSharp: `build-sharp`,
      virtualName: lang === "ar" ? Ar.Consumptions : En.Consumptions,
      pageName: `ItemsConsumptions`,
    },
    {
      ID: 5,
      name: `Analysis`,
      iconNameOutline: `analytics-outline`,
      iconNameSharp: `analytics-sharp`,
      virtualName: lang === "ar" ? Ar.Analysis : En.Analysis,
      pageName: `ItemsAnalysis`,
    },
  ];
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%", paddingHorizontal: 4 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item?.ID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 4,
              paddingHorizontal: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor:
                initial === item.pageName ? colors.grey3 : colors.grey10,
              borderRadius: 6,
              marginRight: 12,
              backgroundColor:
                initial === item.pageName ? colors.grey3 : colors.white,
            }}
            onPress={() => navigation.navigate(item?.pageName)}
          >
            <Icon
              name={
                initial == item.pageName
                  ? item.iconNameSharp
                  : item.iconNameOutline
              }
              type={`ionicon`}
              size={20}
              color={"orange"}
            />
            <Text
              style={{
                color: initial === item.pageName ? colors.white : colors.logo,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {item.virtualName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PostLists;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.logo,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
