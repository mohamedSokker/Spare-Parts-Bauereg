import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";
import { showToast } from "../functions/showToast";
import { NotContext } from "../contexts/NotificationContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import PageLoading from "./PageLoading";

const categories = {
  New: `/api/v1/stocksNewItem`,
  Transition: `/api/v1/StockTransition`,
  Recieve: `/api/v1/stocksRecieve`,
  Exchange: `/api/v1/stocksExchange`,
};
const CartPost = ({ item, data, setPageLoading }) => {
  const { lang } = useContext(LangContext);
  const { setCart } = useContext(NotContext);

  const [isSent, setIsSent] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  // const handleSend = async () => {
  //   try {
  //     setIsProcessing(true);
  //     const url = categories[item.ItemStatus];
  //     await axiosPrivate(url, { method: "POST", data: JSON.stringify(item) });
  //     const result = data.filter((d) => d.id !== item.id);
  //     await AsyncStorage.setItem("cart", JSON.stringify(result));
  //     setCart(result);
  //     showToast(
  //       `success`,
  //       lang === "ar" ? `تم الارسال بنجاح` : `Successfully Sent`
  //     );
  //     setIsProcessing(false);
  //   } catch (err) {
  //     showToast(
  //       `error`,
  //       err?.response?.data?.message
  //         ? err?.response?.data?.message
  //         : err?.message
  //     );
  //     setIsProcessing(false);
  //   }
  // };

  const handleDelete = async () => {
    try {
      setPageLoading(true);
      const greaterThanIdResult = data.filter((d) => d.id > item.id);
      const lessThanIdResult = data.filter((d) => d.id < item.id);
      let filterResult = [];
      greaterThanIdResult.map((d) => {
        if (d.Code === item.Code) {
          filterResult.push({
            ...d,
            Quantity:
              item.ItemStatus === `New` || item.ItemStatus === `Recieve`
                ? Number(d.Quantity) - Number(item.q)
                : Number(d.Quantity) + Number(item.q),
            stockQuantity:
              item.ItemStatus === `New` || item.ItemStatus === `Recieve`
                ? Number(d.stockQuantity) - Number(item.q)
                : Number(d.stockQuantity) + Number(item.q),
            id: Number(d.id) - 1,
          });
        } else {
          filterResult.push({ ...d, id: Number(d.id) - 1 });
        }
      });
      let result = [];
      result.push(...lessThanIdResult, ...filterResult);
      await AsyncStorage.setItem("cart", JSON.stringify(result));
      setCart(result);

      console.log(result);
      setPageLoading(false);
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

  // const arr = [
  //   { id: 2, store: `Main`, q: 3, code: "800" },
  //   { id: 1, store: `Main`, q: 1, code: "800" },
  //   { id: 4, store: `Store10`, q: 2, code: "800" },
  //   { id: 3, store: `Store10`, q: 5, code: "800" },
  // ];
  // useEffect(() => {
  //   console.log(`Line......................`);
  //   const result = arr.sort((a, b) => b.id - a.id);
  //   console.log(result);
  // }, []);
  return (
    <View style={styles.view1}>
      {isProcessing && <PageLoading />}
      <View style={styles.view4}>
        <View style={[styles.circle, { backgroundColor: colors.logo }]}>
          <Text style={{ color: "white" }}>1</Text>
        </View>
        <View
          style={{ height: 1, backgroundColor: colors.logo, width: "24%" }}
        ></View>
        <View style={[styles.circle, { backgroundColor: colors.logo }]}>
          <Text style={{ color: "white" }}>2</Text>
        </View>
        <View
          style={{ height: 1, backgroundColor: colors.logo, width: "24%" }}
        ></View>
        <View
          style={[
            styles.circle,
            {
              backgroundColor:
                item.ItemStatus === "Transition" && item.IsPending === "true"
                  ? colors.white
                  : colors.logo,
            },
          ]}
        >
          <Text
            style={{
              color:
                item.ItemStatus === "Transition" && item.IsPending === "true"
                  ? colors.logo
                  : colors.white,
            }}
          >
            3
          </Text>
        </View>
      </View>
      <View style={styles.view2}>
        {/* First */}
        {item?.ItemStatus === "Transition" ||
        item?.ItemStatus === "Exchange" ? (
          <View style={styles.viewfirst}>
            <Image
              source={require(`../../assets/Stocks.jpg`)}
              resizeMode="stretch"
              style={styles.img}
            />
          </View>
        ) : (
          <View style={styles.viewfirst}>
            <Text
              style={{ fontSize: 12, fontWeight: "900", color: colors.logo }}
            >
              {item?.ItemFrom}
            </Text>
            {/* <Text
              style={{ fontSize: 12, fontWeight: "900", color: colors.logo }}
            >
              {item?.ItemFromNo}
            </Text> */}
          </View>
        )}
        {/* Second */}
        <View style={styles.viewSecond}>
          <Text style={{ fontSize: 12, fontWeight: "900", color: colors.logo }}>
            {item?.Code}
          </Text>
        </View>

        {/* Third */}

        {item?.ItemStatus === "Exchange" && item.ItemToNo === "Equipment" ? (
          <View style={styles.viewThird}>
            <Image
              source={require(`../../assets/Eq.jpg`)}
              resizeMode="stretch"
              style={styles.img}
            />
          </View>
        ) : item?.ItemStatus === "Exchange" && item?.ItemToNo === "Workshop" ? (
          <View style={styles.viewThird}>
            <Image
              source={require(`../../assets/Workshop.jpg`)}
              resizeMode="stretch"
              style={styles.img}
            />
          </View>
        ) : (
          <View style={styles.viewThird}>
            <Image
              source={require(`../../assets/Stocks.jpg`)}
              resizeMode="stretch"
              style={styles.img}
            />
          </View>
        )}
      </View>
      <View style={styles.view3}>
        {item.ItemStatus === "New" ? (
          <View style={styles.view3}>
            <Text style={styles.txt1}>
              Item <Text style={{ color: "red" }}>{item.Code}</Text> has been
              shipped to <Text style={{ color: "red" }}>{item.ItemTo} </Text>
              From{" "}
              <Text style={{ color: "red" }}>
                {item.catData ? item.catData : item.ItemFrom}
              </Text>
            </Text>
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "flex-start",
                paddingRight: 12,
              }}
            >
              <Text style={styles.txt2}>
                Date: {new Date().toLocaleString()}
              </Text>
              <Text style={styles.txt2}>Quantity: {item.q}</Text>
            </View>
            <View style={{ width: "100%" }}>
              <Text>Quantity in Stock : {item.stockQuantity}</Text>
            </View>
          </View>
        ) : item.ItemStatus === "Transition" ? (
          <View style={styles.view3}>
            {/* <Text style={[styles.txt1]}> */}
            {item.IsPending === "true" ? (
              <Text style={styles.txt1}>
                Item <Text style={{ color: "red" }}>{item.Code}</Text> has Left{" "}
                <Text style={{ color: "red" }}>{item.ItemFrom}</Text> towards{" "}
                <Text style={{ color: "red" }}>{item.ItemTo}</Text>
              </Text>
            ) : (
              <Text style={styles.txt1}>
                Item <Text style={{ color: "red" }}>{item.Code}</Text> has Left{" "}
                <Text style={{ color: "red" }}>{item.ItemFrom}</Text> and
                recieved by
                <Text style={{ color: "red" }}> {item.ItemTo}</Text>
              </Text>
            )}
            {/* </Text> */}
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "flex-start",
                paddingRight: 12,
              }}
            >
              <Text style={styles.txt2}>
                Date: {new Date().toLocaleString()}
              </Text>
              <Text style={styles.txt2}>Quantity: {item.q}</Text>
            </View>
            <View style={{ width: "100%" }}>
              <Text>Quantity in Stock : {item.stockQuantity}</Text>
            </View>
          </View>
        ) : item.ItemStatus === "Exchange" ? (
          <View style={styles.view3}>
            <Text style={styles.txt1}>
              Item <Text style={{ color: "red" }}>{item.Code} </Text>
              has been consumed From{" "}
              <Text style={{ color: "red" }}>{item.ItemFrom}</Text> by{" "}
              <Text style={{ color: "red" }}>{item.ItemTo}</Text>
            </Text>
            <View
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "flex-start",
                paddingRight: 12,
              }}
            >
              <Text style={styles.txt2}>
                Date: {new Date().toLocaleString()}
              </Text>
              <Text style={styles.txt2}>Quantity: {item.q}</Text>
            </View>
            <View style={{ width: "100%" }}>
              <Text>Quantity in Stock : {item.stockQuantity}</Text>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 6,
            paddingHorizontal: 30,
            borderRadius: 6,
            opacity: isSent ? 0.5 : 1,
          }}
          disabled={isSent ? true : false}
          onPress={handleSend}
        >
          <Text
            style={{ color: colors.white, fontSize: 14, fontWeight: "600" }}
          >
            Send
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            width: "90%",
            backgroundColor: "red",
            padding: 6,
            paddingHorizontal: 30,
            borderRadius: 6,
            opacity: isDelete ? 0.5 : 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={isDelete ? true : false}
          onPress={handleDelete}
        >
          <Text
            style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartPost;

const styles = StyleSheet.create({
  view1: {
    backgroundColor: colors.white,
    flexDirection: "column",
    paddingVertical: 10,
    // height: 150,
    // borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    gap: 5,
    marginBottom: 8,
  },
  view4: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.logo,
    justifyContent: "center",
    alignItems: "center",
  },
  view2: {
    width: "100%",
    gap: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  view3: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 4,
    paddingLeft: 12,
  },
  img: {
    width: 20,
    height: 20,
  },
  txt1: {
    fontWeight: "500",
  },
  txt2: {
    color: colors.grey3,
  },
  viewfirst: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewSecond: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewThird: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
});
