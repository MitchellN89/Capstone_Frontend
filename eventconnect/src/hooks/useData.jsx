import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utilities/apiCall";

const domain = import.meta.env.VITE_BACKEND_DOMAIN;

export default function useData(
  url,
  body = {},
  method = "get",
  useAuthentication = true
) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);

  const handleTrigger = () => {
    setTrigger((cur) => !cur);
  };

  useEffect(() => {
    let ignore = false;

    const token = localStorage.getItem("key");
    const config = {
      headers: {
        Authorization: useAuthentication ? `Bearer ${token}` : "",
      },
      body: body,
    };
    setIsLoading(true);

    apiCall(url, method, body)
      .then((data) => {
        if (!ignore) {
          setData(data.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          navigate(-1);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [url, trigger]);
  return [data, isLoading, handleTrigger];
}
