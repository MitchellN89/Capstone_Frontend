import axios from "axios";

const domain = import.meta.env.VITE_BACKEND_DOMAIN;

export async function apiCall(url, method = "get", body, useToken = true) {
  const token = localStorage.getItem("key");
  const headers = { Authorization: useToken ? `Bearer ${token}` : "" };

  const result = await axios({
    method: method,
    url: `${domain}${url}`,
    data: body,
    headers: headers,
  });

  return result.data;
}
