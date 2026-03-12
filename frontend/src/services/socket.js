import { io } from "socket.io-client";

let socket = null;

const getSocketURL = () => {

const apiURL = import.meta.env.VITE_API_BASE_URL;

if (!apiURL) {
return "http://localhost:5000";
}

/* remove /api/v1 from API url to get base server url */

return apiURL.replace("/api/v1", "");

};

export const connectSocket = () => {

if (!socket) {

const SOCKET_URL = getSocketURL();

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