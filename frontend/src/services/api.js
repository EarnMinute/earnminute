import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
const user = JSON.parse(localStorage.getItem("user"));

if (user?.token) {
config.headers.Authorization = `Bearer ${user.token}`;
}

return config;
});

/* ===============================
CHAT API
================================ */

export const chatAPI = {
getConversations: () => {
return API.get("/chat/conversations");
},

startConversation: (data) => {
return API.post("/chat/conversations", data);
},

getMessages: (conversationId, page = 1) => {
return API.get(`/chat/conversations/${conversationId}/messages?page=${page}`);
},

sendMessage: (data) => {
return API.post("/chat/messages", data);
},

markConversationRead: (conversationId) => {
return API.patch(`/chat/conversations/${conversationId}/read`);
}
};

export default API;
