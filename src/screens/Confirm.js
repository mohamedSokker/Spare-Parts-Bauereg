import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { debounce } from "lodash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
// import Toast from "react-native-toast-message";

import { BASE_URL } from "@env";

import { StocksContext } from "../contexts/StocksContext";
import { colors } from "../globals/styles";
import PlaceOrderFields from "../components/PlaceOrderFields";
import { LoginContext } from "../contexts/LoginContext";
import useFetch from "../hooks/useFetch";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const Confirm = ({ route, navigation, socket }) => {
  const { OrderNo, ID } = route.params;
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const [field, setField] = useState([]);
  const [count, setCount] = useState(0);
  const [isSearched, setIsSearched] = useState(false);
  const [isFinsished, setIsFinished] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [fieldsData, setFieldsData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const OrdersNo = useRef();

  const handleFinish = async () => {
    try {
      if (count === data.length) {
        setPageLoading(true);
        let bodyData = [];
        fieldsData.forEach((fieldData) => {
          bodyData.push({
            Quantity: fieldData.Quantity,
            ID: fieldData.ID,
            OrderNo: OrderNo,
            FromUserName: usersData.username,
            FromUserImg: usersData.img,
            ToUser: "MainStore",
            title: `Order ${OrderNo} Confirmed`,
            body: `${usersData?.username} Just Confirmed The Order`,
          });
        });
        console.log(bodyData);
        const url = `/api/v1/confirmOrder`;
        await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify(bodyData),
        });
        setPageLoading(false);
        setIsFinished(true);
        showToast(
          `success`,
          lang === "ar"
            ? Ar.SuccessfullyOrderConfirmed
            : En.SuccessfullyOrderConfirmed
        );
      } else {
        setPageLoading(false);
        alert(lang === "ar" ? Ar.MustSaveAllItems : En.MustSaveAllItems);
      }
    } catch (err) {
      console.log(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setPageLoading(false);
    }
  };

  const getChildData = (field) => {
    setFieldsData((prev) => [...prev, field]);
    setCount((prev) => prev + 1);
  };

  const mainUrl = `/api/v1/sparePartGetTargetOrder`;
  const { setData, data, loading } = useFetch(mainUrl, "POST", [], {
    OrderNo: OrderNo,
  });

  // console.log(data);

  // useEffect(() => {
  //   setField([]);
  //   data &&
  //     data.map((item, i) => {
  //       setField((prev) => [
  //         ...prev,
  //         <PlaceOrderFields
  //           key={i}
  //           getChildData={getChildData}
  //           OrderNo={OrderNo}
  //           val={{
  //             // ID: item.ID,
  //             Item: item.Code,
  //             Quantity: item.Quantity,
  //             Confirmed: item.Confirmed,
  //           }}
  //         />,
  //       ]);
  //     });
  // }, [data]);

  const handler = useCallback(
    debounce(async (e) => {
      try {
        if (e === "") {
          setSearchLoading(false);
        } else {
          const url = `/api/v1/sparePartGetItems`;
          const data = await axiosPrivate(url, {
            method: "POST",
            data: { Code: e },
          });
          let targetData = [];
          data?.data.map((d) => {
            targetData.push(`${d.Code} ${d.SabCode} ${d.Description}`);
          });
          targetData = [...new Set(targetData)];
          setSearchedData(targetData);
          if (e === "" || data.data.length === 0) {
            setIsSearched(false);
          }
        }

        setSearchLoading(false);
      } catch (err) {
        showToast(
          `error`,
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.message
        );
        setSearchLoading(false);
        setIsSearched(false);
      }
    }, 1000),
    []
  );

  const handleSearch = async (e) => {
    setIsSearched(true);
    setSearchLoading(true);
    handler(e);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const datas = await axiosPrivate(mainUrl, {
        method: "POST",
        data: JSON.stringify({ OrderNo: OrderNo }),
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
    }
  };

  return (
    <GestureHandlerRootView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Navbar navigation={navigation} />
      {loading && (
        <View style={[{ zIndex: 100, width: "98%", padding: 10 }]}>
          <ActivityIndicator size={40} color={colors.logo} />
        </View>
      )}
      {pageLoading && <PageLoading />}
      <>
        <View style={styles.view4}>
          <TextInput
            style={styles.textInput}
            placeholder={lang === "ar" ? Ar.SearchForItems : En.SearchForItems}
            onChangeText={handleSearch}
          />
          {isSearched && (
            <ScrollView
              style={styles.view5}
              showsVerticalScrollIndicator={false}
            >
              {searchLoading ? (
                <View>
                  <ActivityIndicator size={30} color={colors.grey} />
                </View>
              ) : (
                searchedData.map((data) => (
                  <View style={styles.view5} key={data}>
                    <TouchableOpacity onPress={() => setIsSearched(false)}>
                      <Text style={{ color: colors.grey3, marginBottom: 4 }}>
                        {data}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>
        <View style={styles.view4}>
          <TextInput
            ref={OrdersNo}
            onChangeText={(e) => (OrdersNo.current.value = e)}
            style={[styles.textInput, { backgroundColor: colors.grey6 }]}
            placeholder={lang === "ar" ? Ar.OrderNo : En.OrderNo}
            placeholderTextColor="grey"
            editable={false}
            value={OrderNo}
          />
        </View>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.view2}>
            {data?.map((item, i) => (
              <PlaceOrderFields
                key={i}
                getChildData={getChildData}
                OrderNo={OrderNo}
                val={{
                  ID: item.ID,
                  Item: item.Code,
                  Quantity: item.Quantity,
                  Confirmed: item.Confirmed,
                }}
              />
            ))}
          </View>
        </ScrollView>
        {data &&
          data[0]?.Confirmed === "false" &&
          !usersData?.roles.StockRes && (
            <View style={styles.view1}>
              <TouchableOpacity
                disabled={isFinsished ? true : false}
                style={[styles.btn1, { opacity: isFinsished ? 0.7 : 1 }]}
                onPress={handleFinish}
              >
                <Text style={styles.txt1}>
                  {isFinsished
                    ? lang === "ar"
                      ? Ar.Finished
                      : En.Finished
                    : lang === "ar"
                    ? Ar.Finish
                    : En.Finish}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </>
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Confirm"}
      />
      {/* <Toast /> */}
    </GestureHandlerRootView>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
  },
  scroll: {
    width: "100%",
    padding: 8,
  },
  view2: {
    justifyContent: "center",
    alignItems: "center",
  },
  view1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 55,
  },
  view3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    gap: 8,
  },
  view4: {
    position: "relative",
    width: "100%",
    padding: 12,
  },
  view5: {
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 8,
    maxHeight: 100,
  },
  btn1: {
    backgroundColor: colors.logo,
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  btn4: {
    backgroundColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  txt1: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  btn2: {
    padding: 6,
    backgroundColor: "green",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  btn3: {
    padding: 6,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey4,
    padding: 2,
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
});
