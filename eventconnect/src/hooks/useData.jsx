import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    axios[method](`${domain}${url}`, config)
      .then((data) => {
        if (!ignore) {
          setData(data.data.data);
        }
        console.log("internal use only: data retrieved");
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
