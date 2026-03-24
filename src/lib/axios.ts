import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createServerApi = async () => {
  const { headers } = await import("next/headers");
  
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  return axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
  });
};