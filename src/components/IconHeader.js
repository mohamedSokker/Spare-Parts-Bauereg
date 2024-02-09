import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import React from "react";
import tw from "tailwind-react-native-classnames";

import { colors } from "../globals/styles";

const IconHeader = ({
  name,
  type,
  visible,
  value,
  customFn,
  style,
  size,
  pageName,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={customFn}
      style={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      disabled={disabled}
    >
      <View style={style}>
        <Icon type={type} name={name} color={colors.logo} size={size} />
        {pageName !== "" && <Text style={{ fontSize: 10 }}>{pageName}</Text>}
        {visible && (
          <View
            style={tw`bg-red-500 rounded-full absolute -top-1 -right-1 w-8 items-center justify-center`}
          >
            <Text style={tw`text-white items-center justify-center`}>
              {value}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default IconHeader;

const styles = StyleSheet.create({});
