import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";

import { colors } from "../globals/styles";
import { Ar, En } from "../globals/language";
import { LangContext } from "../contexts/LanguageContext";

const getDate = (date) => {
  const dt = new Date(date);
  dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
  return dt.toLocaleString();
};

const Post = ({ item }) => {
  const { lang } = useContext(LangContext);
  return (
    <View style={styles.view1}>
      <View style={styles.view4}>
        <View style={[styles.viewfirst, { position: "relative" }]}>
          <View style={[styles.circle, { backgroundColor: colors.logo }]}>
            <Text style={{ color: "white" }}>1</Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.logo,
              width: "48%",
              position: "absolute",
              right: 0,
            }}
          ></View>
        </View>

        <View style={[styles.viewSecond, { position: "relative" }]}>
          <View
            style={{
              height: 1,
              backgroundColor: colors.logo,
              width: "48%",
              position: "absolute",
              left: 0,
            }}
          ></View>
          <View style={[styles.circle, { backgroundColor: colors.logo }]}>
            <Text style={{ color: "white" }}>2</Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.logo,
              width: "48%",
              position: "absolute",
              right: 0,
            }}
          ></View>
        </View>

        <View style={styles.viewThird}>
          <View
            style={{
              height: 1,
              backgroundColor: colors.logo,
              width: "48%",
              position: "absolute",
              left: 0,
            }}
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
                {item.ItemFromNo && item.ItemFromNo !== `undefined`
                  ? item.ItemFromNo
                  : item.ItemFrom}
              </Text>
            </Text>
            <Text style={styles.txt2}>
              Date: {new Date(item?.DateTime).toLocaleString()}
            </Text>
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
            <Text style={styles.txt2}>
              Date: {new Date(item?.DateTime).toLocaleString()}
            </Text>
          </View>
        ) : item.ItemStatus === "Exchange" ? (
          <View style={styles.view3}>
            <Text style={styles.txt1}>
              Item <Text style={{ color: "red" }}>{item.Code} </Text>
              has been consumed From{" "}
              <Text style={{ color: "red" }}>{item.ItemFrom}</Text> by{" "}
              <Text style={{ color: "red" }}>{item.ItemTo}</Text>
            </Text>
            <Text style={styles.txt2}>
              Date: {new Date(item?.DateTime).toLocaleString()}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  view1: {
    backgroundColor: colors.white,
    flexDirection: "column",
    height: 150,
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
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewSecond: {
    width: "33%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewThird: {
    width: "33%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
