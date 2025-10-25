import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // puedes agregar más configs si querés
  // timeout: 10000,
  // headers: { "Content-Type": "application/json" },
});

export default api;
