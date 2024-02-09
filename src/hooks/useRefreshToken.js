import { useContext } from "react";

import axios from "../api/axios";
import { LoginContext } from "../contexts/LoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useRefreshToken = () => {
  const { setToken, setUsersData, token } = useContext(LoginContext);

  const refresh = async () => {
    const response = await axios.get("/sparePartRefresh", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    setToken((prev) => {
      return response.data.token;
    });
    await AsyncStorage.setItem("token", response.data.token);
    const user = { ...response.data.user };
    setUsersData(user);

    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

    return { newAccessToken: response.data.token, user: user };
  };
  return refresh;
};

export default useRefreshToken;
