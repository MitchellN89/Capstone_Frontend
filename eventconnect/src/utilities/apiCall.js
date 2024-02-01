import axios from "axios";

const domain = import.meta.env.VITE_BACKEND_DOMAIN;

// this function was made as a reusable way to make api calls

export async function apiCall(url, method = "get", body, useToken = true) {
  // get token from sessionStorage
  const token = sessionStorage.getItem("key");

  //set headers and attach token to Authorization
  const headers = {
    Authorization: useToken ? `Bearer ${token}` : "",
  };

  // make api call
  const result = await axios({
    method: method,
    url: `${domain}${url}`,
    data: body,
    headers: headers,
    timeout: 20000,
  });

  // send result.data back
  return result.data;
}
