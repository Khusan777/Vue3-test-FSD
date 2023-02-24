import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${process.env.VUE_APP_HOST_API}/`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
