import { createContext, useContext, useReducer, useEffect } from "react";

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "PROCESSING_REQUEST":
      return { ...state, isLoading: true };
    case "REQUEST_FAILED":
      return { ...state, isLoading: false };
    case "SET_USER":
      return { user: action.payload, isLoading: false };
    case "LOGOUT_USER":
      return { user: {}, isLoading: false };
    default:
      return state;
  }
};

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: {},
    isLoading: false,
  });

  useEffect(() => {
    console.log("UserProvider.jsx > state: ", state);
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
