import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.107:5000/api/v1",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
