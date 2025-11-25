import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useContext, useState } from "react";

import { LoginContext } from "../contexts/LoginContext";
import useFetch from "../hooks/useFetch";
import { colors } from "../globals/styles";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfilePost from "../components/ProfilePost";
import { getDistinctObjects } from "../functions/getDistinctObjects";

const Profile = ({ socket, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchMore, setIsFetchMore] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { token, usersData } = useContext(LoginContext);

  const axiosPrivate = useAxiosPrivate();

  const limit = 20;

  const url = `/api/v1/sparePartGetProfile?limit=${limit}&page=${currentPage}`;
  const { loading, data, setData } = useFetch(
    url,
    "POST",
    [],
    {
      usersData: usersData,
    },
    true
  );

  const fetchMore = async () => {
    try {
      const current = currentPage + 1;
      setCurrentPage((prev) => prev + 1);
      const fetMoreurl = `/api/v1/sparePartGetProfile?limit=${limit}&page=${current}`;
      console.log(fetMoreurl);
      setListLoading(true);
      const datas = await axiosPrivate(fetMoreurl, {
        method: "POST",
        data: JSON.stringify({ usersData: usersData }),
      });
      const distinctObjects = getDistinctObjects(datas?.data, "OrderNo");
      setData((prev) => [...prev, ...distinctObjects]);
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

  const getDate = (date) => {
    const dt = new Date(date);
    // dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
    return dt.toLocaleString();
  };

  const onRefresh = async () => {
    try {
      const current = 1;
      setCurrentPage(1);
      setIsFetchMore(true);
      setRefreshing(true);
      const refreshurl = `/api/v1/sparePartGetProfile?limit=${limit}&page=${current}`;
      const datas = await axiosPrivate(refreshurl, {
        method: "POST",
        data: JSON.stringify({ usersData: usersData }),
      });
      const distinctObjects = getDistinctObjects(datas?.data, "OrderNo");
      setData(distinctObjects);
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
      {loading ? (
        <View style={[{ width: "98%", padding: 10 }]}>
          <ActivityIndicator size={40} color={colors.logo} />
        </View>
      ) : data?.length > 0 ? (
        <View
          style={{
            width: "100%",
            flex: 1,
            paddingBottom: 55,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <View style={styles.view9}>
            <Image
              source={{ uri: `${EXPO_PUBLIC_BASE_URL}/${usersData.img}` }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
              resizeMode="cover"
            />
            <View style={styles.view10}>
              <TextInput placeholder="Create Task" style={styles.txtInput} />
              <TouchableOpacity style={styles.btn2}>
                <Text style={styles.text4}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          <FlatList
            style={styles.flatlist}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.ID}
            renderItem={({ item }) => (
              <ProfilePost
                item={item}
                navigation={navigation}
                usersData={usersData}
              />
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
        initial={"Profile"}
      />
    </View>
  );
};

export default Profile;

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
