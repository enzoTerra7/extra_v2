import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const err = error.response;
    if (err.status === 401) {
      Cookies.remove("user");
      window.location.href = "/";
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;

export type AxiosError = {
  response: {
    data: any
  }
}