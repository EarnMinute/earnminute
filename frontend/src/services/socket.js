import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

let socket = null;

export const connectSocket = () => {
if (!socket) {
socket = io(SOCKET_URL, {
withCredentials: true,
transports: ["websocket"]
});
}
return socket;
};

export const getSocket = () => {
return socket;
};

export const disconnectSocket = () => {
if (socket) {
socket.disconnect();
socket = null;
}
};
