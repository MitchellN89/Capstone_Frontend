import { createContext, useContext, useState, useReducer } from "react";
import axios from "axios";
const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "ADD_EVENT":
      return {};
    case "LOGIN_USER":
      return action.payload;
    default:
      return state;
  }
};

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, {});
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    setTheme((st) => {
      if (st === "light") {
        return "dark";
      } else {
        return "light";
      }
    });
  };

  const signUpUser = async (
    firstName,
    lastName,
    password,
    emailAddress,
    phoneNumber,
    companyName,
    websiteUrl,
    accountType
  ) => {
    try {
      setIsLoading(true);
      const dbResponse = await axios.post(
        "http://localhost:8080/auth/createuser",
        {
          firstName,
          lastName,
          password,
          emailAddress,
          phoneNumber,
          companyName,
          websiteUrl,
          accountType,
        }
      );
      const { response } = dbResponse.data;
      const { status } = dbResponse;
      return { status, response };
    } catch (err) {
      console.error(err);
      const { response } = err.response.data;
      const { status } = err.response;

      return {
        status,
        response,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginUserWithCredentials = async (
    emailAddress,
    password,
    accountType
  ) => {
    try {
      setIsLoading(true);
      const dbResponse = await axios.post(
        "http://localhost:8080/auth/loginwithcredentials",
        {
          password,
          emailAddress,
          accountType,
        }
      );
      const { data, token, response } = dbResponse.data;
      const { status } = dbResponse;

      dispatch({ type: "LOGIN_USER", payload: data });
      localStorage.setItem("key", token);

      return { status, response };
    } catch (err) {
      console.error(err);
      const { response } = err.response.data;
      const { status } = err.response;

      return {
        status,
        response,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const provide = {
    user,
    isLoading,
    loginUserWithCredentials,
    signUpUser,
  };

  return (
    <UserContext.Provider value={provide}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
