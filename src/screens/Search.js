import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";

import { colors } from "../globals/styles";
import SearchNavbar from "../components/SearchNavbar";
import { LoginContext } from "../contexts/LoginContext";
import Footer from "../components/Footer";

const Search = ({ navigation, socket }) => {
  const { token, usersData } = useContext(LoginContext);

  const [isSearched, setIsSearched] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [finished, setFinished] = useState(false);

  console.log(searchedData);
  return (
    <View style={styles.container}>
      <SearchNavbar
        navigation={navigation}
        setIsSearched={setIsSearched}
        setSearchedData={setSearchedData}
        setLoading={setLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        finished={finished}
        initial={`Search`}
      />
      <View style={styles.view2}>
        {isSearched && (
          <ScrollView style={styles.view5} showsVerticalScrollIndicator={false}>
            {loading && (
              <View>
                <ActivityIndicator size={30} color={colors.grey} />
              </View>
            )}
            {searchedData.map((data, i) => {
              return (
                <View style={styles.view5} key={i}>
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText(data?.Code);
                      setIsSearched(false);
                      navigation.navigate("SearchedPosts", {
                        Code: data?.Code,
                        Quantity: data?.Quantity,
                        Store: data?.Store,
                      });
                      setFinished(true);
                    }}
                  >
                    <Text style={{ color: colors.grey3, marginBottom: 4 }}>
                      {`${i + 1}- Code: ${data.Code}, SabCode: ${
                        data.SabCode
                      }, Description: ${data.Description}, Store: ${
                        data.Store
                      }, Quantity: ${data.Quantity}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
      <Footer
        navigation={navigation}
        socket={socket}
        token={token}
        usersData={usersData}
        initial={"Search"}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    backgroundColor: colors.grey10,
  },
  view2: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  view5: {
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 8,
  },
});
