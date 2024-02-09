import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Error = ({
  url,
  setRefreshing,
  setLoading,
  setError,
  setData,
  errorBody,
  setErrorBody,
  refreshing,
  usersData,
}) => {
  const axiosPrivate = useAxiosPrivate();
  //   const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setLoading(true);
      setError(false);
      const datas = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({ username: usersData?.username }),
      });
      // if (!data) throw new Error("Error Fetching Data");
      setData(datas.data);
      setRefreshing(false);
      setLoading(false);
    } catch (err) {
      console.log(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setError(true);
      setErrorBody(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setRefreshing(false);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={[
            tw`bg-yellow-200 flex-row p-2 px-8 mt-4 rounded-lg items-center justify-center`,
          ]}
        >
          <Icon
            name="alert-outline"
            type="material-community"
            size={35}
            color="red"
            style={tw`mr-2`}
          />
          <Text style={[tw`font-bold text-lg`, { color: "red" }]}>
            {errorBody}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({});
