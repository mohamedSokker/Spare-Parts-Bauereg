import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { debounce } from "lodash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
// import Toast from "react-native-toast-message";

import { EXPO_PUBLIC_BASE_URL } from "@env";

import { colors } from "../globals/styles";
import PlaceOrderFields from "../components/PlaceOrderFields";
import { TextInput } from "react-native-gesture-handler";
import { LoginContext } from "../contexts/LoginContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showToast } from "../functions/showToast";
import PageLoading from "../components/PageLoading";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const PlaceOrder = ({ navigation, socket }) => {
  const { token, usersData } = useContext(LoginContext);
  const { lang } = useContext(LangContext);

  const axiosPrivate = useAxiosPrivate();

  const bottomsheet = useRef(1);
  const snapPoint = useMemo(() => ["70%"], []);
  const OrderNo = useRef();

  const [field, setField] = useState([]);
  const [count, setCount] = useState(1);
  const [isSearched, setIsSearched] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [bottomsheetData, setBottomsheetData] = useState([]);
  const [bottomsheetLoading, setBottomsheetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldsData, setFieldsData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [sendedTo, setSendedTo] = useState([]);

  const getChildData = (field) => {
    setFieldsData((prev) => [...prev, field]);
  };

  const handleAddItem = () => {
    if (count - fieldsData.length === 1 && OrderNo.current.value) {
      setField((prev) => [
        ...prev,
        <PlaceOrderFields
          key={count}
          getChildData={getChildData}
          OrderNo={OrderNo.current.value}
          val={null}
        />,
      ]);
      setCount((prev) => prev + 1);
    }
  };

  const handleDeleteItem = () => {
    if (count - fieldsData.length === 1) {
      let copData = fieldsData;
      copData.pop();
      setFieldsData(copData);
    }
    if (count > 1) {
      let copFields = field;
      copFields.pop();
      setField(copFields);
      setCount((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (bottomsheetData.length === 0) {
      try {
        setBottomsheetLoading(true);
        const url = `/api/v1/manageUsers`;
        const data = await axiosPrivate(url, { method: "GET" });

        let copData = [];
        for (let i = 0; i < data?.data.length; i++) {
          const role = JSON.parse(data?.data[i].UserRole);
          let stocksList = [];
          if (role?.Editor?.StocksList) {
            role?.Editor?.StocksList.map((item) => {
              stocksList.push(item.name);
              return stocksList;
            });
          }
          if (
            role.Admin ||
            (usersData?.roles?.StockRes &&
              stocksList?.includes(usersData?.roles?.StockRes[0])) ||
            (usersData?.roles?.StockRes &&
              stocksList?.includes(usersData?.roles?.StockRes[0]))
          ) {
            copData.push({
              UserName: data?.data[i].UserName,
              ProfileImg: data?.data[i].ProfileImg,
              Token: data?.data[i].Token,
            });
          }
        }

        setBottomsheetData(copData);
        if (isFinished === true) bottomsheet.current?.expand();
        setIsFinished(true);
        setBottomsheetLoading(false);
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
        setBottomsheetLoading(false);
      }
    } else {
      if (isFinished === true) bottomsheet.current?.expand();
    }
  };

  console.log(fieldsData);

  const handlePlaceorder = async (item) => {
    try {
      if (
        usersData?.roles?.StockRes?.length > 0 &&
        count - fieldsData.length === 1
      ) {
        setPageLoading(true);
        let bodyData = [];
        for (let i = 0; i < fieldsData.length; i++) {
          bodyData.push({
            Code: fieldsData[i].Item,
            OrderNo: fieldsData[i].OrderNo,
            Quantity: fieldsData[i].Quantity,
            FromStore: usersData.roles.StockRes[0],
            FromUserName: usersData.username,
            FromUserImg: usersData.img,
            ToUser: item.UserName,
          });
        }
        console.log(`bodyData => ${JSON.stringify(bodyData)}`);
        const url = `/api/v1/stocksPlaceOrder`;
        await axiosPrivate(url, {
          method: "POST",
          data: JSON.stringify(bodyData),
        });
        setIsSend(true);
      } else {
        setPageLoading(false);
        alert(`You are not allowed to Exchange`);
      }
    } catch (err) {
      throw new Error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
    }
  };

  const handleSend = async (item) => {
    try {
      if (!isSend) await handlePlaceorder(item);
      const messageURL = `/api/v1/SparePartSendMessage`;
      const messageBody = {
        title: `Placing Order`,
        body: `New Order (${fieldsData[0]?.OrderNo}) From ${usersData?.username}`,
        Tokens: [item?.Token],
      };
      const data = await axiosPrivate(messageURL, {
        method: "POST",
        data: JSON.stringify(messageBody),
      });
      console.log(data?.data);
      showToast(
        `success`,
        lang === "ar" ? Ar.SuccessfullyPlacedOrder : En.SuccessfullyPlacedOrder
      );
      setPageLoading(false);
      setSendedTo((prev) => [...prev, item.UserName]);
    } catch (err) {
      showToast(
        `error`,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setPageLoading(false);
    }
  };

  const renderFlatListItems = ({ item }) => (
    <View
      key={item.UserName}
      style={{
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 50 }}
          source={{ uri: `${EXPO_PUBLIC_BASE_URL}/${item.ProfileImg}` }}
        />
        <Text>{item.UserName}</Text>
      </View>
      <View>
        <TouchableOpacity
          disabled={sendedTo.includes(item.UserName) ? true : false}
          style={[
            styles.btn4,
            {
              opacity: sendedTo.includes(item.UserName) ? 0.7 : 1,
            },
          ]}
          onPress={() => handleSend(item)}
        >
          <Text style={styles.txt1}>
            {sendedTo.includes(item.UserName)
              ? lang === "ar"
                ? Ar.Sent
                : En.Sent
              : lang === "ar"
                ? Ar.Send
                : En.Send}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handler = useCallback(
    debounce(async (e) => {
      try {
        if (e === "") {
          setIsSearched(false);
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
          if (e === "" || data?.data?.length === 0) {
            setIsSearched(false);
          }
        }

        setLoading(false);
      } catch (err) {
        setIsSearched(false);
        showToast(
          `error`,
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.message
        );
      }
    }, 1000),
    []
  );

  const handleSearch = async (e) => {
    if (e === "") {
      setIsSearched(false);
    } else {
      setIsSearched(true);
      setLoading(true);
      handler(e);
    }
  };

  return (
    <GestureHandlerRootView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Navbar navigation={navigation} />
      {pageLoading && <PageLoading />}
      {
        <View
          style={{
            paddingBottom: 55,
            flex: 1,
            width: "100%",
          }}
        >
          <View style={styles.view4}>
            <TextInput
              style={styles.textInput}
              placeholder={
                lang === "ar" ? Ar.SearchForItems : En.SearchForItems
              }
              onChangeText={handleSearch}
            />
            {isSearched && (
              <View style={styles.view5}>
                {loading ? (
                  <View>
                    <ActivityIndicator size={30} color={colors.grey} />
                  </View>
                ) : (
                  searchedData.map((data) => {
                    return (
                      <View style={styles.view5} key={data}>
                        <TouchableOpacity onPress={() => setIsSearched(false)}>
                          <Text
                            style={{ color: colors.grey3, marginBottom: 4 }}
                          >
                            {data}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
          <View style={styles.view4}>
            <TextInput
              ref={OrderNo}
              onChangeText={(e) => (OrderNo.current.value = e)}
              style={styles.textInput}
              placeholder={lang === "ar" ? Ar.OrderNo : En.OrderNo}
              placeholderTextColor="grey"
            />
          </View>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.view2}>{field.map((item) => item)}</View>
            <View style={styles.view3}>
              <TouchableOpacity style={styles.btn2} onPress={handleAddItem}>
                <Text style={styles.txt1}>
                  {lang === "ar" ? Ar.Add : En.Add}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn3} onPress={handleDeleteItem}>
                <Text style={styles.txt1}>
                  {lang === "ar" ? Ar.Delete : En.Delete}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.view1}>
            <TouchableOpacity
              disabled={fieldsData.length === 0 ? true : false}
              style={[
                styles.btn1,
                {
                  opacity: fieldsData.length === 0 ? 0.7 : 1,
                },
              ]}
              onPress={handleFinish}
            >
              {bottomsheetLoading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.txt1}>
                  {lang === "ar" ? Ar.Finish : En.Finish}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      }

      {isFinished && (
        <BottomSheet
          ref={bottomsheet}
          index={0}
          // onChange={handleSheetChange}
          snapPoints={snapPoint}
          enablePanDownToClose
        >
          <BottomSheetFlatList
            keyboardShouldPersistTaps="always"
            data={bottomsheetData}
            keyExtractor={(item) => item.UserName}
            renderItem={renderFlatListItems}
            style={{}}
            ListHeaderComponent={<View></View>}
          />
        </BottomSheet>
      )}
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"PlaceOrder"}
      />
      {/* <Toast /> */}
    </GestureHandlerRootView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
    justifyContent: "center",
    alignItems: "center",
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
