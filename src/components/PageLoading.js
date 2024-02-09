import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";

import tw from "tailwind-react-native-classnames";

import { colors } from "../globals/styles";

const PageLoading = () => {
  return (
    <View
      style={[
        tw`absolute w-full h-full bg-black opacity-40 justify-center items-center`,
        { zIndex: 100 },
      ]}
    >
      <ActivityIndicator size={35} color={colors.logo} />
    </View>
  );
};

export default PageLoading;

const styles = StyleSheet.create({});
