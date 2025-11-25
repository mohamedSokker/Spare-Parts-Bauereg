import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import Toast from "react-native-toast-message";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";
import { colors } from "../globals/styles";
import Scan from "../components/Scan";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { LoginContext } from "../contexts/LoginContext";

const ScanItem = ({ navigation, socket, hasPermission }) => {
  const { token, usersData } = useContext(LoginContext);

  const [scanData, setScanData] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelay, setIsDelay] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  // console.log(searchedData);

  const handleChildData = (dataFromChild) => {
    setScanData(dataFromChild?.data);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsDelay(true);
    }, 300);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (scanData !== "") {
          setIsLoading(true);
          const url = `/api/v1/sparePartCheckItemInStore`;
          const data = await axiosPrivate(url, {
            method: "POST",
            data: { Code: scanData },
          });
          console.log(`data: ${JSON.stringify(data?.data)}`);
          console.log(usersData?.roles);
          const result = data?.data?.find(
            (d) =>
              usersData?.roles?.StockRes &&
              d?.Store === usersData?.roles?.StockRes[0]
          );
          console.log(`result: ${JSON.stringify(result)}`);
          let newResult = {};
          // console.log(usersData.roles.StockRes[0]);
          if (!result) {
            console.log("from not result");
            newResult = data?.data.find((d) => d.Code === scanData);
            if (!newResult) throw new Error(`No Found Of this Code in Store`);
            newResult = { ...newResult, Quantity: 0 };
          } else {
            console.log("from result");
            newResult = { ...result };
          }
          // console.log(`data => ${JSON.stringify(newResult)}`);
          setSearchedData([newResult]);
          setIsLoading(false);
        } else {
          setSearchedData([]);
        }
      } catch (err) {
        showToast(
          `error`,
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.message
        );
        setIsLoading(false);
      }
    };
    getData();
  }, [scanData]);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} initial={`ScanItem`} />
      {isDelay && (
        <Scan onChildData={handleChildData} hasPermission={hasPermission} />
      )}
      {isLoading && (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 55,
          }}
        >
          <ActivityIndicator size={30} color={colors.logo} />
        </View>
      )}
      {searchedData.length > 0 && (
        <View
          style={{
            backgroundColor: colors.white,
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: 16,
            padding: 8,
            position: "absolute",
            bottom: 50,
          }}
        >
          <Text>Code: {searchedData[0]?.Code}</Text>
          <Text>SabCode: {searchedData[0]?.SabCode}</Text>
          <Text>Quantity: {searchedData[0]?.Quantity}</Text>
          <Text>Description: {searchedData[0]?.Description}</Text>
          <Text>Detail: {searchedData[0]?.Detail}</Text>
        </View>
      )}

      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"SelectNewCategory"}
      />
      {/* {!isLoading && <Toast />} */}
    </View>
  );
};

export default ScanItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey10,
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 55,
  },
});
