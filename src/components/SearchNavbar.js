import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import React, { useCallback } from "react";
import { Icon } from "react-native-elements";
// import Toast from "react-native-toast-message";
import { debounce } from "lodash";

import { colors } from "../globals/styles";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showToast } from "../functions/showToast";

const SearchNavbar = ({
  navigation,
  setIsSearched,
  setSearchedData,
  setLoading,
  searchText,
  setSearchText,
  finished,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const handler = useCallback(
    debounce(async (e) => {
      try {
        if (e === "") {
          setIsSearched(false);
        } else {
          setLoading(true);
          const url = `/api/v1/sparePartGetItems`;
          const data = await axiosPrivate(url, {
            method: "POST",
            data: { Code: e },
          });
          setSearchedData(data?.data);
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
    setSearchText(e);
    if (e === "") {
      setIsSearched(false);
    } else {
      setIsSearched(true);
      setLoading(true);
      handler(e);
    }
  };

  return (
    <View style={styles.view1}>
      <View style={styles.view3}>
        <View style={styles.view4}>
          <TextInput
            style={styles.textInput}
            onChangeText={handleSearch}
            value={searchText}
          />
          <TouchableOpacity
            disabled={finished ? false : true}
            style={[styles.view5, { opacity: finished ? 1 : 0.5 }]}
            // onPress={navigation.navigate("SearchedPosts", { Code: searchText })}
          >
            <Icon
              type={`ionicon`}
              name={`search-outline`}
              color={colors.logo}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* <Toast /> */}
    </View>
  );
};

export default SearchNavbar;

const styles = StyleSheet.create({
  view1: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.logo,
    gap: 20,
  },
  view2: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    paddingLeft: 15,
  },
  txt1: {
    color: colors.white,
    fontWeight: "900",
  },
  view3: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    height: "100%",
  },
  view4: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    height: "70%",
    borderColor: colors.grey10,
    paddingLeft: 8,
    borderRadius: 100,
    color: colors.white,
  },
  view5: {
    position: "absolute",
    right: 20,
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.grey10,
    padding: 6,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  img: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 40,
    resizeMode: "contain",
  },
});
