import axios from "axios";
import { EXPO_PUBLIC_BASE_URL } from "@env";

console.log(EXPO_PUBLIC_BASE_URL);

export default axios.create({
  baseURL: EXPO_PUBLIC_BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: EXPO_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
