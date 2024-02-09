import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
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

const limit = 20;

const ItemsNew = ({ socket, navigation }) => {
  const { usersData, token } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [refreshing, setRefreshing] = useState(false);
  const [isFetchMore, setIsFetchMore] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const axiosPrivate = useAxiosPrivate();

  const url = `/api/v1/sparePartGetPosts?limit=${limit}&page=${currentPage}`;
  const { data, loading, setData } = useFetch(url, "POST", [], {
    username: usersData?.username,
  });

  const fetchMore = async () => {
    try {
      const current = currentPage + 1;
      setCurrentPage((prev) => prev + 1);
      const fetMoreurl = `/api/v1/sparePartGetPosts?limit=${limit}&page=${current}`;
      console.log(fetMoreurl);
      setListLoading(true);
      const datas = await axiosPrivate(fetMoreurl, {
        method: "POST",
        data: JSON.stringify({ username: usersData?.username }),
      });
      setData((prev) => [...prev, ...datas?.data]);
      if (datas?.data?.length < 20) setIsFetchMore(false);
      setListLoading(false);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setListLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      const current = 1;
      setCurrentPage(1);
      setIsFetchMore(true);
      setRefreshing(true);
      const refreshurl = `/api/v1/sparePartGetPosts?limit=${limit}&page=${current}`;
      console.log(refreshurl);
      const datas = await axiosPrivate(refreshurl, {
        method: "POST",
        data: JSON.stringify({ username: usersData?.username }),
      });
      setData(datas.data);
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

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      <PostLists navigation={navigation} initial={`itemsNew`} />
      {loading ? (
        <View style={[{ width: "98%", padding: 10 }]}>
          <ActivityIndicator size={40} color={colors.logo} />
        </View>
      ) : data?.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ width: "100%" }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item?.ID}
            renderItem={({ item }) => (
              <Post item={item} listLoading={listLoading} />
            )}
            onEndReached={isFetchMore && fetchMore}
            onEndReachedThreshold={0.1}
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
        initial={"Timeline"}
      />
      {/* <Toast /> */}
    </View>
  );
};

export default ItemsNew;

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
