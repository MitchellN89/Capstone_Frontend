import axios from "axios";

const domain = import.meta.env.VITE_BACKEND_DOMAIN;

export async function apiCall(url, method = "get", body, useToken = true) {
  const token = sessionStorage.getItem("key");

  const headers = {
    Authorization: useToken ? `Bearer ${token}` : "",
  };

  console.log("API CALL: ", { url, method, body, useToken, token });
  const result = await axios({
    method: method,
    url: `${domain}${url}`,
    data: body,
    headers: headers,
    timeout: 10000,
  });

  return result.data;
}
