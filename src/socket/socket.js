import { io } from "socket.io-client";
import { BASE_URL } from "@env";

export const socket = io(BASE_URL, { autoConnect: false });
