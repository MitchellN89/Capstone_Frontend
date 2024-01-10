import { useEffect, useRef, useState } from "react";
import { apiCall } from "../utilities/apiCall";

export default function useData(urlStr, queryParams, handleError, repeatTime) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(true);

  // const counter = useRef(0);

  const handleTrigger = () => {
    setTrigger((curState) => !curState);
  };

  useEffect(() => {
    // counter.current += 1;
    // console.log(counter.current);
    let ignore = false;
    let timer;

    // if (counter.current >= 3) {
    console.log("useData > useEfect has run");
    let queryString = "";
    if (Object.keys(queryParams).length) {
      queryString += "?";

      Object.keys(queryParams).forEach((key, index, array) => {
        queryString += `${key}=${queryParams[key]}`;
        if (index < array.length - 1) queryString += "&";
      });

      for (let param in queryParams) {
        queryString += `${param}=`;
      }
    }
    setIsLoading(true);
    apiCall(`${urlStr}${queryString}`)
      .then((result) => {
        if (!ignore) {
          setData(result.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          handleError(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    if (repeatTime) {
      timer = setTimeout(() => {
        handleTrigger();
      }, repeatTime);
    }
    // }

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [trigger, queryParams]);

  return [data, isLoading, handleTrigger];
}
