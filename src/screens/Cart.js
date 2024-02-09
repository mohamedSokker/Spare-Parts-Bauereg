import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import Toast from "react-native-toast-message";

import { colors } from "../globals/styles";
import { LoginContext } from "../contexts/LoginContext";
import useFetch from "../hooks/useFetch";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Post from "../components/Post";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import PostLists from "../components/PostLists";
import CartPost from "../components/CartPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotContext } from "../contexts/NotificationContext";
import PageLoading from "../components/PageLoading";

const Cart = ({ socket, navigation }) => {
  const { usersData, token } = useContext(LoginContext);
  const { lang } = useContext(LangContext);
  const { setCart, cart } = useContext(NotContext);

  const [refreshing, setRefreshing] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const result = await AsyncStorage.getItem("cart");
        if (result) {
          setData(JSON.parse(result));
        }
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
  }, [cart]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const result = await AsyncStorage.getItem("cart");
      if (result) {
        setData(JSON.parse(result));
      }
      setRefreshing(false);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setRefreshing(false);
    }
  };

  const handleSend = async () => {
    console.log(data);
  };

  const handleDelete = async () => {
    setPageLoading(true);
    await AsyncStorage.removeItem(`cart`);
    setCart([]);
    setData([]);
    setPageLoading(false);
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} initial={`Cart`} />
      {pageLoading && <PageLoading />}
      {loading ? (
        <View style={[{ width: "98%", padding: 10 }]}>
          <ActivityIndicator size={40} color={colors.logo} />
        </View>
      ) : data?.length > 0 ? (
        <View style={{ flex: 1, gap: 20, paddingVertical: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: "45%",
                backgroundColor: "green",
                padding: 6,
                paddingHorizontal: 40,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleSend}
            >
              <Text
                style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}
              >
                Send All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "45%",
                backgroundColor: "red",
                padding: 6,
                paddingHorizontal: 40,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleDelete}
            >
              <Text
                style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}
              >
                Delete All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={{ width: "100%" }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <CartPost
                item={item}
                listLoading={listLoading}
                data={data}
                setPageLoading={setPageLoading}
              />
            )}
            // onEndReached={isFetchMore && fetchMore}
            // onEndReachedThreshold={0.1}
          />
          {listLoading && <ActivityIndicator size={30} color={colors.logo} />}
        </View>
      ) : (
        <ScrollView
          style={styles.view5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text
            style={[{ fontSize: 18, fontWeight: "500", textAlign: "center" }]}
          >
            Nothing To Show
          </Text>
        </ScrollView>
      )}
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Cart"}
      />
      {/* <Toast /> */}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 55,
  },
  view5: {
    height: "100%",
    width: "100%",
  },
});
